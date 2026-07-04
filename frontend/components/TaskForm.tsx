"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, X } from "lucide-react";
import { z } from "zod";
import type { Task, TaskPayload } from "@/types/task";

const taskSchema = z.object({
  title: z.string().min(2, "Informe um titulo.").max(120),
  description: z.string().min(2, "Informe uma descricao.").max(600),
  status: z.enum(["pending", "done"])
});

type TaskFormValues = z.infer<typeof taskSchema>;

type TaskFormProps = {
  task?: Task | null;
  onCancel: () => void;
  onSubmit: (payload: TaskPayload) => Promise<void>;
};

export function TaskForm({ task, onCancel, onSubmit }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending"
    }
  });

  useEffect(() => {
    reset({
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "pending"
    });
  }, [reset, task]);

  async function submit(values: TaskFormValues) {
    await onSubmit(values);
    reset({
      title: "",
      description: "",
      status: "pending"
    });
  }

  return (
    <form
      className="rounded-lg border border-line bg-white p-4 shadow-sm"
      onSubmit={handleSubmit(submit)}
    >
      <div className="grid gap-4 md:grid-cols-[1fr_180px]">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">Titulo</span>
          <input
            className="w-full rounded-md border border-line px-3 py-2.5 text-sm shadow-sm focus:border-brand-500"
            placeholder="Ex: Revisar README"
            {...register("title")}
          />
          {errors.title && (
            <span className="mt-1 block text-sm text-red-600">
              {errors.title.message}
            </span>
          )}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">Status</span>
          <select
            className="w-full rounded-md border border-line px-3 py-2.5 text-sm shadow-sm focus:border-brand-500"
            {...register("status")}
          >
            <option value="pending">Pendente</option>
            <option value="done">Concluida</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-medium text-ink">Descricao</span>
        <textarea
          className="min-h-28 w-full resize-y rounded-md border border-line px-3 py-2.5 text-sm shadow-sm focus:border-brand-500"
          placeholder="Detalhe a tarefa para facilitar o acompanhamento."
          {...register("description")}
        />
        {errors.description && (
          <span className="mt-1 block text-sm text-red-600">
            {errors.description.message}
          </span>
        )}
      </label>

      <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-slate-50"
          onClick={onCancel}
          type="button"
        >
          <X aria-hidden size={18} />
          Cancelar
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <Loader2 aria-hidden className="animate-spin" size={18} />
          ) : (
            <Save aria-hidden size={18} />
          )}
          {task ? "Salvar alteracoes" : "Criar tarefa"}
        </button>
      </div>
    </form>
  );
}

