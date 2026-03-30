"""Solution endpoints backed by the current PostgreSQL schema."""
from django.db import connection, transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_solution(request, pId):
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT solution_id, problem_id, solution_code,
                       solution_explanation, time_complexity, space_complexity
                FROM solution
                WHERE problem_id = %s
            """, [pId])
            row = cursor.fetchone()
            if row:
                return Response({
                    'sId': row[0],
                    'pId': row[1],
                    'sDescription': row[2],
                    'solutionExplanation': row[3] or '',
                    'timeComplexity': row[4] or '',
                    'spaceComplexity': row[5] or '',
                    'success': True
                })
            else:
                return Response({
                    'error': 'Solution not found',
                    'success': False
                })
    except Exception as e:
        return Response({
            'error': str(e),
            'success': False
        })


@api_view(['POST'])
def add_solution(request):
    data = request.data
    pId = data.get('pId')
    sDescription = data.get('sDescription')
    solutionExplanation = data.get('solutionExplanation', '')
    timeComplexity = data.get('timeComplexity', '')
    spaceComplexity = data.get('spaceComplexity', '')
    if not pId:
        return Response({
            'error': 'Missing required fields',
            'success': False
        }, status=400)

    try:
        with transaction.atomic():
            with connection.cursor() as cursor:
                # Check if solution exists
                cursor.execute("SELECT solution_id FROM solution WHERE problem_id = %s", [pId])
                existing = cursor.fetchone()
                cleaned_description = (sDescription or "").strip()

                if not cleaned_description:
                    if existing:
                        cursor.execute("""
                            DELETE FROM solution
                            WHERE problem_id = %s
                        """, [pId])
                    cursor.execute("""
                        UPDATE problem
                        SET is_published = FALSE
                        WHERE problem_id = %s
                    """, [pId])
                    return Response({
                        'success': True,
                        'isPublished': False
                    })

                if existing:
                    # Update existing
                    cursor.execute("""
                        UPDATE solution
                        SET solution_code = %s,
                            solution_explanation = %s,
                            time_complexity = %s,
                            space_complexity = %s
                        WHERE problem_id = %s
                    """, [cleaned_description, solutionExplanation, timeComplexity, spaceComplexity, pId])
                else:
                    # Insert new
                    cursor.execute("""
                        INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity)
                        VALUES (%s, %s, %s, %s, %s)
                    """, [pId, cleaned_description, solutionExplanation, timeComplexity, spaceComplexity])
                
                return Response({
                    'success': True
                })
    except Exception as e:
        return Response({
            'error': str(e),
            'success': False
        })


@api_view(['PUT'])
def update_solution(request, pid):
    data = request.data
    sDescription = data.get('sDescription')
    if not sDescription:
        return Response({
            'error': 'Missing required fields',
            'success': False
        }, status=400)

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE solution
                SET solution_code = %s
                WHERE problem_id = %s
            """, [sDescription, pid])
            return Response({
                'success': True
            })
    except Exception as e:
        return Response({
            'error': str(e),
            'success': False
        })
    
