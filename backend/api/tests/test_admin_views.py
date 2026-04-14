from unittest.mock import patch, MagicMock

from django.db import DatabaseError
from django.test import SimpleTestCase
from rest_framework.test import APIClient


def _mock_cursor(mock_conn):
    """Return a mock cursor wired to the mocked connection as a context manager."""
    cursor = MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = cursor
    mock_conn.cursor.return_value.__exit__.return_value = False
    return cursor


# ── admin_dashboard_stats ─────────────────────────────────────

class TestAdminDashboardStats(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.admin_views.connection")
    def test_returns_aggregate_counts(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.side_effect = [
            (25,),   # total problems
            (18,),   # published problems
            (100,),  # total users
            (12,),   # total study plans
        ]

        resp = self.client.get("/admin/dashboard-stats/")

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["totalProblems"], 25)
        self.assertEqual(data["publishedProblems"], 18)
        self.assertEqual(data["totalUsers"], 100)
        self.assertEqual(data["totalStudyPlans"], 12)


# ── admin_list_problems ──────────────────────────────────────

class TestAdminListProblems(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.admin_views.connection")
    def test_returns_all_problems(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.description = [
            ("problem_id",), ("problem_title",), ("problem_description",),
            ("difficulty_level",), ("estimate_time_baseline",),
            ("is_published",), ("algorithms",),
        ]
        cursor.fetchall.return_value = [
            (1, "Two Sum", "Desc", "Easy", 15, True, ["Array"]),
            (2, "Draft Problem", "Desc", "Hard", 30, False, []),
        ]

        resp = self.client.get("/admin/problems/")

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(len(data), 2)
        self.assertTrue(data[0]["is_published"])
        self.assertFalse(data[1]["is_published"])

    @patch("api.views.admin_views.connection")
    def test_empty_list(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.description = [
            ("problem_id",), ("problem_title",), ("problem_description",),
            ("difficulty_level",), ("estimate_time_baseline",),
            ("is_published",), ("algorithms",),
        ]
        cursor.fetchall.return_value = []

        resp = self.client.get("/admin/problems/")

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json(), [])


# ── admin_get_problem ─────────────────────────────────────────

class TestAdminGetProblem(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.admin_views.connection")
    def test_returns_full_problem_detail(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        # First cursor block: problem core fields
        cursor.fetchone.return_value = (
            1, "Two Sum", "Find two numbers", "Easy", 15, "def solve():", True,
        )
        # Second cursor block: algorithms, examples, constraints
        cursor.fetchall.side_effect = [
            [("Array",), ("Hash Table",)],                       # algorithms
            [("[2,7,11]", "[0,1]", "Because 2+7=9")],           # examples
            [("1 <= nums.length <= 10^4",)],                     # constraints
        ]

        resp = self.client.get("/admin/problems/1/")

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["problem_id"], 1)
        self.assertEqual(data["problem_title"], "Two Sum")
        self.assertEqual(data["algorithms"], ["Array", "Hash Table"])
        self.assertEqual(len(data["examples"]), 1)
        self.assertEqual(data["problem_constraints"], ["1 <= nums.length <= 10^4"])

    @patch("api.views.admin_views.connection")
    def test_not_found_returns_404(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.return_value = None

        resp = self.client.get("/admin/problems/999/")

        self.assertEqual(resp.status_code, 404)
        self.assertIn("error", resp.json())


# ── admin_add_problem ─────────────────────────────────────────

class TestAdminAddProblem(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.admin_views.transaction")
    @patch("api.views.admin_views.connection")
    def test_creates_problem_with_related_data(self, mock_conn, _mock_tx):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.return_value = (42,)  # RETURNING problem_id

        resp = self.client.post("/admin/problems/add/", {
            "title": "New Problem",
            "difficulty": "Medium",
            "description": "Solve this",
            "estimateTimeBaseline": 20,
            "starterCode": "def solve():",
            "algorithms": ["Array", "Two Pointers"],
            "examples": [{"input": "[1,2]", "output": "3", "explanation": "sum"}],
            "constraints": ["1 <= n <= 100"],
        }, format="json")

        self.assertEqual(resp.status_code, 201)
        data = resp.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["problemId"], 42)

    def test_missing_required_fields_returns_400(self):
        resp = self.client.post("/admin/problems/add/", {
            "title": "",
            "difficulty": "Easy",
            "description": "",
        }, format="json")

        self.assertEqual(resp.status_code, 400)
        self.assertIn("error", resp.json())

    @patch("api.views.admin_views.transaction")
    @patch("api.views.admin_views.connection")
    def test_skips_blank_examples_and_constraints(self, mock_conn, _mock_tx):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.return_value = (1,)

        resp = self.client.post("/admin/problems/add/", {
            "title": "Problem",
            "difficulty": "Easy",
            "description": "Desc",
            "algorithms": ["  "],
            "examples": [{"input": "", "output": ""}],
            "constraints": ["  ", ""],
        }, format="json")

        self.assertEqual(resp.status_code, 201)
        # The view skips blank entries — only the problem INSERT + RETURNING
        # should run; no example/constraint/algorithm inserts.
        execute_calls = cursor.execute.call_args_list
        sql_statements = [call[0][0].strip() for call in execute_calls]
        # Only the initial problem INSERT should be present
        self.assertTrue(any("INSERT INTO problem" in s for s in sql_statements))
        self.assertFalse(any("INSERT INTO problem_example" in s for s in sql_statements))
        self.assertFalse(any("INSERT INTO problem_constraint" in s for s in sql_statements))


# ── admin_update_problem ──────────────────────────────────────

class TestAdminUpdateProblem(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.admin_views.transaction")
    @patch("api.views.admin_views.connection")
    def test_updates_problem_successfully(self, mock_conn, _mock_tx):
        cursor = _mock_cursor(mock_conn)
        cursor.rowcount = 1

        resp = self.client.put("/admin/problems/1/update/", {
            "title": "Updated Title",
            "difficulty": "Hard",
            "description": "Updated desc",
            "algorithms": ["DP"],
            "examples": [{"input": "1", "output": "2"}],
            "constraints": ["n > 0"],
        }, format="json")

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["updatedId"], 1)

    def test_missing_required_fields_returns_400(self):
        resp = self.client.put("/admin/problems/1/update/", {
            "title": "",
            "difficulty": "",
            "description": "only desc",
        }, format="json")

        self.assertEqual(resp.status_code, 400)

    @patch("api.views.admin_views.transaction")
    @patch("api.views.admin_views.connection")
    def test_not_found_returns_404(self, mock_conn, _mock_tx):
        cursor = _mock_cursor(mock_conn)
        cursor.rowcount = 0

        resp = self.client.put("/admin/problems/999/update/", {
            "title": "Title",
            "difficulty": "Easy",
            "description": "Desc",
        }, format="json")

        self.assertEqual(resp.status_code, 404)


# ── admin_delete_problem ──────────────────────────────────────

class TestAdminDeleteProblem(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.admin_views.connection")
    def test_deletes_problem(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.rowcount = 1

        resp = self.client.delete("/admin/problems/1/delete/")

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["deletedId"], 1)

    @patch("api.views.admin_views.connection")
    def test_not_found_returns_404(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.rowcount = 0

        resp = self.client.delete("/admin/problems/999/delete/")

        self.assertEqual(resp.status_code, 404)


# ── admin_set_problem_published ───────────────────────────────

class TestAdminSetProblemPublished(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.admin_views.connection")
    def test_publish_problem(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.rowcount = 1

        resp = self.client.patch(
            "/admin/problems/1/publish/",
            {"isPublished": True},
            format="json",
        )

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["success"])
        self.assertTrue(data["isPublished"])

    @patch("api.views.admin_views.connection")
    def test_unpublish_problem(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.rowcount = 1

        resp = self.client.patch(
            "/admin/problems/1/publish/",
            {"isPublished": False},
            format="json",
        )

        self.assertEqual(resp.status_code, 200)
        self.assertFalse(resp.json()["isPublished"])

    def test_missing_field_returns_400(self):
        resp = self.client.patch(
            "/admin/problems/1/publish/", {}, format="json",
        )
        self.assertEqual(resp.status_code, 400)

    @patch("api.views.admin_views.connection")
    def test_not_found_returns_404(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.rowcount = 0

        resp = self.client.patch(
            "/admin/problems/1/publish/",
            {"isPublished": True},
            format="json",
        )

        self.assertEqual(resp.status_code, 404)

    @patch("api.views.admin_views.connection")
    def test_database_error_returns_400(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.execute.side_effect = DatabaseError("Cannot publish without solution")

        resp = self.client.patch(
            "/admin/problems/1/publish/",
            {"isPublished": True},
            format="json",
        )

        self.assertEqual(resp.status_code, 400)
        self.assertIn("error", resp.json())


# ── admin_toggle_user_admin ───────────────────────────────────

class TestAdminToggleUserAdmin(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.admin_views.connection")
    def test_grant_admin(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.rowcount = 1

        resp = self.client.patch(
            "/admin/users/1/toggle-admin/",
            {"isAdmin": True},
            format="json",
        )

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["success"])
        self.assertTrue(data["isAdmin"])
        self.assertEqual(data["accountNumber"], 1)

    @patch("api.views.admin_views.connection")
    def test_revoke_admin(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.rowcount = 1

        resp = self.client.patch(
            "/admin/users/1/toggle-admin/",
            {"isAdmin": False},
            format="json",
        )

        self.assertEqual(resp.status_code, 200)
        self.assertFalse(resp.json()["isAdmin"])

    def test_missing_field_returns_400(self):
        resp = self.client.patch(
            "/admin/users/1/toggle-admin/", {}, format="json",
        )
        self.assertEqual(resp.status_code, 400)

    @patch("api.views.admin_views.connection")
    def test_user_not_found_returns_404(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.rowcount = 0

        resp = self.client.patch(
            "/admin/users/999/toggle-admin/",
            {"isAdmin": True},
            format="json",
        )

        self.assertEqual(resp.status_code, 404)


# ── admin_list_algorithms ─────────────────────────────────────

class TestAdminListAlgorithms(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.admin_views.connection")
    def test_returns_algorithms(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchall.return_value = [
            (1, "Array"),
            (2, "Dynamic Programming"),
            (3, "Graph"),
        ]

        resp = self.client.get("/admin/algorithms/")

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(len(data), 3)
        self.assertEqual(data[0], {"id": 1, "name": "Array"})

    @patch("api.views.admin_views.connection")
    def test_empty_list(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchall.return_value = []

        resp = self.client.get("/admin/algorithms/")

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json(), [])
