import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-paper/60 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="blueprint-card animate-draft-in w-full max-w-lg max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between border-b border-blueprint-line pb-4">
          <h3 className="font-display text-lg font-semibold text-paper">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-paper-faint transition-colors duration-200 hover:bg-blueprint-800 hover:text-paper"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}