const COLOR_STYLES = {
  blue: { bg: 'var(--color-cyan-dim)', fg: 'var(--color-cyan)' },
  green: { bg: '#DCFCE7', fg: 'var(--color-ink-green)' },
  purple: { bg: 'var(--color-indigo-dim)', fg: 'var(--color-indigo)' },
  amber: { bg: 'var(--color-amber-dim)', fg: 'var(--color-amber)' },
};

export default function AnalyticsCard({ label, value, suffix = '', icon: Icon, color = 'blue' }) {
  const style = COLOR_STYLES[color] ?? COLOR_STYLES.blue;

  return (
    <div className="blueprint-card flex items-center gap-4 p-5 transition-all duration-200 hover:shadow-[var(--shadow-card-hover)]">
      {Icon && (
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: style.bg, color: style.fg }}
        >
          <Icon size={22} strokeWidth={2} />
        </div>
      )}

      <div className="min-w-0">
        <span className="block font-display text-2xl font-bold text-paper">
          {value}
          {suffix}
        </span>
        <span className="mt-0.5 block text-sm text-paper-dim">
          {label}
        </span>
      </div>
    </div>
  );
}