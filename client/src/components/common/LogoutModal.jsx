import Button from "../ui/Button.jsx";

export default function LogoutModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/60 px-4 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="blueprint-card animate-draft-in relative w-full max-w-md p-6">
        <h2 className="font-display text-xl font-semibold text-paper">Log out</h2>
        <p className="mt-2 text-sm text-paper-dim">
          Are you sure you want to log out of your account?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Log out</Button>
        </div>
      </div>
    </div>
  );
}