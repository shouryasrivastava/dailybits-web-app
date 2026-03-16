import json
from django.db import connection
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# List all todo list problems
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_todo_list_view(request):
    account_number = request.user.account_number
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT *
            FROM todo_list_view
            WHERE account_number = %s
        """, [account_number])

        columns = [col[0] for col in cursor.description] # type: ignore
        rows = cursor.fetchall()

    results = [dict(zip(columns, row)) for row in rows]
    return JsonResponse({"results": results}, safe=False)


@api_view(['GET'])
def get_todo_list_by_account(request, account_number):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT *
            FROM todo_list_view
            WHERE account_number = %s
            ORDER BY added_at DESC
        """, [account_number])
        columns = [col[0] for col in cursor.description] # type: ignore
        rows = cursor.fetchall()

    results = [dict(zip(columns, row)) for row in rows]
    return JsonResponse({"results": results}, safe=False)


@api_view(['POST'])
def add_todo_item(request):
    data = request.data
    account_number = data.get("account_number")
    problem_id = data.get("problem_id")
    if not account_number or not problem_id:
        return JsonResponse({"error": "account_number and problem_id required"}, status=400)
    with connection.cursor() as cursor:
        cursor.execute("""
            INSERT INTO todo_item (account_number, problem_id, source)
            SELECT %s, %s, 'manual'
            WHERE NOT EXISTS (
                SELECT 1 FROM todo_item WHERE account_number = %s AND problem_id = %s
            )
        """, [account_number, problem_id, account_number, problem_id])
    return JsonResponse({"success": True})


@api_view(['DELETE'])
def remove_todo_item(request, account_number, pid):
    with connection.cursor() as cursor:
        cursor.execute("""
            DELETE FROM todo_item
            WHERE account_number = %s AND problem_id = %s
        """, [account_number, pid])
    return JsonResponse({"success": True})
