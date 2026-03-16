"""
Admin API endpoints for the DailyBits dashboard.

Endpoints:
  GET    /admin/dashboard-stats/                  — aggregate counts for the dashboard
  GET    /admin/problems/                         — list all problems (admin view, includes unpublished)
  GET    /admin/problems/<pid>/                   — single problem with full detail
  POST   /admin/problems/add/                     — create a problem + examples/constraints/algorithms
  PUT    /admin/problems/<pid>/update/             — update a problem + related data
  DELETE /admin/problems/<pid>/delete/             — delete a problem (cascades via FK)
  PATCH  /admin/users/<account_number>/toggle-admin/ — toggle a user's admin flag
  GET    /admin/algorithms/                       — list all algorithm names (for dropdown)

Legacy endpoints (kept for backwards compatibility):
  GET    /admin/user-stats/                       — per-user submission stats
  GET    /admin/problem-stats/                    — per-problem performance stats
"""

from django.db import connection, transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response


# ============================================================
# Dashboard
# ============================================================

@api_view(["GET"])
def admin_dashboard_stats(request):
    """Return aggregate counts for the admin dashboard cards."""
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM problem")
        total_problems = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM problem WHERE is_published = TRUE")
        published_problems = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM account")
        total_users = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM study_plan")
        total_study_plans = cursor.fetchone()[0]

    return Response({
        "totalProblems": total_problems,
        "publishedProblems": published_problems,
        "totalUsers": total_users,
        "totalStudyPlans": total_study_plans,
    })


# ============================================================
# Problems — List / Detail / Create / Update / Delete
# ============================================================

