from unittest.mock import patch, MagicMock

from django.test import SimpleTestCase
from rest_framework.test import APIClient


def _mock_cursor(mock_conn):
    """Return a mock cursor wired to the mocked connection as a context manager."""
    cursor = MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = cursor
    mock_conn.cursor.return_value.__exit__.return_value = False
    return cursor


# ── list_problems ─────────────────────────────────────────────

class TestListProblems(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.problem_views.connection")
    def test_returns_paginated_results(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.description = [
            ("problem_id",), ("problem_title",), ("problem_description",),
            ("difficulty_level",), ("estimate_time_baseline",), ("algorithms",),
        ]
        cursor.fetchall.return_value = [
            (1, "Two Sum", "Find two numbers", "Easy", 15, ["Array", "Hash Table"]),
            (2, "Valid Parentheses", "Check validity", "Easy", 10, ["Stack"]),
        ]

        resp = self.client.get("/problems/")

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["page"], 1)
        self.assertEqual(data["page_size"], 20)
        self.assertEqual(len(data["results"]), 2)
        self.assertEqual(data["results"][0]["problem_title"], "Two Sum")
        self.assertEqual(data["results"][1]["difficulty_level"], "Easy")

    @patch("api.views.problem_views.connection")
    def test_respects_page_parameter(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.description = [
            ("problem_id",), ("problem_title",), ("problem_description",),
            ("difficulty_level",), ("estimate_time_baseline",), ("algorithms",),
        ]
        cursor.fetchall.return_value = []

        resp = self.client.get("/problems/?page=3")

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["page"], 3)
        # offset should be (3-1)*20 = 40
        sql_params = cursor.execute.call_args[0][1]
        self.assertEqual(sql_params, [20, 40])

    def test_invalid_page_returns_400(self):
        resp = self.client.get("/problems/?page=abc")
        self.assertEqual(resp.status_code, 400)
        self.assertIn("error", resp.json())

    @patch("api.views.problem_views.connection")
    def test_empty_results(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.description = [
            ("problem_id",), ("problem_title",), ("problem_description",),
            ("difficulty_level",), ("estimate_time_baseline",), ("algorithms",),
        ]
        cursor.fetchall.return_value = []

        resp = self.client.get("/problems/")

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["results"], [])


# ── get_single_problem ────────────────────────────────────────

class TestGetSingleProblem(SimpleTestCase):
    """
    NOTE: The current urls.py maps this endpoint as <int:pid>, but the view
    signature uses ``pId``.  If the test below returns a 500 / TypeError, that
    URL-param mismatch is the cause.
    """

    def setUp(self):
        self.client = APIClient()

    @patch("api.views.problem_views.connection")
    def test_returns_problem_details(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.description = [
            ("problem_id",), ("problem_title",), ("problem_description",),
            ("difficulty_level",), ("starter_code",), ("estimate_time_baseline",),
            ("algorithms",), ("problem_constraints",), ("examples",),
        ]
        cursor.fetchall.return_value = [
            (1, "Two Sum", "Find two numbers", "Easy", "def solve():", 15,
             ["Array"], ["1 <= n <= 10^4"], [{"input": "[2,7]", "output": "[0,1]"}]),
        ]

        resp = self.client.get("/problems/1/")

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(len(data["results"]), 1)
        self.assertEqual(data["results"][0]["problem_title"], "Two Sum")

    @patch("api.views.problem_views.connection")
    def test_nonexistent_problem_returns_empty(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.description = [
            ("problem_id",), ("problem_title",), ("problem_description",),
            ("difficulty_level",), ("starter_code",), ("estimate_time_baseline",),
            ("algorithms",), ("problem_constraints",), ("examples",),
        ]
        cursor.fetchall.return_value = []

        resp = self.client.get("/problems/999/")

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["results"], [])


# ── submit_problem ────────────────────────────────────────────

class TestSubmitProblem(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("api.views.problem_views.connection")
    def test_successful_submission(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.return_value = (True,)  # is_published

        resp = self.client.post("/problems/1/submit/", {
            "account_number": 1,
            "submission": "def twoSum(): pass",
            "is_correct": True,
        }, format="json")

        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.json()["success"])

    def test_missing_fields_returns_400(self):
        resp = self.client.post("/problems/1/submit/", {}, format="json")
        self.assertEqual(resp.status_code, 400)
        self.assertIn("error", resp.json())

    @patch("api.views.problem_views.connection")
    def test_problem_not_found_returns_404(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.return_value = None

        resp = self.client.post("/problems/999/submit/", {
            "account_number": 1,
            "submission": "code",
        }, format="json")

        self.assertEqual(resp.status_code, 404)
        self.assertIn("error", resp.json())

    @patch("api.views.problem_views.connection")
    def test_unpublished_problem_returns_403(self, mock_conn):
        cursor = _mock_cursor(mock_conn)
        cursor.fetchone.return_value = (False,)  # is_published = False

        resp = self.client.post("/problems/1/submit/", {
            "account_number": 1,
            "submission": "code",
        }, format="json")

        self.assertEqual(resp.status_code, 403)
        self.assertIn("error", resp.json())
