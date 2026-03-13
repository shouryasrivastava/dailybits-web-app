from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def list_study_plans(request, account_number):
    with connection.cursor() as cur:
        cur.execute("""
            SELECT sp.plan_id, sp.plan_name, sp.time_available,
                   sp.created_at, sp.is_accepted
            FROM study_plan sp
            WHERE sp.account_number = %s
            ORDER BY sp.created_at DESC
        """, [account_number])
        plan_cols = [c.name for c in cur.description]
        plans = [dict(zip(plan_cols, r)) for r in cur.fetchall()]

    for plan in plans:
        if plan.get("created_at"):
            plan["created_at"] = plan["created_at"].isoformat()

        with connection.cursor() as cur:
            cur.execute("""
                SELECT spp.problem_id, p.problem_title, p.difficulty_level,
                       spp.estimate_time_assigned
                FROM study_plan_problems spp
                JOIN problem p ON spp.problem_id = p.problem_id
                WHERE spp.plan_id = %s
                ORDER BY spp.problem_id
            """, [plan["plan_id"]])
            prob_cols = [c.name for c in cur.description]
            plan["problems"] = [dict(zip(prob_cols, r)) for r in cur.fetchall()]

    return Response(plans)