@api_view(["GET"])
def admin_list_problems(request):
    """
    List every problem (published + unpublished) with aggregated algorithm names.
    Uses the admin_problem_library_view defined in dbDDL.sql.
    """
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT problem_id, problem_title, problem_description,
                   difficulty_level, estimate_time_baseline, is_published, algorithms
            FROM admin_problem_library_view
            ORDER BY problem_id
        """)
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()

    return Response([dict(zip(columns, row)) for row in rows])


@api_view(["GET"])
def admin_get_problem(request, pid):
    """
    Return a single problem with all related data (examples, constraints, algorithms).
    Uses LEFT JOINs so problems missing examples or constraints still appear.
    """
    with connection.cursor() as cursor:
        # Core problem fields
        cursor.execute("""
            SELECT problem_id, problem_title, problem_description,
                   difficulty_level, estimate_time_baseline, starter_code, is_published
            FROM problem
            WHERE problem_id = %s
        """, [pid])
        problem_row = cursor.fetchone()

    if not problem_row:
        return Response({"error": "Problem not found"}, status=404)

    problem_id, title, description, difficulty, estimate_time_baseline, starter_code, is_published = problem_row

    with connection.cursor() as cursor:
        # Algorithm names for this problem
        cursor.execute("""
            SELECT a.algorithm_name
            FROM problem_algorithm pa
            JOIN algorithm a ON pa.algorithm_id = a.algorithm_id
            WHERE pa.problem_id = %s
            ORDER BY a.algorithm_name
        """, [pid])
        algorithms = [row[0] for row in cursor.fetchall()]

        # Examples
        cursor.execute("""
            SELECT example_input, example_output, example_explanation
            FROM problem_example
            WHERE problem_id = %s
            ORDER BY example_id
        """, [pid])
        examples = [
            {"input": r[0], "output": r[1], "explanation": r[2]}
            for r in cursor.fetchall()
        ]

        # Constraints
        cursor.execute("""
            SELECT problem_constraint
            FROM problem_constraint
            WHERE problem_id = %s
            ORDER BY constraint_id
        """, [pid])
        constraints = [row[0] for row in cursor.fetchall()]

    return Response({
        "problem_id": problem_id,
        "problem_title": title,
        "problem_description": description,
        "difficulty_level": difficulty,
        "estimate_time_baseline": estimate_time_baseline,
        "starter_code": starter_code or "",
        "is_published": is_published,
        "algorithms": algorithms,
        "examples": examples,
        "problem_constraints": constraints,
    })


@api_view(["POST"])
def admin_add_problem(request):
    """
    Create a new problem and its related rows (examples, constraints, algorithm links).
    All inserts run inside a single transaction so partial failures roll back.
    """
    data = request.data
    title = data.get("title", "").strip()
    difficulty = data.get("difficulty", "")
    description = data.get("description", "").strip()
    estimate_time_baseline = data.get("estimateTimeBaseline")
    starter_code = data.get("starterCode", "")
    algorithms = data.get("algorithms", [])     # list of algorithm name strings
    examples = data.get("examples", [])         # [{input, output, explanation?}]
    constraints = data.get("constraints", [])   # list of constraint strings

    if not title or not difficulty or not description:
        return Response({"error": "Title, difficulty, and description are required"}, status=400)

    with transaction.atomic():
        with connection.cursor() as cursor:
            # 1. Insert the problem row
            cursor.execute("""
                INSERT INTO problem
                    (difficulty_level, problem_title, problem_description, estimate_time_baseline, starter_code, is_published)
                VALUES (%s, %s, %s, %s, %s, FALSE)
                RETURNING problem_id
            """, [difficulty, title, description, estimate_time_baseline, starter_code])
            problem_id = cursor.fetchone()[0]

            # 2. Insert examples (skip empty rows)
            for ex in examples:
                if ex.get("input", "").strip() or ex.get("output", "").strip():
                    cursor.execute("""
                        INSERT INTO problem_example
                            (problem_id, example_input, example_output, example_explanation)
                        VALUES (%s, %s, %s, %s)
                    """, [problem_id, ex.get("input", ""), ex.get("output", ""), ex.get("explanation")])

            # 3. Insert constraints (skip blanks)
            for c in constraints:
                if c.strip():
                    cursor.execute("""
                        INSERT INTO problem_constraint (problem_id, problem_constraint)
                        VALUES (%s, %s)
                    """, [problem_id, c.strip()])

            # 4. Link algorithms — create new algorithm names if they don't exist yet
            for algo_name in algorithms:
                if algo_name.strip():
                    cursor.execute("""
                        INSERT INTO algorithm (algorithm_name)
                        VALUES (%s)
                        ON CONFLICT (algorithm_name) DO NOTHING
                    """, [algo_name.strip()])
                    cursor.execute("""
                        INSERT INTO problem_algorithm (problem_id, algorithm_id)
                        SELECT %s, algorithm_id FROM algorithm
                        WHERE algorithm_name = %s
                    """, [problem_id, algo_name.strip()])

    return Response({"success": True, "problemId": problem_id}, status=201)


@api_view(["PUT"])
def admin_update_problem(request, pid):
    """
    Update a problem and replace its related rows.
    Strategy: update the problem row, then delete + re-insert examples/constraints/algorithms.
    """
    data = request.data
    title = data.get("title", "").strip()
    difficulty = data.get("difficulty", "")
    description = data.get("description", "").strip()
    estimate_time_baseline = data.get("estimateTimeBaseline")
    starter_code = data.get("starterCode", "")
    algorithms = data.get("algorithms", [])
    examples = data.get("examples", [])
    constraints = data.get("constraints", [])

    if not title or not difficulty or not description:
        return Response({"error": "Title, difficulty, and description are required"}, status=400)

    with transaction.atomic():
        with connection.cursor() as cursor:
            # 1. Update the problem row
            cursor.execute("""
                UPDATE problem
                SET problem_title = %s, difficulty_level = %s,
                    problem_description = %s, estimate_time_baseline = %s, starter_code = %s
                WHERE problem_id = %s
            """, [title, difficulty, description, estimate_time_baseline, starter_code, pid])

            if cursor.rowcount == 0:
                return Response({"error": "Problem not found"}, status=404)

            # 2. Replace examples
            cursor.execute("DELETE FROM problem_example WHERE problem_id = %s", [pid])
            for ex in examples:
                if ex.get("input", "").strip() or ex.get("output", "").strip():
                    cursor.execute("""
                        INSERT INTO problem_example
                            (problem_id, example_input, example_output, example_explanation)
                        VALUES (%s, %s, %s, %s)
                    """, [pid, ex.get("input", ""), ex.get("output", ""), ex.get("explanation")])

            # 3. Replace constraints
            cursor.execute("DELETE FROM problem_constraint WHERE problem_id = %s", [pid])
            for c in constraints:
                if c.strip():
                    cursor.execute("""
                        INSERT INTO problem_constraint (problem_id, problem_constraint)
                        VALUES (%s, %s)
                    """, [pid, c.strip()])

            # 4. Replace algorithm links
            cursor.execute("DELETE FROM problem_algorithm WHERE problem_id = %s", [pid])
            for algo_name in algorithms:
                if algo_name.strip():
                    cursor.execute("""
                        INSERT INTO algorithm (algorithm_name)
                        VALUES (%s)
                        ON CONFLICT (algorithm_name) DO NOTHING
                    """, [algo_name.strip()])
                    cursor.execute("""
                        INSERT INTO problem_algorithm (problem_id, algorithm_id)
                        SELECT %s, algorithm_id FROM algorithm
                        WHERE algorithm_name = %s
                    """, [pid, algo_name.strip()])

    return Response({"success": True, "updatedId": pid})


@api_view(["DELETE"])
def admin_delete_problem(request, pid):
    """
    Delete a problem. Cascades to examples, constraints, algorithm links,
    solutions, and submissions via ON DELETE CASCADE in the DDL.
    """
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM problem WHERE problem_id = %s", [pid])
        deleted = cursor.rowcount

    if deleted == 0:
        return Response({"error": "Problem not found"}, status=404)

    return Response({"success": True, "deletedId": pid})


# ============================================================
# Users — Toggle Admin
# ============================================================

@api_view(["PATCH"])
def admin_toggle_user_admin(request, account_number):
    """Set or clear the admin flag on a user account."""
    is_admin = request.data.get("isAdmin")
    if is_admin is None:
        return Response({"error": "Missing isAdmin field"}, status=400)

    with connection.cursor() as cursor:
        cursor.execute("""
            UPDATE account SET admin_flag = %s
            WHERE account_number = %s
        """, [is_admin, account_number])

        if cursor.rowcount == 0:
            return Response({"error": "User not found"}, status=404)

    return Response({"success": True, "accountNumber": account_number, "isAdmin": is_admin})


# ============================================================
# Algorithms — List (for dropdown)
# ============================================================

@api_view(["GET"])
def admin_list_algorithms(request):
    """Return all algorithm names, sorted alphabetically."""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT algorithm_id, algorithm_name
            FROM algorithm
            ORDER BY algorithm_name
        """)
        rows = cursor.fetchall()

    return Response([{"id": r[0], "name": r[1]} for r in rows])


