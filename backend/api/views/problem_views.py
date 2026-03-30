from django.db import connection
from django.http import JsonResponse
from rest_framework.decorators import api_view

# List all problems
@api_view(['GET'])
def list_problems(request):
    try:
        page = int(request.GET.get('page', 1))
    except (ValueError, TypeError):
        return JsonResponse({"error": "Invalid page parameter"}, status=400)
    page_size = 20
    offset = (page - 1) * page_size

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                p.problem_id,
                p.problem_title,
                p.problem_description,
                p.difficulty_level,
                p.estimate_time_baseline,
                COALESCE(array_agg(a.algorithm_name) FILTER (WHERE a.algorithm_name IS NOT NULL), '{}') AS algorithms
            FROM problem p
            LEFT JOIN problem_algorithm pa ON p.problem_id = pa.problem_id
            LEFT JOIN algorithm a ON pa.algorithm_id = a.algorithm_id
            WHERE p.is_published = TRUE
            GROUP BY p.problem_id, p.problem_title, p.problem_description, p.difficulty_level, p.estimate_time_baseline
            ORDER BY p.problem_id
            LIMIT %s OFFSET %s
        """, [page_size, offset])
        columns = [col[0] for col in cursor.description] # type: ignore
        rows = cursor.fetchall()

    results = [dict(zip(columns, row)) for row in rows]
    return JsonResponse({
        "page": page,
        "page_size": page_size,
        "results": results
    }, safe=False)


# Get a single problem
@api_view(['GET'])
def get_single_problem(request, pId):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT *
            FROM single_problem_view
            WHERE problem_id = %s
        """, [pId])

        columns = [col[0] for col in cursor.description] # type: ignore
        rows = cursor.fetchall()

    results = [dict(zip(columns, row)) for row in rows]
    return JsonResponse({"results": results}, safe=False)


# Submit SQL answer
@api_view(["POST"])
def submit_problem(request, pid):
    data = request.data

    account_number = data.get("account_number")
    submission_text = data.get("submission")
    is_correct = data.get("is_correct", False)

    if not account_number or not submission_text:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT is_published FROM problem WHERE problem_id = %s", [pid]
        )
        row = cursor.fetchone()
        if not row:
            return JsonResponse({"error": "Problem not found"}, status=404)
        if not row[0]:
            return JsonResponse({"error": "Cannot submit to an unpublished problem"}, status=403)

        cursor.execute("""
            INSERT INTO submission
            (problem_id, account_number, submitted_code, is_correct)
            VALUES (%s, %s, %s, %s)
        """, [pid, account_number, submission_text, is_correct])

    return JsonResponse({"success": True})
