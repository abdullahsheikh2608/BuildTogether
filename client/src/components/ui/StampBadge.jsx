const STAMPS = {
  pending: { label: "Pending Review", color: "var(--color-amber)", rotate: "-3deg" },
  accepted: { label: "Accepted", color: "var(--color-ink-green)", rotate: "-5deg" },
  rejected: { label: "Rejected", color: "var(--color-ink-red)", rotate: "4deg" },
};

/**
 * Renders a status like an inspector's ink stamp on a blueprint.
 * status: "pending" | "accepted" | "rejected"
 */
export default function StampBadge({ status = "pending" }) {
  const stamp = STAMPS[status] ?? STAMPS.pending;

  return (
    <span
      className="inline-flex select-none items-center rounded-sm border-[3px] px-3 py-1
        font-mono text-[11px] font-bold uppercase tracking-widest"
      style={{
        color: stamp.color,
        borderColor: stamp.color,
        transform: `rotate(${stamp.rotate})`,
        boxShadow: `inset 0 0 0 2px color-mix(in srgb, ${stamp.color} 25%, transparent)`,
      }}
    >
      {stamp.label}
    </span>
  );
}
