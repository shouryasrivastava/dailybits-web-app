import { CompletedProblem, TodoItem, Problem, AppUser } from "../types";
import { problems as defaultProblems } from "../data/problems";

const STORAGE_KEYS = {
  COMPLETED: "pythonpractice_completed",
  TODO: "pythonpractice_todo",
  CODE_CACHE: "pythonpractice_code_cache",
  USER_ROLE: "pythonpractice_user_role",
  PROBLEMS: "pythonpractice_problems",
  USERS: "pythonpractice_users",
  CURRENT_USER: "pythonpractice_current_user",
};

const defaultUsers: AppUser[] = [
  {
    id: "1",
    email: "ma.ruit@northeastern.edu",
    firstName: "Elly",
    lastName: "Ma",
    registerDate: "2025-01-15",
    isAdmin: false,
  },
  {
    id: "2",
    email: "zhang.shuyi1@husky.neu.edu",
    firstName: "Susie",
    lastName: "Zhang",
    registerDate: "2025-01-20",
    isAdmin: false,
  },
  {
    id: "3",
    email: "student@gmail.com",
    firstName: "Northeastern",
    lastName: "Student",
    registerDate: "2025-02-10",
    isAdmin: false,
  },
  {
    id: "4",
    email: "admin@gmail.com",
    firstName: "Admin",
    lastName: "User",
    registerDate: "2025-01-01",
    isAdmin: true,
  },
  {
    id: "5",
    email: "alex.chen@gmail.com",
    firstName: "Alex",
    lastName: "Chen",
    registerDate: "2025-02-05",
    isAdmin: false,
  },
  {
    id: "6",
    email: "maya.patel@gmail.com",
    firstName: "Maya",
    lastName: "Patel",
    registerDate: "2025-02-07",
    isAdmin: false,
  },
  {
    id: "7",
    email: "jordan.wells@gmail.com",
    firstName: "Jordan",
    lastName: "Wells",
    registerDate: "2025-02-08",
    isAdmin: false,
  },
  {
    id: "8",
    email: "sofia.garcia@gmail.com",
    firstName: "Sofia",
    lastName: "Garcia",
    registerDate: "2025-02-12",
    isAdmin: false,
  },
  {
    id: "9",
    email: "liam.brooks@gmail.com",
    firstName: "Liam",
    lastName: "Brooks",
    registerDate: "2025-02-14",
    isAdmin: false,
  },
  {
    id: "10",
    email: "amira.hassan@gmail.com",
    firstName: "Amira",
    lastName: "Hassan",
    registerDate: "2025-02-16",
    isAdmin: false,
  },
];

// Completed Problems
export function getCompletedProblems(): CompletedProblem[] {
  const data = localStorage.getItem(STORAGE_KEYS.COMPLETED);
  if (!data) return [];
  const parsed = JSON.parse(data);
  return parsed.map((item: any) => ({
    ...item,
    completedAt: new Date(item.completedAt),
  }));
}

export function saveCompletedProblem(completed: CompletedProblem): void {
  const existing = getCompletedProblems();
  const filtered = existing.filter(
    (item) => item.problemId !== completed.problemId,
  );
  filtered.push(completed);
  localStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify(filtered));
}

// Todo Items
export function getTodoItems(): TodoItem[] {
  const data = localStorage.getItem(STORAGE_KEYS.TODO);
  if (!data) return [];
  const parsed = JSON.parse(data);
  return parsed.map((item: any) => ({
    ...item,
    addedAt: new Date(item.addedAt),
  }));
}

export function addTodoItem(item: TodoItem): void {
  const existing = getTodoItems();
  // Don't add duplicates
  if (existing.some((t) => t.problemId === item.problemId)) return;
  existing.push(item);
  localStorage.setItem(STORAGE_KEYS.TODO, JSON.stringify(existing));
}

// Code Cache (for unsaved work)
export function saveCodeCache(problemId: string, code: string): void {
  const cache = getCodeCache();
  cache[problemId] = code;
  localStorage.setItem(STORAGE_KEYS.CODE_CACHE, JSON.stringify(cache));
}

export function getCodeCache(): Record<string, string> {
  const data = localStorage.getItem(STORAGE_KEYS.CODE_CACHE);
  return data ? JSON.parse(data) : {};
}

export function clearCodeCache(problemId: string): void {
  const cache = getCodeCache();
  delete cache[problemId];
  localStorage.setItem(STORAGE_KEYS.CODE_CACHE, JSON.stringify(cache));
}

// User Role
export function getUserRole(): "user" | "administrator" {
  const data = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  return (data as "user" | "administrator") || "user";
}

export function setUserRole(role: "user" | "administrator"): void {
  localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
}

// Problems
export function getProblems(): Problem[] {
  const data = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
  if (!data) {
    localStorage.setItem(
      STORAGE_KEYS.PROBLEMS,
      JSON.stringify(defaultProblems),
    );
    return defaultProblems;
  }
  return JSON.parse(data);
}

export function updateProblem(problem: Problem): void {
  const existing = getProblems();
  const updated = existing.map((p) => (p.id === problem.id ? problem : p));
  localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updated));
}

// Users
export function getUsers(): AppUser[] {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(data);
}

export function updateUser(user: AppUser): void {
  const existing = getUsers();
  const updated = existing.map((u) => (u.id === user.id ? user : u));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
}

export function deleteUser(userId: string): void {
  const existing = getUsers();
  const filtered = existing.filter((u) => u.id !== userId);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
}

// Current User
export function getCurrentUser(): AppUser {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (data) return JSON.parse(data);
  // Default to first user (id='1') consistent with hardcoded ACCOUNT_NUMBER = 1
  const users = getUsers();
  return users[0];
}

export function setCurrentUser(user: AppUser): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

// log out
export function logout(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
}

export function clearCurrentUser(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}
