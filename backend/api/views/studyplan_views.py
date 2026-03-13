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
        plan_cols = [c[0] for c in cur.description]
        plans = [dict(zip(plan_cols, r)) for r in cur.fetchall()]

    for plan in plans:
        if plan.get("created_at"):
            plan["created_at"] = plan["created_at"].isoformat()
        plan["problems"] = []

    if not plans:
        return Response(plans)

    plan_ids = [plan["plan_id"] for plan in plans]
    placeholders = ",".join(["%s"] * len(plan_ids))
    with connection.cursor() as cur:
        cur.execute(f"""
            SELECT spp.plan_id, spp.problem_id, p.problem_title, p.difficulty_level,
                   spp.estimate_time_assigned
            FROM study_plan_problems spp
            JOIN problem p ON spp.problem_id = p.problem_id
            WHERE spp.plan_id IN ({placeholders})
            ORDER BY spp.plan_id, spp.problem_id
        """, plan_ids)
        prob_cols = [c[0] for c in cur.description]
        all_problems = [dict(zip(prob_cols, r)) for r in cur.fetchall()]

    plan_map = {plan["plan_id"]: plan for plan in plans}
    for prob in all_problems:
        plan_id = prob.pop("plan_id")
        plan_map[plan_id]["problems"].append(prob)

    return Response(plans)
