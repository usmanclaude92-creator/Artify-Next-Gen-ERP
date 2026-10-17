import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

type Toast = { id: number; message: string };
type ConfirmRequest = { message: string; resolve: (ok: boolean) => void };

let toastListener: ((message: string) => void) | null = null;
let confirmListener: ((req: ConfirmRequest) => void) | null = null;

/** Non-blocking replacement for window.alert. */
export const notify = (message: string): void => {
  if (toastListener) toastListener(message);
  else console.info(message);
};

/** Non-blocking replacement for window.confirm; resolves true when accepted. */
export const confirmAction = (message: string): Promise<boolean> =>
  new Promise(resolve => {
    if (confirmListener) confirmListener({ message, resolve });
    else resolve(false);
  });

let nextToastId = 1;

/** Mount once near the app root to render toasts and confirm dialogs. */
export const FeedbackHost: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pending, setPending] = useState<ConfirmRequest | null>(null);

  useEffect(() => {
    toastListener = message => {
      const id = nextToastId++;
      setToasts(t => [...t, { id, message }]);
      window.setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
    };
    confirmListener = req => setPending(req);
    return () => {
      toastListener = null;
      confirmListener = null;
    };
  }, []);

  const answer = (ok: boolean) => {
    pending?.resolve(ok);
    setPending(null);
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm" role="status" aria-live="polite">
        {toasts.map(t => (
          <div
            key={t.id}
            className="flex items-start gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => setToasts(list => list.filter(x => x.id !== t.id))}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      {pending && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4" role="alertdialog" aria-modal="true">
          <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-xl">
            <p className="text-sm text-slate-800 dark:text-slate-100">{pending.message}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => answer(false)}
                className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                autoFocus
                onClick={() => answer(true)}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
