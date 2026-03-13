from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def get_user_progress(request, account_number):
    with connection.cursor() as cur:
        cur.execute("""
            SELECT problems_solved, total_practice_days, last_practice_date,
                   todo_count, easy_solved, medium_solved, hard_solved,
                   easy_total, medium_total, hard_total
            FROM user_progress_view
            WHERE account_number = %s
        """, [account_number])
        row = cur.fetchone()

    if not row:
        return Response({
            "problems_solved": 0,
            "total_practice_days": 0,
            "last_practice_date": None,
            "todo_count": 0,
            "easy_solved": 0, "medium_solved": 0, "hard_solved": 0,
            "easy_total": 0, "medium_total": 0, "hard_total": 0,
        })

    return Response({
        "problems_solved": row[0],
        "total_practice_days": row[1],
        "last_practice_date": row[2].isoformat() if row[2] else None,
        "todo_count": row[3],
        "easy_solved": row[4],
        "medium_solved": row[5],
        "hard_solved": row[6],
        "easy_total": row[7],
        "medium_total": row[8],
        "hard_total": row[9],
    })


@api_view(["GET"])
def get_recent_activity(request, account_number):
    with connection.cursor() as cur:
        cur.execute("""
            SELECT problem_id, problem_title, difficulty_level,
                   submitted_at, is_correct
            FROM user_recent_activity_view
            WHERE account_number = %s
            ORDER BY submitted_at DESC
            LIMIT 5
        """, [account_number])
        cols = [c.name for c in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]

    for r in rows:
        if r.get("submitted_at"):
            r["submitted_at"] = r["submitted_at"].isoformat()

    return Response(rows)


@api_view(["GET"])
def get_algorithm_progress(request, account_number):
    with connection.cursor() as cur:
        cur.execute("""
            SELECT algorithm_name, problems_solved
            FROM user_algorithm_progress_view
            WHERE account_number = %s
            ORDER BY algorithm_name
        """, [account_number])
        cols = [c.name for c in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]

    return Response(rows)
