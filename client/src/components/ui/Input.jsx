export default function Input({ label, id, hint, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="font-mono text-xs font-semibold uppercase tracking-widest text-paper-dim"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-sm border bg-blueprint-800/60 px-3.5 py-2.5 text-sm text-paper
          placeholder:text-paper-faint outline-none transition-colors duration-150
          ${error ? 'border-ink-red' : 'border-blueprint-line focus:border-cyan'}`}
        {...props}
      />
      {hint && !error && <span className="font-mono text-[11px] text-paper-faint">{hint}</span>}
      {error && <span className="font-mono text-xs text-ink-red">{error}</span>}
    </div>
  );
}
