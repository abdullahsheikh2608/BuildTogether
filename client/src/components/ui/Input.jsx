export default function Input({ label, id, hint, error, icon: Icon, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-paper">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-faint"
          />
        )}
        <input
          id={id}
          className={`w-full rounded-lg border bg-white py-2.5 text-sm text-paper
            placeholder:text-paper-faint outline-none transition-all duration-200
            ${Icon ? 'pl-10 pr-3.5' : 'px-3.5'}
            ${error
              ? 'border-ink-red focus:ring-2 focus:ring-ink-red/20'
              : 'border-blueprint-line focus:border-cyan focus:ring-2 focus:ring-cyan/15'}`}
          {...props}
        />
      </div>
      {hint && !error && <span className="text-xs text-paper-faint">{hint}</span>}
      {error && <span className="text-xs text-ink-red">{error}</span>}
    </div>
  );
}