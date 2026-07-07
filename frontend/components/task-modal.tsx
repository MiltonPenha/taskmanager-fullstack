'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { Task, TaskPayload } from '../lib/types';

type TaskModalProps = {
  open: boolean;
  task: Task | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: TaskPayload) => Promise<void>;
};

export function TaskModal({ open, task, loading, onClose, onSubmit }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? '');
      setDescription(task?.description ?? '');
      setError('');
    }
  }, [open, task]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (title.trim().length < 3) {
      setError('O titulo deve ter pelo menos 3 caracteres.');
      return;
    }

    if (description.trim().length < 3) {
      setError('A descricao deve ter pelo menos 3 caracteres.');
      return;
    }

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50 px-4 pb-4 pt-10 md:items-center md:p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-lg bg-white p-5 shadow-soft md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">{task ? 'Editar tarefa' : 'Nova tarefa'}</h2>
            <p className="mt-1 text-sm text-gray-500">{task ? 'Atualize os dados da tarefa.' : 'Registre uma nova tarefa.'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50"
            title="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Titulo
            <input
              className="h-11 rounded-lg border border-gray-300 px-3 outline-none transition focus:border-meadow focus:ring-2 focus:ring-meadow/20"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              placeholder="Ex: estudar NestJS"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Descricao
            <textarea
              className="min-h-32 resize-none rounded-lg border border-gray-300 px-3 py-3 outline-none transition focus:border-meadow focus:ring-2 focus:ring-meadow/20"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={500}
              placeholder="Detalhes da tarefa"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 px-4 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-meadow px-4 font-semibold text-white transition hover:bg-meadow/90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}

