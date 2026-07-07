import { CheckCircle2, XCircle } from 'lucide-react';

export type ToastMessage = {
  type: 'success' | 'error';
  message: string;
};

type ToastProps = {
  toast: ToastMessage | null;
};

export function Toast({ toast }: ToastProps) {
  if (!toast) {
    return null;
  }

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-lg border bg-white p-4 shadow-soft md:right-6 md:top-6">
      <div className="flex items-start gap-3">
        {isSuccess ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-meadow" />
        ) : (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
        )}
        <p className="text-sm font-medium text-ink">{toast.message}</p>
      </div>
    </div>
  );
}

