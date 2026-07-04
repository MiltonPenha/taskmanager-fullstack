"use client";

import { Check, Clock3, Pencil, Trash2 } from "lucide-react";
import type { Task, TaskStatus } from "@/types/task";

type TaskItemProps = {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
};

export function TaskItem({
  task,
  onDelete,
  onEdit,
  onStatusChange
}: TaskItemProps) {
  const isDone = task.status === "done";
  const createdAt = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(task.createdAt));

  return (
    <article className="rounded-lg border border-line bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold ${
                isDone
                  ? "bg-brand-50 text-brand-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {isDone ? <Check aria-hidden size={14} /> : <Clock3 aria-hidden size={14} />}
              {isDone ? "Concluida" : "Pendente"}
            </span>
            <time className="text-xs text-slate-500" dateTime={task.createdAt}>
              Criada em {createdAt}
            </time>
          </div>
          <h3 className="mt-3 break-words text-lg font-semibold text-ink">
            {task.title}
          </h3>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
            {task.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            aria-label={isDone ? "Marcar como pendente" : "Marcar como concluida"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-slate-700 transition hover:bg-slate-50"
            onClick={() =>
              onStatusChange(task.id, isDone ? "pending" : "done")
            }
            title={isDone ? "Marcar como pendente" : "Marcar como concluida"}
            type="button"
          >
            {isDone ? <Clock3 aria-hidden size={18} /> : <Check aria-hidden size={18} />}
          </button>
          <button
            aria-label="Editar tarefa"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-slate-700 transition hover:bg-slate-50"
            onClick={() => onEdit(task)}
            title="Editar tarefa"
            type="button"
          >
            <Pencil aria-hidden size={18} />
          </button>
          <button
            aria-label="Excluir tarefa"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-red-200 text-red-600 transition hover:bg-red-50"
            onClick={() => onDelete(task.id)}
            title="Excluir tarefa"
            type="button"
          >
            <Trash2 aria-hidden size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

