import { useCallback, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { ToastContext } from "./toast-context.js";

const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "success", message }) => {
      const id = crypto.randomUUID();
      setToasts((list) => [...list, { id, type, message }]);
      setTimeout(() => dismissToast(id), AUTO_DISMISS_MS);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex min-w-[280px] items-start gap-3 rounded-xl border
              bg-white px-4 py-3.5 text-sm shadow-[var(--shadow-popover)] animate-draft-in ${
                toast.type === "error"
                  ? "border-ink-red/20"
                  : "border-ink-green/20"
              }`}
          >
            {toast.type === "error" ? (
              <XCircle size={18} className="mt-0.5 flex-shrink-0 text-ink-red" />
            ) : (
              <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-ink-green" />
            )}
            <span className="flex-1 leading-relaxed text-paper">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss"
              className="text-paper-faint transition-colors duration-200 hover:text-paper"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}