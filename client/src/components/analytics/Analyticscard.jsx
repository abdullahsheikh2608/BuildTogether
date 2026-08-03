export default function AnalyticsCard({ label, value, suffix = '' }) {
  return (
    <div className="blueprint-card flex flex-col gap-1 p-4">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-paper-faint">
        {label}
      </span>

      <span className="font-display text-2xl font-semibold text-paper">
        {value}
        {suffix}
      </span>
    </div>
  );
}