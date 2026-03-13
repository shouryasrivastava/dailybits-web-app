/**
 * API service layer for the admin dashboard.
 *
 * All functions call the Django backend at API_BASE and return typed data.
 * Components should use the public functions (fetchDashboardStats, etc.)
 * and the data-mapper helpers (apiProblemToFrontend, apiUserToFrontend)
 * to convert backend responses into frontend types.
 */

import { Problem, Difficulty, AppUser } from "../types";

const API_BASE = "http://localhost:8000";

// ============================================================
// Generic fetch wrapper
// ============================================================

/** Fetch JSON from the backend. Throws on non-2xx responses with the error message from the body. */
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `Request failed (${res.status})`);
  }

  return res.json();
}

// ============================================================
// Dashboard stats
// ============================================================

export interface DashboardStats {
  totalProblems: number;
  publishedProblems: number;
  totalUsers: number;
  totalStudyPlans: number;
}

export function fetchDashboardStats(): Promise<DashboardStats> {
  return apiFetch("/admin/dashboard-stats/");
}

// ============================================================
// Problems
// ============================================================

/** Shape returned by GET /admin/problems/ (list view — no examples/constraints) */
export interface ApiProblemListItem {
  problem_id: number;
  problem_title: string;
  problem_description: string;
  difficulty_level: string;
  is_published: boolean;
  algorithms: string[];
}

/** Shape returned by GET /admin/problems/<pid>/ (full detail) */
export interface ApiProblemDetail {
  problem_id: number;
  problem_title: string;
  problem_description: string;
  difficulty_level: string;
  starter_code: string;
  is_published: boolean;
  algorithms: string[];
  problem_constraints: string[];
  examples: { input: string; output: string; explanation: string | null }[];
}

/** Payload sent to POST /admin/problems/add/ and PUT .../update/ */
export interface ProblemPayload {
  title: string;
  difficulty: string;
  description: string;
  starterCode: string;
  algorithms: string[];
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
}

export function fetchAdminProblems(): Promise<ApiProblemListItem[]> {
  return apiFetch("/admin/problems/");
}

export function fetchAdminProblem(pid: number): Promise<ApiProblemDetail> {
  return apiFetch(`/admin/problems/${pid}/`);
}

