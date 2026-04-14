"""
- POST /auth/signup/            create a new user account
- POST /auth/login/             authenticate user (email + password), return profile & account info
- GET  /profile/{id}/           fetch user profile and account info by account number
- POST /profile/{id}/update/    update user first/last name, return updated profile
- GET  /users/                  list all users with profile + account info
- DELETE /users/{id}/           delete a user by account number
"""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
from django.db import IntegrityError, transaction
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password

@api_view(['POST'])
def signup(request):
    first_name = request.data.get("firstName")
    last_name = request.data.get("lastName")
    email = request.data.get("email")
    password = request.data.get("password")

    if not all([first_name, last_name, email, password]):
        return Response({"success": False, "message": "Missing required fields."}, status=400)

    try:
        with transaction.atomic():
            # Check if email already exists
            with connection.cursor() as cursor:
                cursor.execute("""SELECT 1 FROM account WHERE email = %s
                    UNION SELECT 1 FROM user_auth WHERE email = %s
                """, [email, email])
                if cursor.fetchone():
                    return Response({"success": False, "message": "Email already exists."}, status=400)

            register_date = timezone.localdate()

            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO user_profile (email, first_name, last_name)
                    VALUES (%s, %s, %s)
                """, [email, first_name, last_name])

            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO account (email, register_date, student_flag, admin_flag)
                    VALUES (%s, %s, %s, %s)
                    RETURNING account_number
                """, [email, register_date, True, False])
                account_number = cursor.fetchone()[0]

            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO user_auth (email, password)
                    VALUES (%s, %s)
                """, [email, make_password(password)])

    except IntegrityError:
        return Response(
            {"success": False, "message": "Database error while creating account."},
            status=400,
        )

    return Response({
        "success": True,
        "email": email,
        "firstName": first_name,
        "lastName": last_name,
        "accountNumber": account_number,
        "isStudent": True,
        "isAdmin": False,
    }, status=201)


@api_view(['POST'])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"success": False, "message": "Missing email or password"})

    # Step 1: verify credentials
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT password FROM user_auth WHERE email=%s
        """, [email])
        user = cursor.fetchone()

    if not user or not check_password(password, user[0]):
        return Response({"success": False, "message": "Invalid email or password"})

    # Step 2: fetch profile + account info
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                p.first_name,
                p.last_name,
                a.account_number,
                a.student_flag,
                a.admin_flag
            FROM user_profile p
            JOIN account a ON p.email = a.email
            WHERE p.email=%s
        """, [email])
        profile = cursor.fetchone()

    if not profile:
        return Response({"success": False, "message": "Account data not found"}, status=500)

    return Response({
        "success": True,
        "email": email,
        "firstName": profile[0],
        "lastName": profile[1],
        "accountNumber": profile[2],
        "isStudent": profile[3],
        "isAdmin": profile[4],
    })


@api_view(['GET'])
def get_profile(request, account_number):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                p.email,
                p.first_name,
                p.last_name,
                a.register_date,
                a.student_flag,
                a.admin_flag
            FROM user_profile p
            JOIN account a ON p.email = a.email
            WHERE a.account_number = %s
        """, [account_number])
        profile = cursor.fetchone()

    if not profile:
        return Response({"success": False, "message": "Profile not found"}, status=404)

    return Response({
        "email": profile[0],
        "firstName": profile[1],
        "lastName": profile[2],
        "registerDate": profile[3],
        "isStudent": profile[4],
        "isAdmin": profile[5],
    })


@api_view(['POST'])
def update_profile(request, account_number):
    first_name = request.data.get("firstName")
    last_name = request.data.get("lastName")

    with connection.cursor() as cursor:
        cursor.execute("""
            UPDATE user_profile
            SET first_name = %s, last_name = %s
            WHERE email = (
                SELECT email FROM account WHERE account_number = %s
            )
        """, [first_name, last_name, account_number])

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                p.email,
                p.first_name,
                p.last_name,
                a.register_date,
                a.student_flag,
                a.admin_flag
            FROM user_profile p
            JOIN account a ON p.email = a.email
            WHERE a.account_number = %s
        """, [account_number])
        profile = cursor.fetchone()

    if not profile:
        return Response({"success": False, "message": "Profile not found"}, status=404)

    return Response({
        "email": profile[0],
        "firstName": profile[1],
        "lastName": profile[2],
        "registerDate": profile[3],
        "isStudent": profile[4],
        "isAdmin": profile[5],
    })


@api_view(['GET'])
def list_users(request):
    """
    Return list of all users with profile + account info.
    """
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                a.account_number,
                p.first_name,
                p.last_name,
                p.email,
                a.student_flag,
                a.admin_flag,
                a.register_date
            FROM account a
            JOIN user_profile p ON a.email = p.email
            ORDER BY a.account_number;
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

    return Response(users)


@api_view(['DELETE'])
def delete_user(request, account_number):
    # 0. Fetch email for this account
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT email FROM account WHERE account_number = %s
        """, [account_number])
        row = cursor.fetchone()

    if not row:
        return Response({"success": False, "message": "User not found"}, status=404)

    email = row[0]

    # 1. Delete submissions
    with connection.cursor() as cursor:
        cursor.execute("""
            DELETE FROM submission
            WHERE account_number = %s
        """, [account_number])

    # 2. Delete user_auth row
    with connection.cursor() as cursor:
        cursor.execute("""
            DELETE FROM user_auth WHERE email = %s
        """, [email])

    # 3. Delete account row
    with connection.cursor() as cursor:
        cursor.execute("""
            DELETE FROM account WHERE account_number = %s
        """, [account_number])

    # 4. Delete user_profile row
    with connection.cursor() as cursor:
        cursor.execute("""
            DELETE FROM user_profile WHERE email = %s
        """, [email])

    return Response({"success": True})
