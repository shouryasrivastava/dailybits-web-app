from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection


@api_view(['GET'])
def get_note(request, account_number, problem_id):
    """Return the study note for a given account + problem (via todo_item join)."""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT sn.note_content
            FROM study_note sn
            JOIN todo_item t ON sn.todo_id = t.todo_id
            WHERE t.account_number = %s AND t.problem_id = %s
            LIMIT 1
        """, [account_number, problem_id])
        row = cursor.fetchone()
    return Response({"note_content": row[0] if row else ""})


@api_view(['POST'])
def save_note(request):
    """
    Create or update the study note for a given account + problem.
    Requires a todo_item to already exist for this (account_number, problem_id) pair.
    """
    account_number = request.data.get("account_number")
    problem_id = request.data.get("problem_id")
    note_content = request.data.get("note_content", "")

    if not account_number or not problem_id:
        return Response({"error": "account_number and problem_id are required"}, status=400)

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT todo_id FROM todo_item
            WHERE account_number = %s AND problem_id = %s
            LIMIT 1
        """, [account_number, problem_id])
        row = cursor.fetchone()

        if not row:
            return Response({"success": False, "error": "No todo item found for this problem"}, status=404)

        todo_id = row[0]
        cursor.execute("""
            INSERT INTO study_note (todo_id, account_number, note_content)
            VALUES (%s, %s, %s)
            ON CONFLICT (todo_id) DO UPDATE SET note_content = EXCLUDED.note_content
        """, [todo_id, account_number, note_content])

    return Response({"success": True})
