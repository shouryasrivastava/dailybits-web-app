"""
One auth flow only:

Frontend:
- signup with Supabase Auth
- login with Supabase Auth
- store access token
- call Django /auth/me/ with Bearer token

Backend:
- verify Supabase JWT using JWKS (ES256)
- read business user data from USER_PROFILE + ACCOUNT
- return current user profile
- allow profile read/update using business tables
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
import jwt
from jwt import PyJWKClient


def get_user_from_token(request):
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return None, "Missing Authorization header"

    parts = auth_header.split(" ")
    if len(parts) != 2 or parts[0] != "Bearer":
        return None, "Invalid Authorization format"

    token = parts[1]

    try:
        # 先读取 payload，不验签，只为了拿 iss
        unverified_payload = jwt.decode(
            token,
            options={"verify_signature": False},
        )
        issuer = unverified_payload.get("iss")

        if not issuer:
            return None, "Missing issuer in token"

        # Supabase JWKS endpoint
        jwks_url = f"{issuer}/.well-known/jwks.json"

        jwk_client = PyJWKClient(jwks_url)
        signing_key = jwk_client.get_signing_key_from_jwt(token)

        decoded = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256"],
            options={"verify_aud": False},
        )
        return decoded, None

    except Exception as e:
        return None, str(e)


@api_view(["GET"])
def me(request):
    """
    Return current logged-in user's business profile
    based on Supabase access token.
    """
    decoded, error = get_user_from_token(request)

    if error:
        return Response({"success": False, "message": error}, status=401)

    email = decoded.get("email")
    if not email:
        return Response(
            {"success": False, "message": "Email not found in token"},
            status=401,
        )

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                p.Email,
                p.First_name,
                p.Last_name,
                a.Account_number,
                a.Register_date,
                a.Student_flag,
                a.Admin_flag
            FROM USER_PROFILE p
            JOIN ACCOUNT a ON p.Email = a.Email
            WHERE p.Email = %s
        """, [email])
        profile = cursor.fetchone()

    if not profile:
        return Response(
            {"success": False, "message": "User not found in business tables"},
            status=404,
        )

    return Response({
        "success": True,
        "email": profile[0],
        "firstName": profile[1],
        "lastName": profile[2],
        "accountNumber": profile[3],
        "registerDate": profile[4],
        "isStudent": profile[5],
        "isAdmin": profile[6],
    })


@api_view(["GET"])
def get_profile(request, account_number):
    """
    Get a user's profile by account number.
    """
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                p.Email,
                p.First_name,
                p.Last_name,
                a.Register_date,
                a.Student_flag,
                a.Admin_flag,
                a.Account_number
            FROM USER_PROFILE p
            JOIN ACCOUNT a ON p.Email = a.Email
            WHERE a.Account_number = %s
        """, [account_number])
        profile = cursor.fetchone()

    if not profile:
        return Response({"success": False, "message": "Profile not found"}, status=404)

    return Response({
        "success": True,
        "email": profile[0],
        "firstName": profile[1],
        "lastName": profile[2],
        "registerDate": profile[3],
        "isStudent": profile[4],
        "isAdmin": profile[5],
        "accountNumber": profile[6],
    })


@api_view(["POST"])
def update_profile(request, account_number):
    """
    Only allow current logged-in user to update their own profile.
    """
    decoded, error = get_user_from_token(request)

    if error:
        return Response({"success": False, "message": error}, status=401)

    current_email = decoded.get("email")
    if not current_email:
        return Response(
            {"success": False, "message": "Email not found in token"},
            status=401,
        )

    first_name = request.data.get("firstName")
    last_name = request.data.get("lastName")

    if not first_name or not last_name:
        return Response(
            {"success": False, "message": "Missing firstName or lastName"},
            status=400,
        )

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT Email
            FROM ACCOUNT
            WHERE Account_number = %s
        """, [account_number])
        row = cursor.fetchone()

    if not row:
        return Response({"success": False, "message": "Profile not found"}, status=404)

    owner_email = row[0]
    if owner_email != current_email:
        return Response(
            {"success": False, "message": "You can only update your own profile"},
            status=403,
        )

    with connection.cursor() as cursor:
        cursor.execute("""
            UPDATE USER_PROFILE
            SET First_name = %s, Last_name = %s
            WHERE Email = %s
        """, [first_name, last_name, current_email])

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                p.Email,
                p.First_name,
                p.Last_name,
                a.Register_date,
                a.Student_flag,
                a.Admin_flag,
                a.Account_number
            FROM USER_PROFILE p
            JOIN ACCOUNT a ON p.Email = a.Email
            WHERE p.Email = %s
        """, [current_email])
        profile = cursor.fetchone()

    return Response({
        "success": True,
        "email": profile[0],
        "firstName": profile[1],
        "lastName": profile[2],
        "registerDate": profile[3],
        "isStudent": profile[4],
        "isAdmin": profile[5],
        "accountNumber": profile[6],
    })


@api_view(["GET"])
def list_users(request):
    """
    List all users.
    Later this should be admin-only.
    """
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                a.Account_number,
                p.First_name,
                p.Last_name,
                p.Email,
                a.Student_flag,
                a.Admin_flag,
                a.Register_date
            FROM ACCOUNT a
            JOIN USER_PROFILE p ON a.Email = p.Email
            ORDER BY a.Account_number
        """)
        rows = cursor.fetchall()

    users = []
    for r in rows:
        users.append({
            "accountNumber": r[0],
            "firstName": r[1],
            "lastName": r[2],
            "email": r[3],
            "isStudent": r[4],
            "isAdmin": r[5],
            "registerDate": r[6],
        })

    return Response({
        "success": True,
        "users": users
    })


@api_view(["DELETE"])
def delete_user(request, account_number):
    """
    Delete business-table data only.
    This does NOT delete auth.users.
    """
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT Email
            FROM ACCOUNT
            WHERE Account_number = %s
        """, [account_number])
        row = cursor.fetchone()

    if not row:
        return Response({"success": False, "message": "User not found"}, status=404)

    email = row[0]

    with connection.cursor() as cursor:
        cursor.execute("""
            DELETE FROM SUBMISSION
            WHERE Account_number = %s
        """, [account_number])

    with connection.cursor() as cursor:
        cursor.execute("""
            DELETE FROM ACCOUNT
            WHERE Account_number = %s
        """, [account_number])

    with connection.cursor() as cursor:
        cursor.execute("""
            DELETE FROM USER_PROFILE
            WHERE Email = %s
        """, [email])

    return Response({"success": True})