# ============================================================
# Legacy analytics endpoints (old schema — kept for reference)
# ============================================================

@api_view(["GET"])
def admin_user_stats(request):
    """Per-user submission summary (uses old schema column names)."""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                a.Account_number,
                up.Email,
                up.First_name,
                up.Last_name,
                COUNT(s.Submission_ID) AS total_submissions,
                SUM(CASE WHEN s.Is_correct = TRUE THEN 1 ELSE 0 END) AS correct_submissions
            FROM ACCOUNT a
            LEFT JOIN USER_PROFILE up ON a.Email = up.Email
            LEFT JOIN SUBMISSION s    ON a.Account_number = s.Account_number
            GROUP BY a.Account_number, up.Email, up.First_name, up.Last_name
            ORDER BY correct_submissions DESC, total_submissions DESC, a.Account_number ASC;
        """)
        columns = [col[0] for col in cursor.description]  # type: ignore
        rows = cursor.fetchall()

    return Response([dict(zip(columns, row)) for row in rows])


@api_view(["GET"])
def admin_problem_stats(request):
    """Per-problem performance summary (uses old schema — TAG/DIFFICULTY_TAG/CONCEPT_TAG)."""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                p.Problem_ID,
                p.Problem_description,
                d.Difficulty_level,
                c.SQL_concept,
                COUNT(s.Submission_ID) AS submission_count,
                SUM(CASE WHEN s.Is_correct = TRUE THEN 1 ELSE 0 END) AS correct_submissions
            FROM PROBLEM p
            LEFT JOIN TAG t            ON p.Tag_ID = t.Tag_ID
            LEFT JOIN DIFFICULTY_TAG d ON t.Difficulty_ID = d.Difficulty_ID
            LEFT JOIN CONCEPT_TAG c    ON t.Concept_ID = c.Concept_ID
            LEFT JOIN SUBMISSION s     ON p.Problem_ID = s.Problem_ID
            GROUP BY p.Problem_ID, p.Problem_description, d.Difficulty_level, c.SQL_concept
            ORDER BY submission_count DESC, p.Problem_ID ASC;
        """)
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()

    return Response([dict(zip(columns, row)) for row in rows])
