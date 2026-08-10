export default function TextArea({ label, id, hint, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-paper">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={4}
        className={`resize-y rounded-lg border bg-white px-3.5 py-2.5 text-sm text-paper
          placeholder:text-paper-faint outline-none transition-all duration-200
          ${error
            ? 'border-ink-red focus:ring-2 focus:ring-ink-red/20'
            : 'border-blueprint-line focus:border-cyan focus:ring-2 focus:ring-cyan/15'}`}
        {...props}
      />
      {hint && !error && <span className="text-xs text-paper-faint">{hint}</span>}
      {error && <span className="text-xs text-ink-red">{error}</span>}
    </div>
  );
}