'use client';

import { Loader2, Trash2, X } from 'lucide-react';

type ConfirmDialogProps = {
  open: boolean;
  loading: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  loading,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 px-4 pb-4 pt-10 md:items-center md:p-6">
      <div className="w-full max-w-md rounded-lg border border-line bg-white p-5 shadow-soft md:p-6" role="dialog" aria-modal="true">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-coral-soft">
              <Trash2 className="h-5 w-5 text-coral" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-ink">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-muted transition hover:bg-canvas disabled:opacity-60"
            title="Cancelar"
            aria-label="Cancelar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-line px-4 font-semibold text-ink transition hover:bg-canvas disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-coral px-4 font-semibold text-white transition hover:bg-coral/90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
