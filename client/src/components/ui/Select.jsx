export default function Select({ label, id, options, className = '', ...props }) {
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
      <select
        id={id}
        className="rounded-sm border border-blueprint-line bg-blueprint-800/60 px-3.5 py-2.5
          text-sm text-paper outline-none transition-colors duration-150 focus:border-cyan"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-blueprint-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
