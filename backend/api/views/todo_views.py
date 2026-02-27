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
