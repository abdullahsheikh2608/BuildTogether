export default function LogoutModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Blur */}

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}

      <div className="relative w-full max-w-md rounded-2xl border border-blueprint-line bg-blueprint-900 p-8 shadow-2xl animate-[fadeIn_.2s_ease]">
        <h2 className="text-2xl font-bold text-paper">Logout</h2>

        <p className="mt-3 text-paper-dim">Are you sure you want to logout?</p>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-5 py-2 text-paper transition hover:bg-slate-800"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
