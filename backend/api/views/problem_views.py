import json
from django.db import connection
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
import datetime
from rest_framework.permissions import IsAuthenticated

# List all problems
@api_view(['GET'])
def list_problems(request):
    page = int(request.GET.get('page', 1)) # return page number, default 1
    page_size = 20
    offset = (page - 1) * page_size

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT *
            FROM user_problem_library_view
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
    data = json.loads(request.body)

    account_number = data["account_number"]
    submission_text = data["submission"]
    is_correct = data.get("is_correct", False)

    now = datetime.datetime.now()

    with connection.cursor() as cursor:
        cursor.execute("""
            INSERT INTO SUBMISSION
            (Problem_ID, Account_number, Submission_description, Is_correct, Time_start, Time_end)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, [pid, account_number, submission_text, is_correct, now, now])

    return JsonResponse({"success": True})


#add problem
@api_view(["POST"])
def add_problem(request):
    """
    Add a new problem into PROBLEM table
    Required: tag_id, problem_title, problem_description
    Optional: solution_id, review_status
    """
    data = json.loads(request.body)

    tag_id = data.get("tag_id")
    title = data.get("problem_title")
    description = data.get("problem_description")
    solution_id = data.get("solution_id")  # can be None
    review_status = data.get("review_status", False)

    if not tag_id:
        return JsonResponse({"error": "Missing tag_id"}, status=400)
    if not title:
        return JsonResponse({"error": "Missing title"}, status=400)
    if not description:
        return JsonResponse({"error": "Missing description"}, status=400)
 
    # if not tag_id or not title or not description:
    #     return JsonResponse({"error": "Missing required fields"}, status=400)

    with connection.cursor() as cursor:
        cursor.execute("""
            INSERT INTO PROBLEM (Tag_ID, Problem_title, Problem_description, Review_status, Solution_ID)
            VALUES (%s, %s, %s, %s, %s)
        """, [tag_id, title, description, review_status, solution_id])

        cursor.execute("SELECT LAST_INSERT_ID()")
        new_id = cursor.fetchone()[0] # type: ignore

    return JsonResponse({"success": True, "problem_id": new_id})


#delete problem
@api_view(["DELETE"])
def delete_problem(request, pid):
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM PROBLEM WHERE Problem_ID = %s", [pid])
        deleted = cursor.rowcount

    if deleted == 0:
        return JsonResponse({"error": "Problem not found"}, status=404)

    return JsonResponse({"success": True, "deleted_id": pid})


@api_view(["PUT"])
def update_problem(request, pid):
    """
    Update SQL problem fields from frontend
    Compatible with ProblemEditor + ProblemCreation
    """
    data = json.loads(request.body)

    title = data.get("title")
    description = data.get("description")
    tag_id = data.get("tagId")
    solution_id = data.get("solutionId")  # new optional field

    if not title or not description or not tag_id:
        return JsonResponse({"error": "Missing fields"}, status=400)

    with connection.cursor() as cursor:
        cursor.execute("""
            UPDATE PROBLEM
            SET 
                Problem_title = %s,
                Problem_description = %s,
                Tag_ID = %s,
                Solution_ID = %s
            WHERE Problem_ID = %s
        """, [title, description, tag_id, solution_id, pid])

        updated = cursor.rowcount

    if updated == 0:
        return JsonResponse({"error": "Problem not found"}, status=404)

    return JsonResponse({"success": True, "updated_id": pid})


@api_view(['POST'])
def publish_problem(request, pid):
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE PROBLEM
                SET Review_status = 1
                WHERE Problem_ID = %s
            """, [pid])

        return JsonResponse({"success": True})

    except Exception as e:
        # print the error so we know why status=500
        print("Publish error:", str(e))
        return JsonResponse({"error": str(e)}, status=500)
