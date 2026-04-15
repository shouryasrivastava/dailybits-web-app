import json
import os
import traceback

from django.db import connection, transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")


def _get_published_problems():
    with connection.cursor() as cur:
        cur.execute("""
            SELECT problem_id, problem_title, difficulty_level,
                   estimate_time_baseline, algorithms
            FROM user_problem_library_view
            ORDER BY difficulty_level, problem_id
        """)
        cols = [c[0] for c in cur.description]
        return [dict(zip(cols, row)) for row in cur.fetchall()]


def _build_gemini_prompt(user_message, problems):
    catalog = "\n".join(
        f"- ID={p['problem_id']}, \"{p['problem_title']}\", "
        f"difficulty={p['difficulty_level']}, "
        f"est_minutes={p['estimate_time_baseline']}, "
        f"tags={p['algorithms']}"
        for p in problems
    )
    return (
        "You are a coding study-plan assistant for DailyBits. "
        "The user will describe their goals (topics, time, skill level). "
        "You MUST respond with valid JSON only — no markdown, no commentary.\n\n"
        "Available problems:\n"
        f"{catalog}\n\n"
        "Respond with this exact JSON structure:\n"
        '{"plan_name":"<short name>","problems":[{"problem_id":<int>,'
        '"estimate_time":<minutes>}],"message":"<brief explanation>"}\n\n'
        "Rules:\n"
        "- Pick 1-10 problems that best fit the user's request.\n"
        "- Only use problem IDs from the catalog above.\n"
        "- Respect the user's available time if mentioned.\n"
        "- Order problems from easier to harder.\n\n"
        f"User request: {user_message}"
    )


def _call_gemini(prompt):
    """Call the Gemini API. Returns parsed dict or None on failure."""
    if not GEMINI_API_KEY:
        return None
    try:
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            text = text.rsplit("```", 1)[0].strip()
        return json.loads(text)
    except Exception:
        traceback.print_exc()
        return None


def _mock_plan(problems, user_message):
    """Fallback when Gemini key is absent or call fails."""
    lower = user_message.lower()
    selected = []

    if "easy" in lower or "beginner" in lower:
        selected = [p for p in problems if p["difficulty_level"] == "Easy"][:5]
    elif "hard" in lower or "advanced" in lower:
        selected = [p for p in problems if p["difficulty_level"] == "Hard"][:3]
        selected += [p for p in problems if p["difficulty_level"] == "Medium"][:2]
    elif "dynamic programming" in lower or " dp" in lower:
        selected = [p for p in problems if "Dynamic Programming" in str(p.get("algorithms", ""))][:5]
    elif "array" in lower:
        selected = [p for p in problems if "Array" in str(p.get("algorithms", ""))][:5]
    elif "tree" in lower:
        selected = [p for p in problems if "Tree" in str(p.get("algorithms", ""))][:5]
    elif "stack" in lower or "queue" in lower:
        selected = [p for p in problems if any(t in str(p.get("algorithms", "")) for t in ("Stack", "Queue"))][:5]
    else:
        easy = [p for p in problems if p["difficulty_level"] == "Easy"][:2]
        med = [p for p in problems if p["difficulty_level"] == "Medium"][:2]
        hard = [p for p in problems if p["difficulty_level"] == "Hard"][:1]
        selected = easy + med + hard

    if not selected:
        selected = problems[:5]

    return {
        "plan_name": "Study Plan",
        "problems": [
            {"problem_id": p["problem_id"], "estimate_time": p["estimate_time_baseline"] or 20}
            for p in selected
        ],
        "message": (
            "Here's a personalized study plan based on your request. "
            "The problems are ordered by increasing difficulty."
        ),
    }


