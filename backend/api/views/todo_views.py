from django.db import connection
from django.http import JsonResponse
from rest_framework.decorators import api_view


@api_view(['GET'])
def get_todo_list_by_account(request, account_number):
    with connection.cursor() as cursor:
        cursor.execute("""
            WITH user_todo AS (
                SELECT
                    t.todo_id,
                    t.account_number,
                    t.problem_id,
                    t.added_at,
                    t.source
                FROM todo_item t
                WHERE t.account_number = %s
            )
            SELECT
                ut.todo_id,
                ut.account_number,
                ut.problem_id,
                p.problem_title,
                p.problem_description,
                p.difficulty_level,
                ut.added_at,
                ut.source,
                COALESCE(
                    array_agg(a.algorithm_name) FILTER (WHERE a.algorithm_name IS NOT NULL),
                    '{}'
                ) AS algorithms,
                EXISTS (
                    SELECT 1
                    FROM submission s
                    WHERE s.account_number = ut.account_number
                      AND s.problem_id = ut.problem_id
                      AND s.is_correct = TRUE
                ) AS is_completed
            FROM user_todo ut
            JOIN problem p ON ut.problem_id = p.problem_id
            LEFT JOIN problem_algorithm pa ON p.problem_id = pa.problem_id
            LEFT JOIN algorithm a ON pa.algorithm_id = a.algorithm_id
            WHERE p.is_published = TRUE
            GROUP BY
                ut.todo_id,
                ut.account_number,
                ut.problem_id,
                p.problem_title,
                p.problem_description,
                p.difficulty_level,
                ut.added_at,
                ut.source
            ORDER BY ut.added_at DESC
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
        already_exists = cursor.rowcount == 0
    return JsonResponse({"success": True, "already_exists": already_exists})


@api_view(['DELETE'])
def remove_todo_item(request, account_number, pid):
    with connection.cursor() as cursor:
        cursor.execute("""
            DELETE FROM todo_item
            WHERE account_number = %s AND problem_id = %s
        """, [account_number, pid])
    return JsonResponse({"success": True})
