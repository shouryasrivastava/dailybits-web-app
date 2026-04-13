export const TOKEN_KEY = "access_token";
export const USER_KEY = "user";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveUser(user: unknown) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser<T = any>() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function removeUser() {
  localStorage.removeItem(USER_KEY);
}

export function logout() {
  removeToken();
  removeUser();
}
