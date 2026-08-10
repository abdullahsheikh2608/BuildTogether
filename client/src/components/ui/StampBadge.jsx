const STAMPS = {
  pending: { label: 'Pending Review', color: 'var(--color-amber)', bg: 'var(--color-amber-dim)' },
  accepted: { label: 'Accepted', color: 'var(--color-ink-green)', bg: '#DCFCE7' },
  rejected: { label: 'Rejected', color: 'var(--color-ink-red)', bg: '#FEE2E2' },

  todo: { label: 'To Do', color: 'var(--color-paper-dim)', bg: 'var(--color-blueprint-800)' },
  in_progress: { label: 'In Progress', color: 'var(--color-cyan)', bg: 'var(--color-cyan-dim)' },
  done: { label: 'Completed', color: 'var(--color-ink-green)', bg: '#DCFCE7' },

  open: { label: 'Open', color: 'var(--color-ink-green)', bg: '#DCFCE7' },
  closed: { label: 'Closed', color: 'var(--color-paper-dim)', bg: 'var(--color-blueprint-800)' },
};

export default function StampBadge({ status = 'pending' }) {
  const stamp = STAMPS[status] ?? {
    label: status,
    color: 'var(--color-paper-dim)',
    bg: 'var(--color-blueprint-800)',
  };

  return (
    <span
      className="inline-flex select-none items-center gap-1.5 rounded-full px-2.5 py-1
        text-xs font-medium"
      style={{ color: stamp.color, backgroundColor: stamp.bg }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: stamp.color }}
      />
      {stamp.label}
    </span>
  );
}