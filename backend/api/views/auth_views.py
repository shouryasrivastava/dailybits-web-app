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
                cursor.execute("""SELECT 1 FROM ACCOUNT WHERE Email = %s
                    UNION SELECT 1 FROM USER_AUTH WHERE Email = %s
                """, [email, email])
                if cursor.fetchone():
                    return Response({"success": False, "message": "Email already exists."}, status=400)

        register_date = timezone.localdate()

        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO USER_PROFILE (Email, First_name, Last_name)
                VALUES (%s, %s, %s)
            """, [email, first_name, last_name])

        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO ACCOUNT (Email, Register_date, Student_flag, Admin_flag)
                VALUES (%s, %s, %s, %s)
            """, [email, register_date, True, False])
            account_number = cursor.lastrowid

        with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO USER_AUTH (Email, Password)
                    VALUES (%s, %s)
                """, [email, password])

    except IntegrityError as e:
        # Surface a clear error instead of a generic 500
        print("Signup DB error:", e)
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
            SELECT Email FROM USER_AUTH 
            WHERE Email=%s AND Password=%s
        """, [email, password])
        user = cursor.fetchone()

    if not user:
        return Response({"success": False, "message": "Invalid email or password"})

    # Step 2: fetch profile + account info
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT 
                p.First_name,
                p.Last_name,
                a.Account_number,
                a.Student_flag,
                a.Admin_flag
            FROM USER_PROFILE p
            JOIN ACCOUNT a ON p.Email = a.Email
            WHERE p.Email=%s
        """, [email])
        profile = cursor.fetchone()

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
                p.Email,
                p.First_name,
                p.Last_name,
                a.Register_date,
                a.Student_flag,
                a.Admin_flag
            FROM USER_PROFILE p
            JOIN ACCOUNT a ON p.Email = a.Email
            WHERE a.Account_number = %s
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
            UPDATE USER_PROFILE
            SET First_name = %s, Last_name = %s
            WHERE Email = (
                SELECT Email FROM ACCOUNT WHERE Account_number = %s
            )
        """, [first_name, last_name, account_number])

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT 
                p.Email,
                p.First_name,
                p.Last_name,
                a.Register_date,
                a.Student_flag,
                a.Admin_flag
            FROM USER_PROFILE p
            JOIN ACCOUNT a ON p.Email = a.Email
            WHERE a.Account_number = %s
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
                a.Account_number,
                p.First_name,
                p.Last_name,
                p.Email,
                a.Student_flag,
                a.Admin_flag,
                a.Register_date
            FROM ACCOUNT a
            JOIN USER_PROFILE p ON a.Email = p.Email
            ORDER BY a.Account_number;
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
            SELECT Email FROM ACCOUNT WHERE Account_number = %s
        """, [account_number])
        row = cursor.fetchone()

    if not row:
        return Response({"success": False, "message": "User not found"}, status=404)

    email = row[0]

    # 1. Delete submissions
    with connection.cursor() as cursor:
        cursor.execute("""
            DELETE FROM SUBMISSION
            WHERE Account_number = %s
        """, [account_number])

    # 2. Delete USER_AUTH row
    with connection.cursor() as cursor:
        cursor.execute("""
            DELETE FROM USER_AUTH WHERE Email = %s
        """, [email])

    # 3. Delete ACCOUNT row
    with connection.cursor() as cursor:
        cursor.execute("""
            DELETE FROM ACCOUNT WHERE Account_number = %s
        """, [account_number])

    # 4. Delete USER_PROFILE row
    with connection.cursor() as cursor:
        cursor.execute("""
            DELETE FROM USER_PROFILE WHERE Email = %s
        """, [email])

    return Response({"success": True})
