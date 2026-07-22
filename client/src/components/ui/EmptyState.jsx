export default function EmptyState({ title, body, action }) {
  return (
    <div className="blueprint-card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="font-mono text-[11px] uppercase tracking-widest text-paper-faint">
        Blank sheet
      </span>
      <h3 className="font-display text-lg font-semibold text-paper">{title}</h3>
      <p className="max-w-sm text-sm text-paper-dim">{body}</p>
      {action}
    </div>
  );
}