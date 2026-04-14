from unittest.mock import patch, MagicMock

from django.test import SimpleTestCase
from rest_framework.test import APIClient


def _mock_cursor(mock_conn):
    """Return a mock cursor wired to the mocked connection as a context manager."""
    cursor = MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = cursor
    mock_conn.cursor.return_value.__exit__.return_value = False
    return cursor


# ── signup ────────────────────────────────────────────────────

class TestSignup(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()
        self.valid_payload = {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "password": "securepass123",
        }

    @patch("api.views.auth_views.make_password", return_value="hashed_pw")
    @patch("api.views.auth_views.transaction")
    @patch("api.views.auth_views.connection")
    def test_successful_signup(self, mock_conn, _mock_tx, _mock_hash):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.side_effect = [
            None,   # email-uniqueness check — no duplicate
            (1,),   # RETURNING account_number
        ]

        resp = self.client.post("/auth/signup/", self.valid_payload, format="json")

        self.assertEqual(resp.status_code, 201)
        data = resp.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["email"], "john@example.com")
        self.assertEqual(data["firstName"], "John")
        self.assertEqual(data["accountNumber"], 1)
        self.assertFalse(data["isAdmin"])
        self.assertTrue(data["isStudent"])

    def test_missing_fields_returns_400(self):
        resp = self.client.post("/auth/signup/", {
            "firstName": "John",
            # missing lastName, email, password
        }, format="json")

        self.assertEqual(resp.status_code, 400)
        self.assertFalse(resp.json()["success"])

    @patch("api.views.auth_views.transaction")
    @patch("api.views.auth_views.connection")
    def test_duplicate_email_returns_400(self, mock_conn, _mock_tx):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.return_value = (1,)  # email already exists

        resp = self.client.post("/auth/signup/", self.valid_payload, format="json")

        self.assertEqual(resp.status_code, 400)
        self.assertFalse(resp.json()["success"])
        self.assertIn("Email already exists", resp.json()["message"])


# ── login ─────────────────────────────────────────────────────

class TestLogin(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.auth_views.check_password", return_value=True)
    @patch("api.views.auth_views.connection")
    def test_successful_login(self, mock_conn, _mock_check):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.side_effect = [
            ("hashed_password",),                     # user_auth lookup
            ("John", "Doe", 1, True, False),          # profile + account
        ]

        resp = self.client.post("/auth/login/", {
            "email": "john@example.com",
            "password": "securepass123",
        }, format="json")

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["firstName"], "John")
        self.assertEqual(data["accountNumber"], 1)

    def test_missing_credentials_returns_200_with_failure(self):
        resp = self.client.post("/auth/login/", {}, format="json")

        self.assertEqual(resp.status_code, 200)
        self.assertFalse(resp.json()["success"])

    @patch("api.views.auth_views.check_password", return_value=False)
    @patch("api.views.auth_views.connection")
    def test_wrong_password_returns_failure(self, mock_conn, _mock_check):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.return_value = ("hashed_password",)

        resp = self.client.post("/auth/login/", {
            "email": "john@example.com",
            "password": "wrong",
        }, format="json")

        self.assertEqual(resp.status_code, 200)
        self.assertFalse(resp.json()["success"])
        self.assertIn("Invalid", resp.json()["message"])

    @patch("api.views.auth_views.connection")
    def test_nonexistent_email_returns_failure(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.return_value = None  # no user_auth row

        resp = self.client.post("/auth/login/", {
            "email": "nobody@example.com",
            "password": "pass",
        }, format="json")

        self.assertEqual(resp.status_code, 200)
        self.assertFalse(resp.json()["success"])


# ── get_profile ───────────────────────────────────────────────

class TestGetProfile(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.auth_views.connection")
    def test_returns_profile(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.return_value = (
            "john@example.com", "John", "Doe", "2025-01-15", True, False,
        )

        resp = self.client.get("/profile/1/")

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["email"], "john@example.com")
        self.assertEqual(data["firstName"], "John")
        self.assertEqual(data["lastName"], "Doe")
        self.assertTrue(data["isStudent"])
        self.assertFalse(data["isAdmin"])

    @patch("api.views.auth_views.connection")
    def test_not_found_returns_404(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.return_value = None

        resp = self.client.get("/profile/999/")

        self.assertEqual(resp.status_code, 404)
        self.assertFalse(resp.json()["success"])


# ── update_profile ────────────────────────────────────────────

class TestUpdateProfile(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.auth_views.connection")
    def test_updates_and_returns_profile(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        # First cursor: UPDATE (no return value needed)
        # Second cursor: SELECT for response
        cursor.fetchone.return_value = (
            "john@example.com", "Jane", "Smith", "2025-01-15", True, False,
        )

        resp = self.client.post("/profile/1/update/", {
            "firstName": "Jane",
            "lastName": "Smith",
        }, format="json")

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["firstName"], "Jane")
        self.assertEqual(data["lastName"], "Smith")

    @patch("api.views.auth_views.connection")
    def test_not_found_returns_404(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.return_value = None  # profile not found after update

        resp = self.client.post("/profile/999/update/", {
            "firstName": "Jane",
            "lastName": "Smith",
        }, format="json")

        self.assertEqual(resp.status_code, 404)


# ── list_users ────────────────────────────────────────────────

class TestListUsers(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.auth_views.connection")
    def test_returns_all_users(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchall.return_value = [
            (1, "John", "Doe", "john@example.com", True, False, "2025-01-15"),
            (2, "Admin", "User", "admin@example.com", True, True, "2025-01-01"),
        ]

        resp = self.client.get("/users/")

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["accountNumber"], 1)
        self.assertEqual(data[0]["firstName"], "John")
        self.assertTrue(data[1]["isAdmin"])

    @patch("api.views.auth_views.connection")
    def test_empty_user_list(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchall.return_value = []

        resp = self.client.get("/users/")

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json(), [])


# ── delete_user ───────────────────────────────────────────────

class TestDeleteUser(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.auth_views.connection")
    def test_deletes_user(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.return_value = ("john@example.com",)  # email lookup

        resp = self.client.delete("/users/1/")

        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.json()["success"])
        # Should have run DELETE on submission, user_auth, account, user_profile
        execute_calls = [call[0][0] for call in cursor.execute.call_args_list]
        self.assertEqual(len(execute_calls), 5)  # 1 SELECT + 4 DELETEs

    @patch("api.views.auth_views.connection")
    def test_not_found_returns_404(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.return_value = None  # account not found

        resp = self.client.delete("/users/999/")

        self.assertEqual(resp.status_code, 404)
        self.assertFalse(resp.json()["success"])
