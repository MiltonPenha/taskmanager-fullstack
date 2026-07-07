import { AuthResponse, User } from './types';

const TOKEN_KEY = 'task-manager-token';
const USER_KEY = 'task-manager-user';

export function saveAuth(auth: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, auth.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

