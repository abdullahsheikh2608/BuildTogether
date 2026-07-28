import { useCallback, useState } from "react";
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
            className={`pointer-events-auto flex min-w-[260px] items-start gap-3 rounded-sm border-2 px-4 py-3
              font-mono text-xs shadow-lg animate-draft-in ${
                toast.type === "error"
                  ? "border-ink-red bg-blueprint-900 text-ink-red"
                  : "border-ink-green bg-blueprint-900 text-ink-green"
              }`}
          >
            <span className="mt-0.5">{toast.type === "error" ? "✕" : "✓"}</span>
            <span className="flex-1 leading-relaxed text-paper">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss"
              className="text-paper-faint hover:text-paper"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}