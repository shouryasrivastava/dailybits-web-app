import { CompletedProblem, TodoItem, StudyPlan } from '../types';

const STORAGE_KEYS = {
  COMPLETED: 'pythonpractice_completed',
  TODO: 'pythonpractice_todo',
  STUDY_PLANS: 'pythonpractice_study_plans',
  CODE_CACHE: 'pythonpractice_code_cache',
  USER_ROLE: 'pythonpractice_user_role',
};

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
  const filtered = existing.filter((item) => item.problemId !== completed.problemId);
  filtered.push(completed);
  localStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify(filtered));
}

export function removeCompletedProblem(problemId: string): void {
  const existing = getCompletedProblems();
  const filtered = existing.filter((item) => item.problemId !== problemId);
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

export function removeTodoItem(problemId: string): void {
  const existing = getTodoItems();
  const filtered = existing.filter((item) => item.problemId !== problemId);
  localStorage.setItem(STORAGE_KEYS.TODO, JSON.stringify(filtered));
}

export function updateTodoPriority(problemId: string, priority: 'low' | 'medium' | 'high'): void {
  const existing = getTodoItems();
  const updated = existing.map((item) =>
    item.problemId === problemId ? { ...item, priority } : item
  );
  localStorage.setItem(STORAGE_KEYS.TODO, JSON.stringify(updated));
}

export function updateTodoNotes(problemId: string, notes: string): void {
  const existing = getTodoItems();
  const updated = existing.map((item) =>
    item.problemId === problemId ? { ...item, notes } : item
  );
  localStorage.setItem(STORAGE_KEYS.TODO, JSON.stringify(updated));
}

// Study Plans
export function getStudyPlans(): StudyPlan[] {
  const data = localStorage.getItem(STORAGE_KEYS.STUDY_PLANS);
  if (!data) return [];
  const parsed = JSON.parse(data);
  return parsed.map((plan: any) => ({
    ...plan,
    createdAt: new Date(plan.createdAt),
  }));
}

export function saveStudyPlan(plan: StudyPlan): void {
  const existing = getStudyPlans();
  existing.push(plan);
  localStorage.setItem(STORAGE_KEYS.STUDY_PLANS, JSON.stringify(existing));
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
export function getUserRole(): 'user' | 'administrator' {
  const data = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  return (data as 'user' | 'administrator') || 'user';
}

export function setUserRole(role: 'user' | 'administrator'): void {
  localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
}