import { CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastMessage = {
  type: 'success' | 'error';
  message: string;
};

type ToastProps = {
  toast: ToastMessage | null;
};

export function Toast({ toast }: ToastProps) {
  const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setCurrentToast(toast);
      window.requestAnimationFrame(() => setVisible(true));
      return;
    }

    setVisible(false);
    const timeout = window.setTimeout(() => setCurrentToast(null), 200);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  if (!currentToast) {
    return null;
  }

  const isSuccess = currentToast.type === 'success';

  return (
    <div
      className={`fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-lg border p-4 shadow-soft transition-all duration-200 ease-out md:right-6 md:top-6 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
      } ${
        isSuccess ? 'border-meadow/30 bg-meadow-soft' : 'border-coral/30 bg-coral-soft'
      }`}
      role={isSuccess ? 'status' : 'alert'}
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {isSuccess ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
            <CheckCircle2 className="h-5 w-5 text-meadow" />
          </span>
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
            <XCircle className="h-5 w-5 text-coral" />
          </span>
        )}
        <p className="pt-1 text-sm font-semibold leading-6 text-ink">{currentToast.message}</p>
      </div>
    </div>
  );
}
