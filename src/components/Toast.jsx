import { useEffect } from 'react';
import { CircleCheck, X } from 'lucide-react';

const TOAST_DURATION_MS = 2500;

// Success feedback after create / edit / delete / move. Auto-dismisses.
export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    // The live region is always rendered so screen readers announce new messages
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-60 flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      {toast && (
        <div
          key={toast.id}
          className="pointer-events-auto flex max-w-sm animate-toast-in items-center gap-3 rounded-xl border border-zinc-200 bg-white py-3 pr-2 pl-4 text-sm shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
        >
          <CircleCheck className="size-5 shrink-0 text-emerald-500" aria-hidden="true" />
          <span className="font-medium">{toast.message}</span>
          <button type="button" onClick={onDismiss} className="icon-btn size-7" aria-label="Dismiss notification">
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
