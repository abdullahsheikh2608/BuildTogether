export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
 
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-blueprint-950/80 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="blueprint-card animate-draft-in w-full max-w-lg max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-paper">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="font-mono text-lg leading-none text-paper-faint hover:text-paper"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}