export function createProblem(data: ProblemPayload) {
  return apiFetch<{ success: boolean; problemId: number }>("/admin/problems/add/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProblemApi(pid: number, data: ProblemPayload) {
  return apiFetch<{ success: boolean }>(`/admin/problems/${pid}/update/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteProblemApi(pid: number) {
  return apiFetch<{ success: boolean }>(`/admin/problems/${pid}/delete/`, {
    method: "DELETE",
  });
}

// ============================================================
// Users
// ============================================================

/** Shape returned by GET /users/ (from auth_views.list_users) */
export interface ApiUser {
  accountNumber: number;
  firstName: string;
  lastName: string;
  email: string;
  isStudent: boolean;
  isAdmin: boolean;
  registerDate: string;
}

export function fetchUsers(): Promise<ApiUser[]> {
  return apiFetch("/users/");
}

export function deleteUserApi(accountNumber: number) {
  return apiFetch<{ success: boolean }>(`/users/${accountNumber}/`, {
    method: "DELETE",
  });
}

export function toggleUserAdmin(accountNumber: number, isAdmin: boolean) {
  return apiFetch<{ success: boolean }>(`/admin/users/${accountNumber}/toggle-admin/`, {
    method: "PATCH",
    body: JSON.stringify({ isAdmin }),
  });
}

// ============================================================
// Algorithms
// ============================================================

export interface ApiAlgorithm {
  id: number;
  name: string;
}

export function fetchAlgorithms(): Promise<ApiAlgorithm[]> {
  return apiFetch("/admin/algorithms/");
}

// ============================================================
// Data mappers — convert backend snake_case to frontend camelCase
// ============================================================

/** Convert a problem list item (no examples/constraints) to the frontend Problem type */
export function apiProblemListToFrontend(item: ApiProblemListItem): Problem {
  return {
    id: String(item.problem_id),
    title: item.problem_title,
    difficulty: item.difficulty_level as Difficulty,
    algorithm: item.algorithms || [],
    description: item.problem_description,
    examples: [],
    constraints: [],
    starterCode: "",
    testCases: [],
  };
}

/** Convert a full problem detail to the frontend Problem type */
export function apiProblemDetailToFrontend(item: ApiProblemDetail): Problem {
  return {
    id: String(item.problem_id),
    title: item.problem_title,
    difficulty: item.difficulty_level as Difficulty,
    algorithm: item.algorithms || [],
    description: item.problem_description,
    examples: (item.examples || []).map((e) => ({
      input: e.input,
      output: e.output,
      explanation: e.explanation || undefined,
    })),
    constraints: item.problem_constraints || [],
    starterCode: item.starter_code || "",
    testCases: [], // no DB table for test cases
  };
}

/** Convert a backend user to the frontend AppUser type */
export function apiUserToFrontend(u: ApiUser): AppUser {
  return {
    id: String(u.accountNumber),
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    registerDate: u.registerDate,
    isAdmin: u.isAdmin,
  };
}

// ============================================================
// Chat / AI Study Plan Generation
// ============================================================

export interface StudyPlanProblem {
  problem_id: number;
  problem_title: string;
  difficulty_level: string;
  algorithms: string[];
  estimate_time: number;
}

export interface GeneratedPlan {
  plan_id: number;
  plan_name: string;
  problems: StudyPlanProblem[];
  ai_message: string;
  total_time: number;
}

export function generateStudyPlan(accountNumber: number, message: string): Promise<GeneratedPlan> {
  return apiFetch("/chat/generate-plan/", {
    method: "POST",
    body: JSON.stringify({ account_number: accountNumber, message }),
  });
}

export function acceptStudyPlan(accountNumber: number, planId: number) {
  return apiFetch<{ success: boolean; plan_id: number }>("/chat/accept-plan/", {
    method: "POST",
    body: JSON.stringify({ account_number: accountNumber, plan_id: planId }),
  });
}

export interface ChatHistoryItem {
  query_id: number;
  user_message: string;
  ai_response: string;
  created_at: string;
}

export function fetchChatHistory(accountNumber: number): Promise<ChatHistoryItem[]> {
  return apiFetch(`/chat/history/${accountNumber}/`);
}

// ============================================================
// Progress Tracking
// ============================================================

export interface UserProgressData {
  problems_solved: number;
  total_practice_days: number;
  last_practice_date: string | null;
  todo_count: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  easy_total: number;
  medium_total: number;
  hard_total: number;
}

export function fetchUserProgress(accountNumber: number): Promise<UserProgressData> {
  return apiFetch(`/progress/${accountNumber}/`);
}

export interface RecentActivityItem {
  problem_id: number;
  problem_title: string;
  difficulty_level: string;
  submitted_at: string;
  is_correct: boolean;
}

export function fetchRecentActivity(accountNumber: number): Promise<RecentActivityItem[]> {
  return apiFetch(`/progress/${accountNumber}/recent/`);
}

export interface AlgorithmProgressItem {
  algorithm_name: string;
  problems_solved: number;
}

export function fetchAlgorithmProgress(accountNumber: number): Promise<AlgorithmProgressItem[]> {
  return apiFetch(`/progress/${accountNumber}/algorithms/`);
}

// ============================================================
// Study Plans
// ============================================================

export interface StudyPlanListItem {
  plan_id: number;
  plan_name: string;
  time_available: number;
  created_at: string;
  is_accepted: boolean;
  problems: {
    problem_id: number;
    problem_title: string;
    difficulty_level: string;
    estimate_time_assigned: number;
  }[];
}

export function fetchStudyPlans(accountNumber: number): Promise<StudyPlanListItem[]> {
  return apiFetch(`/study-plans/${accountNumber}/`);
}
