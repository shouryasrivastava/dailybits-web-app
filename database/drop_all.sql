-- ============================================
-- DailyBits: Drop All Database Objects
-- Run this before re-running dbDDL.sql and dbDML.sql
-- ============================================

-- Triggers
DROP TRIGGER IF EXISTS trg_check_problem_publish ON problem;
DROP TRIGGER IF EXISTS trg_study_note_updated_at ON study_note;

-- Functions
DROP FUNCTION IF EXISTS check_problem_publish();
DROP FUNCTION IF EXISTS refresh_study_note_updated_at();
DROP FUNCTION IF EXISTS accept_study_plan(INT, INT);

-- Views
DROP VIEW IF EXISTS user_algorithm_progress_view;
DROP VIEW IF EXISTS user_recent_activity_view;
DROP VIEW IF EXISTS user_progress_view;
DROP VIEW IF EXISTS single_problem_view;
DROP VIEW IF EXISTS todo_list_view;
DROP VIEW IF EXISTS admin_problem_library_view;
DROP VIEW IF EXISTS user_problem_library_view;

-- Tables (order respects foreign key dependencies)
DROP TABLE IF EXISTS study_note;
DROP TABLE IF EXISTS todo_item;
DROP TABLE IF EXISTS chat_query;
DROP TABLE IF EXISTS study_plan_problems;
DROP TABLE IF EXISTS study_plan;
DROP TABLE IF EXISTS submission;
DROP TABLE IF EXISTS problem_algorithm;
DROP TABLE IF EXISTS algorithm;
DROP TABLE IF EXISTS problem_constraint;
DROP TABLE IF EXISTS problem_example;
DROP TABLE IF EXISTS solution;
DROP TABLE IF EXISTS problem;
DROP TABLE IF EXISTS token_blacklist;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS user_auth;
DROP TABLE IF EXISTS user_profile;
