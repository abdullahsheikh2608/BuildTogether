export default function LogoutModal({
    open,
    onClose,
    onConfirm,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-xl border border-blueprint-line bg-blueprint-900 p-6">

                <h2 className="text-2xl font-bold text-paper">
                    Logout
                </h2>

                <p className="mt-3 text-paper-dim">
                    Are you sure you want to logout?
                </p>

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="rounded-lg border border-slate-600 px-5 py-2 text-paper hover:bg-slate-800"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
}