@api_view(["POST"])
def generate_plan(request):
    account_number = request.data.get("account_number")
    message = request.data.get("message", "").strip()

    if not account_number or not message:
        return Response({"error": "account_number and message are required"}, status=400)

    problems = _get_published_problems()
    if not problems:
        return Response({"error": "No published problems available"}, status=404)

    prompt = _build_gemini_prompt(message, problems)
    plan_data = _call_gemini(prompt)

    if plan_data is None:
        plan_data = _mock_plan(problems, message)

    plan_name = plan_data.get("plan_name", "Study Plan")
    plan_problems = plan_data.get("problems", [])
    ai_message = plan_data.get("message", "Here is your study plan.")

    valid_ids = {p["problem_id"] for p in problems}
    plan_problems = [pp for pp in plan_problems if pp.get("problem_id") in valid_ids]

    if not plan_problems:
        return Response({"error": "Could not generate a valid plan"}, status=500)

    total_time = sum(pp.get("estimate_time", 0) for pp in plan_problems)

    with transaction.atomic():
        with connection.cursor() as cur:
            cur.execute(
                """INSERT INTO study_plan (account_number, plan_name, time_available, is_accepted)
                   VALUES (%s, %s, %s, FALSE) RETURNING plan_id""",
                [account_number, plan_name, total_time],
            )
            plan_id = cur.fetchone()[0]

            for pp in plan_problems:
                cur.execute(
                    """INSERT INTO study_plan_problems (plan_id, problem_id, estimate_time_assigned)
                       VALUES (%s, %s, %s)""",
                    [plan_id, pp["problem_id"], pp.get("estimate_time", 20)],
                )

            cur.execute(
                """INSERT INTO chat_query (account_number, user_message, ai_response)
                   VALUES (%s, %s, %s)""",
                [account_number, message, ai_message],
            )

    problem_details = []
    for pp in plan_problems:
        p = next((x for x in problems if x["problem_id"] == pp["problem_id"]), None)
        if p:
            problem_details.append({
                "problem_id": p["problem_id"],
                "problem_title": p["problem_title"],
                "difficulty_level": p["difficulty_level"],
                "algorithms": p["algorithms"],
                "estimate_time": pp.get("estimate_time", p["estimate_time_baseline"]),
            })

    return Response({
        "plan_id": plan_id,
        "plan_name": plan_name,
        "problems": problem_details,
        "ai_message": ai_message,
        "total_time": total_time,
    })


@api_view(["POST"])
def accept_plan(request):
    account_number = request.data.get("account_number")
    plan_id = request.data.get("plan_id")

    if not account_number or not plan_id:
        return Response({"error": "account_number and plan_id are required"}, status=400)

    with transaction.atomic():
        with connection.cursor() as cur:
            cur.execute(
                "SELECT is_accepted FROM study_plan WHERE plan_id = %s AND account_number = %s",
                [plan_id, account_number],
            )
            row = cur.fetchone()
            if not row:
                return Response({"error": "Plan not found"}, status=404)
            if row[0]:
                return Response({"error": "Plan already accepted"}, status=400)

            # Add all plan problems to todo. If a problem already exists in todo,
            # treat it as coming from study plan and attach this plan_id.
            cur.execute(
                """
                INSERT INTO todo_item (account_number, problem_id, plan_id, source)
                SELECT
                    %s,
                    spp.problem_id,
                    %s,
                    'study_plan'
                FROM study_plan_problems spp
                WHERE spp.plan_id = %s
                ON CONFLICT (account_number, problem_id)
                DO UPDATE SET
                    plan_id = EXCLUDED.plan_id,
                    source = 'study_plan',
                    added_at = CURRENT_TIMESTAMP
                """,
                [account_number, plan_id, plan_id],
            )

            cur.execute(
                "UPDATE study_plan SET is_accepted = TRUE WHERE plan_id = %s",
                [plan_id],
            )

    return Response({"success": True, "plan_id": plan_id})


def _build_code_check_prompt(code, problem_title, problem_description):
    return (
        "You are a code reviewer for a coding practice platform. "
        "Evaluate whether the submitted Python code is a valid, correct solution to the given problem. "
        "You MUST respond with valid JSON only — no markdown, no commentary.\n\n"
        f"Problem Title: {problem_title}\n"
        f"Problem Description: {problem_description}\n\n"
        f"Submitted Code:\n{code}\n\n"
        "Respond with this exact JSON structure:\n"
        '{\"is_correct\": <true or false>, \"feedback\": \"<brief feedback>\"}\n\n'
        "Rules:\n"
        "- is_correct should be true only if the code appears to correctly solve the problem\n"
        "- If the code is just the starter/template code with no real implementation, mark as false\n"
        "- If the code has a valid algorithmic approach, mark as true even if there are minor style issues\n"
        "- Feedback should be 1-2 sentences, constructive and specific\n"
    )


@api_view(["POST"])
def check_code(request):
    account_number = request.data.get("account_number")
    problem_id = request.data.get("problem_id")
    code = request.data.get("code", "").strip()
    problem_title = request.data.get("problem_title", "")
    problem_description = request.data.get("problem_description", "")

    if not account_number or not problem_id or not code:
        return Response({"error": "account_number, problem_id, and code are required"}, status=400)

    prompt = _build_code_check_prompt(code, problem_title, problem_description)
    result = _call_gemini(prompt)

    if result is None:
        return Response({"error": "Failed to check code with AI"}, status=500)

    is_correct = result.get("is_correct", False)
    feedback = result.get("feedback", "")

    return Response({"is_correct": is_correct, "feedback": feedback})


@api_view(["GET"])
def chat_history(request, account_number):
    with connection.cursor() as cur:
        cur.execute("""
            SELECT query_id, user_message, ai_response, created_at
            FROM chat_query
            WHERE account_number = %s
            ORDER BY created_at DESC
            LIMIT 50
        """, [account_number])
        cols = [c[0] for c in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]

    return Response(rows)
