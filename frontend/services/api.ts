import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User
} from "@/types/auth";
import type { Task, TaskFilters, TaskPayload, TaskStatus } from "@/types/task";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const TOKEN_KEY = "taskmanager_token";

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.auth !== false) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message instanceof Array
        ? data.message.join(" ")
        : data?.message ?? "Nao foi possivel completar a acao.";
    throw new Error(message);
  }

  return data as T;
}

export const authApi = {
  login(payload: LoginPayload) {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify(payload)
    });
  },

  register(payload: RegisterPayload) {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      auth: false,
      body: JSON.stringify(payload)
    });
  },

  me() {
    return request<User>("/auth/me");
  }
};

export const taskApi = {
  list(filters: TaskFilters) {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== "all") {
      params.set("status", filters.status);
    }
    if (filters.search?.trim()) {
      params.set("search", filters.search.trim());
    }

    const query = params.toString();
    return request<Task[]>(`/tasks${query ? `?${query}` : ""}`);
  },

  create(payload: TaskPayload) {
    return request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  update(id: string, payload: Partial<TaskPayload>) {
    return request<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
  },

  remove(id: string) {
    return request<{ message: string }>(`/tasks/${id}`, {
      method: "DELETE"
    });
  },

  setStatus(id: string, status: TaskStatus) {
    return this.update(id, { status });
  }
};

