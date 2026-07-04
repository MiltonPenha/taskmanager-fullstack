"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CirclePlus,
  LogOut,
  Search,
  SlidersHorizontal,
  XCircle
} from "lucide-react";
import { TaskForm } from "@/components/TaskForm";
import { TaskItem } from "@/components/TaskItem";
import { authApi, clearToken, getToken, taskApi } from "@/services/api";
import type { User } from "@/types/auth";
import type { Task, TaskPayload, TaskStatus } from "@/types/task";

type Toast = {
  type: "success" | "error";
  message: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);

  const filteredSummary = useMemo(() => {
    const done = tasks.filter((task) => task.status === "done").length;
    return {
      total: tasks.length,
      done,
      pending: tasks.length - done
    };
  }, [tasks]);

  const showToast = useCallback((message: string, type: Toast["type"]) => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    router.push("/login");
  }, [router]);

  const loadTasks = useCallback(async () => {
    const response = await taskApi.list({ status, search });
    setTasks(response);
  }, [search, status]);

  useEffect(() => {
    async function boot() {
      if (!getToken()) {
        router.push("/login");
        return;
      }

      try {
        const [currentUser, taskList] = await Promise.all([
          authApi.me(),
          taskApi.list({ status, search })
        ]);
        setUser(currentUser);
        setTasks(taskList);
      } catch {
        clearToken();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    boot();
  }, [router, search, status]);

  async function refreshWithFeedback(message: string) {
    await loadTasks();
    showToast(message, "success");
  }

  async function submitTask(payload: TaskPayload) {
    try {
      if (editingTask) {
        await taskApi.update(editingTask.id, payload);
        setEditingTask(null);
        setShowForm(false);
        await refreshWithFeedback("Tarefa atualizada.");
        return;
      }

      await taskApi.create(payload);
      setShowForm(false);
      await refreshWithFeedback("Tarefa criada.");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Erro ao salvar tarefa.",
        "error"
      );
    }
  }

  async function deleteTask(id: string) {
    const confirmed = window.confirm("Deseja excluir esta tarefa?");
    if (!confirmed) {
      return;
    }

    try {
      await taskApi.remove(id);
      await refreshWithFeedback("Tarefa excluida.");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Erro ao excluir tarefa.",
        "error"
      );
    }
  }

  async function updateStatus(id: string, nextStatus: TaskStatus) {
    try {
      await taskApi.setStatus(id, nextStatus);
      await refreshWithFeedback(
        nextStatus === "done"
          ? "Tarefa marcada como concluida."
          : "Tarefa marcada como pendente."
      );
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Erro ao alterar status.",
        "error"
      );
    }
  }

  function startEditing(task: Task) {
    setEditingTask(task);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-lg border border-line bg-white px-6 py-5 text-sm font-medium text-slate-600 shadow-soft">
          Carregando painel...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-700">
              Ola, {user?.name}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal text-ink">
              Painel de tarefas
            </h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              onClick={() => {
                setEditingTask(null);
                setShowForm(true);
              }}
              type="button"
            >
              <CirclePlus aria-hidden size={18} />
              Nova tarefa
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-slate-50"
              onClick={logout}
              type="button"
            >
              <LogOut aria-hidden size={18} />
              Sair
            </button>
          </div>
        </header>

        <section className="grid gap-3 py-6 sm:grid-cols-3">
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <span className="text-sm text-slate-500">Total</span>
            <strong className="mt-1 block text-2xl text-ink">
              {filteredSummary.total}
            </strong>
          </div>
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <span className="text-sm text-slate-500">Pendentes</span>
            <strong className="mt-1 block text-2xl text-amber-700">
              {filteredSummary.pending}
            </strong>
          </div>
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <span className="text-sm text-slate-500">Concluidas</span>
            <strong className="mt-1 block text-2xl text-brand-700">
              {filteredSummary.done}
            </strong>
          </div>
        </section>

        {showForm && (
          <section className="mb-6">
            <TaskForm
              task={editingTask}
              onCancel={() => {
                setEditingTask(null);
                setShowForm(false);
              }}
              onSubmit={submitTask}
            />
          </section>
        )}

        <section className="mb-5 grid gap-3 rounded-lg border border-line bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
              <Search aria-hidden size={17} />
              Buscar por titulo
            </span>
            <input
              className="w-full rounded-md border border-line px-3 py-2.5 text-sm shadow-sm focus:border-brand-500"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Digite um titulo"
              value={search}
            />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
              <SlidersHorizontal aria-hidden size={17} />
              Filtrar status
            </span>
            <select
              className="w-full rounded-md border border-line px-3 py-2.5 text-sm shadow-sm focus:border-brand-500"
              onChange={(event) =>
                setStatus(event.target.value as TaskStatus | "all")
              }
              value={status}
            >
              <option value="all">Todos</option>
              <option value="pending">Pendentes</option>
              <option value="done">Concluidas</option>
            </select>
          </label>
        </section>

        <section className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onEdit={startEditing}
                onStatusChange={updateStatus}
              />
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center shadow-sm">
              <XCircle
                aria-hidden
                className="mx-auto mb-3 text-slate-400"
                size={34}
              />
              <h2 className="text-lg font-semibold text-ink">
                Nenhuma tarefa encontrada
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Ajuste os filtros ou crie uma nova tarefa.
              </p>
            </div>
          )}
        </section>

        {toast && (
          <div
            className={`fixed bottom-4 left-4 right-4 z-20 rounded-md border px-4 py-3 text-sm font-medium shadow-soft sm:left-auto sm:w-96 ${
              toast.type === "success"
                ? "border-brand-100 bg-brand-50 text-brand-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
            role="status"
          >
            {toast.message}
          </div>
        )}
      </div>
    </main>
  );
}

