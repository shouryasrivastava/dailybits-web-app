"""
Test settings override — uses an in-memory SQLite database so tests can run
without a PostgreSQL / Supabase connection.

Usage:
    python manage.py test --settings=dailybits.test_settings
"""
from .settings import *  # noqa: F401, F403

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}
