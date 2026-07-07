'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Edit2, Loader2, LogOut, Plus, Search, Trash2 } from 'lucide-react';
import { createTask, deleteTask, getTasks, toggleTaskStatus, updateTask } from '../../lib/api';
import { clearAuth, getToken, getUser } from '../../lib/auth-storage';
import { Task, TaskPayload, TaskStatus, User } from '../../lib/types';
import { TaskModal } from '../../components/task-modal';
import { Toast, ToastMessage } from '../../components/toast';

type StatusFilter = 'ALL' | TaskStatus;

const statusLabels: Record<StatusFilter, string> = {
  ALL: 'Todas',
  PENDING: 'Pendentes',
  DONE: 'Concluidas',
};

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const totals = useMemo(
    () => ({
      all: tasks.length,
      done: tasks.filter((task) => task.status === 'DONE').length,
      pending: tasks.filter((task) => task.status === 'PENDING').length,
    }),
    [tasks],
  );

  const showToast = useCallback((nextToast: ToastMessage) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const handleUnauthorized = useCallback(() => {
    clearAuth();
    router.replace('/login');
  }, [router]);

  const loadTasks = useCallback(
    async (authToken: string, nextStatus: StatusFilter, nextSearch: string) => {
      setLoading(true);

      try {
        const data = await getTasks(authToken, { status: nextStatus, search: nextSearch });
        setTasks(data);
      } catch (err) {
        if (err instanceof Error && err.message.toLowerCase().includes('unauthorized')) {
          handleUnauthorized();
          return;
        }

        showToast({
          type: 'error',
          message: err instanceof Error ? err.message : 'Nao foi possivel carregar as tarefas.',
        });
      } finally {
        setLoading(false);
      }
    },
    [handleUnauthorized, showToast],
  );

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();

    if (!storedToken || !storedUser) {
      router.replace('/login');
      return;
    }

    setToken(storedToken);
    setUser(storedUser);
  }, [router]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void loadTasks(token, status, search);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [loadTasks, search, status, token]);

  function openCreateModal() {
    setSelectedTask(null);
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setSelectedTask(task);
    setModalOpen(true);
  }

  async function handleSubmitTask(payload: TaskPayload) {
    if (!token) {
      return;
    }

    setSaving(true);

    try {
      if (selectedTask) {
        await updateTask(token, selectedTask.id, payload);
        showToast({ type: 'success', message: 'Tarefa atualizada com sucesso.' });
      } else {
        await createTask(token, payload);
        showToast({ type: 'success', message: 'Tarefa criada com sucesso.' });
      }

      setModalOpen(false);
      setSelectedTask(null);
      await loadTasks(token, status, search);
    } catch (err) {
      showToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Nao foi possivel salvar a tarefa.',
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(task: Task) {
    if (!token || !window.confirm(`Excluir "${task.title}"?`)) {
      return;
    }

    setActionId(task.id);

    try {
      await deleteTask(token, task.id);
      showToast({ type: 'success', message: 'Tarefa excluida com sucesso.' });
      await loadTasks(token, status, search);
    } catch (err) {
      showToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Nao foi possivel excluir a tarefa.',
      });
    } finally {
      setActionId(null);
    }
  }

  async function handleToggle(task: Task) {
    if (!token) {
      return;
    }

    setActionId(task.id);

    try {
      await toggleTaskStatus(token, task.id);
      showToast({ type: 'success', message: 'Status atualizado com sucesso.' });
      await loadTasks(token, status, search);
    } catch (err) {
      showToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Nao foi possivel alterar o status.',
      });
    } finally {
      setActionId(null);
    }
  }

  function handleLogout() {
    showToast({ type: 'success', message: 'Logout realizado com sucesso.' });
    window.setTimeout(() => {
      clearAuth();
      router.replace('/login');
    }, 300);
  }

  return (
    <main className="min-h-screen bg-wheat">
      <Toast toast={toast} />

      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-meadow">Task Manager</p>
            <h1 className="mt-1 text-2xl font-bold text-ink md:text-3xl">Minhas tarefas</h1>
            {user && <p className="mt-1 text-sm text-gray-500">{user.name} - {user.email}</p>}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={openCreateModal}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-meadow px-4 font-semibold text-white transition hover:bg-meadow/90"
            >
              <Plus className="h-5 w-5" />
              Nova tarefa
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-gray-500">Total</p>
            <strong className="mt-2 block text-3xl text-ink">{totals.all}</strong>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-gray-500">Pendentes</p>
            <strong className="mt-2 block text-3xl text-coral">{totals.pending}</strong>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-gray-500">Concluidas</p>
            <strong className="mt-2 block text-3xl text-meadow">{totals.done}</strong>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-soft md:flex-row md:items-center md:justify-between">
          <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-gray-200 md:w-auto">
            {(Object.keys(statusLabels) as StatusFilter[]).map((option) => (
              <button
                key={option}
                onClick={() => setStatus(option)}
                className={`h-10 px-3 text-sm font-semibold transition ${
                  status === option ? 'bg-ink text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {statusLabels[option]}
              </button>
            ))}
          </div>

          <label className="relative block md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-3 outline-none transition focus:border-meadow focus:ring-2 focus:ring-meadow/20"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por titulo"
            />
          </label>
        </div>

        <div className="rounded-lg bg-white shadow-soft">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-meadow" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
              <h2 className="text-xl font-bold text-ink">Nenhuma tarefa encontrada</h2>
              <p className="mt-2 max-w-sm text-sm text-gray-500">Crie uma tarefa ou ajuste os filtros para visualizar outros resultados.</p>
              <button
                onClick={openCreateModal}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-meadow px-4 font-semibold text-white transition hover:bg-meadow/90"
              >
                <Plus className="h-5 w-5" />
                Nova tarefa
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <li key={task.id} className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center md:p-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="break-words text-lg font-bold text-ink">{task.title}</h2>
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                          task.status === 'DONE' ? 'bg-green-50 text-meadow' : 'bg-red-50 text-coral'
                        }`}
                      >
                        {task.status === 'DONE' ? 'Concluida' : 'Pendente'}
                      </span>
                    </div>
                    <p className="mt-2 break-words text-sm leading-6 text-gray-600">{task.description}</p>
                    <p className="mt-3 text-xs font-medium text-gray-400">
                      Criada em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(task.createdAt))}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:w-[144px]">
                    <button
                      onClick={() => handleToggle(task)}
                      disabled={actionId === task.id}
                      className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-gray-200 text-meadow transition hover:bg-green-50 disabled:opacity-60"
                      title="Alternar status"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => openEditModal(task)}
                      disabled={actionId === task.id}
                      className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-gray-200 text-ink transition hover:bg-gray-50 disabled:opacity-60"
                      title="Editar"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(task)}
                      disabled={actionId === task.id}
                      className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-gray-200 text-coral transition hover:bg-red-50 disabled:opacity-60"
                      title="Excluir"
                    >
                      {actionId === task.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <TaskModal
        open={modalOpen}
        task={selectedTask}
        loading={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitTask}
      />
    </main>
  );
}
