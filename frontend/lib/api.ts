import { AuthResponse, Task, TaskPayload, TaskStatus } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type RequestOptions = {
  method?: string;
  token?: string | null;
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message = Array.isArray(error?.message) ? error.message.join(', ') : error?.message;
    throw new Error(message ?? 'Não foi possível concluir a ação.');
  }

  return response.json();
}

export function registerUser(payload: { name: string; email: string; password: string }) {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function loginUser(payload: { email: string; password: string }) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function getTasks(token: string, filters: { status: 'ALL' | TaskStatus; search: string }) {
  const params = new URLSearchParams();

  if (filters.status !== 'ALL') {
    params.set('status', filters.status);
  }

  if (filters.search.trim()) {
    params.set('search', filters.search.trim());
  }

  const query = params.toString();
  return request<Task[]>(`/tasks${query ? `?${query}` : ''}`, { token });
}

export function createTask(token: string, payload: TaskPayload) {
  return request<Task>('/tasks', {
    method: 'POST',
    token,
    body: payload,
  });
}

export function updateTask(token: string, id: string, payload: TaskPayload) {
  return request<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    token,
    body: payload,
  });
}

export function deleteTask(token: string, id: string) {
  return request<{ message: string }>(`/tasks/${id}`, {
    method: 'DELETE',
    token,
  });
}

export function toggleTaskStatus(token: string, id: string) {
  return request<Task>(`/tasks/${id}/toggle`, {
    method: 'PATCH',
    token,
  });
}
