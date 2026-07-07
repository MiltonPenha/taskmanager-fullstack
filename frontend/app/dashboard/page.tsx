'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Edit2,
  Loader2,
  LogOut,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { createTask, deleteTask, getTasks, toggleTaskStatus, updateTask } from '../../lib/api';
import { clearAuth, getToken, getUser } from '../../lib/auth-storage';
import { Task, TaskPayload, TaskStatus, User } from '../../lib/types';
import { ConfirmDialog } from '../../components/confirm-dialog';
import { TaskModal } from '../../components/task-modal';
import { Toast, ToastMessage } from '../../components/toast';

type StatusFilter = 'ALL' | TaskStatus;

const statusLabels: Record<StatusFilter, string> = {
  ALL: 'Todas',
  PENDING: 'Pendentes',
  DONE: 'Concluídas',
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
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
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

  const isFiltered = status !== 'ALL' || search.trim().length > 0;

  const showToast = useCallback((nextToast: ToastMessage) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 2200);
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
          message: err instanceof Error ? err.message : 'Não foi possível carregar as tarefas.',
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
        message: err instanceof Error ? err.message : 'Não foi possível salvar a tarefa.',
      });
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(task: Task) {
    setTaskToDelete(task);
  }

  async function confirmDelete() {
    if (!token || !taskToDelete) {
      return;
    }

    setActionId(taskToDelete.id);

    try {
      await deleteTask(token, taskToDelete.id);
      showToast({ type: 'success', message: 'Tarefa excluída com sucesso.' });
      setTaskToDelete(null);
      await loadTasks(token, status, search);
    } catch (err) {
      showToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Não foi possível excluir a tarefa.',
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
      showToast({
        type: 'success',
        message: task.status === 'PENDING' ? 'Tarefa marcada como concluída.' : 'Tarefa marcada como pendente.',
      });
      await loadTasks(token, status, search);
    } catch (err) {
      showToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Não foi possível alterar o status.',
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
    <main className="min-h-screen bg-canvas">
      <Toast toast={toast} />

      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-start gap-4">
            <img src="/logo.png" alt="Task Manager" className="h-14 w-14 shrink-0 rounded-lg border border-line object-cover" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-meadow">TASK MANAGER</p>
              <h1 className="mt-1 text-2xl font-bold text-ink md:text-3xl">Minhas tarefas</h1>
              {user && (
                <p className="mt-2 text-sm text-muted">
                  Olá, <span className="font-semibold text-ink">{user.name}</span>
                  <span className="mx-2 text-line">|</span>
                  <span>{user.email}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={openCreateModal}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-meadow px-4 font-semibold text-white transition hover:bg-meadow-dark"
            >
              <Plus className="h-5 w-5" />
              Nova tarefa
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 font-semibold text-ink transition hover:bg-canvas"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard icon={ClipboardList} label="Total" value={totals.all} helper="Todas as tarefas" tone="neutral" />
          <StatsCard icon={Clock3} label="Pendentes" value={totals.pending} helper="Aguardando conclusão" tone="pending" />
          <StatsCard icon={CheckCircle2} label="Concluídas" value={totals.done} helper="Tarefas finalizadas" tone="done" />
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 shadow-soft md:flex-row md:items-center md:justify-between">
          <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-line md:w-auto">
            {(Object.keys(statusLabels) as StatusFilter[]).map((option) => (
              <button
                key={option}
                onClick={() => setStatus(option)}
                className={`h-10 px-3 text-sm font-semibold transition ${
                  status === option ? 'bg-ink text-white' : 'bg-white text-muted hover:bg-canvas hover:text-ink'
                }`}
              >
                {statusLabels[option]}
              </button>
            ))}
          </div>

          <label className="relative block md:w-80">
            <span className="sr-only">Buscar por título</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              className="h-10 w-full rounded-lg border border-line pl-10 pr-3 outline-none transition focus:border-meadow focus:ring-2 focus:ring-meadow/20"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por título"
            />
          </label>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-lg border border-line bg-white shadow-soft">
            <Loader2 className="h-8 w-8 animate-spin text-meadow" />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState filtered={isFiltered} onCreate={openCreateModal} />
        ) : (
          <ul className="grid gap-4">
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskCard
                  task={task}
                  loading={actionId === task.id}
                  onToggle={() => handleToggle(task)}
                  onEdit={() => openEditModal(task)}
                  onDelete={() => handleDelete(task)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <TaskModal
        open={modalOpen}
        task={selectedTask}
        loading={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitTask}
      />

      <ConfirmDialog
        open={Boolean(taskToDelete)}
        loading={Boolean(taskToDelete && actionId === taskToDelete.id)}
        title="Excluir tarefa?"
        description="Esta ação não poderá ser desfeita."
        confirmLabel="Excluir tarefa"
        onCancel={() => setTaskToDelete(null)}
        onConfirm={confirmDelete}
      />
    </main>
  );
}

type StatsCardProps = {
  icon: LucideIcon;
  label: string;
  value: number;
  helper: string;
  tone: 'neutral' | 'pending' | 'done';
};

function StatsCard({ icon: Icon, label, value, helper, tone }: StatsCardProps) {
  const toneClass = {
    neutral: 'bg-slate-100 text-ink',
    pending: 'bg-coral-soft text-coral',
    done: 'bg-meadow-soft text-meadow',
  }[tone];

  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted">{label}</p>
          <strong className="mt-2 block text-3xl text-ink">{value}</strong>
          <p className="mt-1 text-sm text-muted">{helper}</p>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </article>
  );
}

type TaskCardProps = {
  task: Task;
  loading: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function TaskCard({ task, loading, onToggle, onEdit, onDelete }: TaskCardProps) {
  const isDone = task.status === 'DONE';
  const toggleLabel = isDone ? 'Marcar como pendente' : 'Marcar como concluída';

  return (
    <article className="grid gap-4 rounded-lg border border-line bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-md md:grid-cols-[1fr_auto] md:items-center md:p-5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className={`break-words text-lg font-bold text-ink ${isDone ? 'line-through decoration-meadow/50' : ''}`}>
            {task.title}
          </h2>
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
              isDone ? 'bg-meadow-soft text-meadow' : 'bg-coral-soft text-coral'
            }`}
          >
            {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
            {isDone ? 'Concluída' : 'Pendente'}
          </span>
        </div>
        <p className={`mt-2 break-words text-sm leading-6 ${isDone ? 'text-muted' : 'text-slate-600'}`}>{task.description}</p>
        <p className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-muted">
          <CalendarDays className="h-4 w-4" />
          Criada em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(task.createdAt))}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 md:w-[156px]">
        <IconButton
          label={toggleLabel}
          onClick={onToggle}
          disabled={loading}
          className="text-meadow hover:bg-meadow-soft"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : isDone ? <RotateCcw className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
        </IconButton>
        <IconButton label="Editar tarefa" onClick={onEdit} disabled={loading} className="text-ink hover:bg-canvas">
          <Edit2 className="h-5 w-5" />
        </IconButton>
        <IconButton label="Excluir tarefa" onClick={onDelete} disabled={loading} className="text-coral hover:bg-coral-soft">
          <Trash2 className="h-5 w-5" />
        </IconButton>
      </div>
    </article>
  );
}

type IconButtonProps = {
  label: string;
  disabled?: boolean;
  className: string;
  children: ReactNode;
  onClick: () => void;
};

function IconButton({ label, disabled, className, children, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-11 w-full items-center justify-center rounded-lg border border-line transition disabled:opacity-60 ${className}`}
      title={label}
      aria-label={label}
    >
      {children}
    </button>
  );
}

type EmptyStateProps = {
  filtered: boolean;
  onCreate: () => void;
};

function EmptyState({ filtered, onCreate }: EmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-line bg-white px-5 py-10 text-center shadow-soft">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-meadow-soft text-meadow">
        <ClipboardList className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-xl font-bold text-ink">{filtered ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa por aqui'}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
        {filtered
          ? 'Nenhuma tarefa corresponde aos filtros selecionados.'
          : 'Crie sua primeira tarefa e comece a organizar suas atividades.'}
      </p>
      <button
        onClick={onCreate}
        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-meadow px-4 font-semibold text-white transition hover:bg-meadow-dark"
      >
        <Plus className="h-5 w-5" />
        {filtered ? 'Nova tarefa' : 'Criar primeira tarefa'}
      </button>
    </div>
  );
}
