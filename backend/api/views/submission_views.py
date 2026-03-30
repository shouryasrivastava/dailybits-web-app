from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.db import connection


@api_view(["GET"])
def list_submissions(request, account_number):
    """Return all submissions for a given user."""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT s.submission_id, s.problem_id, p.problem_title,
                   s.is_correct, s.submitted_at, s.submitted_code
            FROM submission s
            JOIN problem p ON s.problem_id = p.problem_id
            WHERE s.account_number = %s
              AND p.is_published = TRUE
            ORDER BY s.submitted_at DESC
        """, [account_number])
        rows = cursor.fetchall()

    return JsonResponse([
        {
            "submission_id": r[0],
            "problem_id":    r[1],
            "problem_title": r[2],
            "is_correct":    r[3],
            "submitted_at":  r[4].isoformat() if r[4] else None,
            "submitted_code": r[5],
        }
        for r in rows
    ], safe=False)
