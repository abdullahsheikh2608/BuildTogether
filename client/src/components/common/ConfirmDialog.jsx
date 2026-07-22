import Modal from "./Modal.jsx";
import Button from "../ui/Button.jsx";

export default function ConfirmDialog({ open, onClose, onConfirm, title, body, confirmLabel = "Delete", confirming = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-paper-dim">{body}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="danger" loading={confirming} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}