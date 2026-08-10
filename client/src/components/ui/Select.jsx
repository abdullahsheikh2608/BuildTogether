export default function Select({
  label,
  id,
  options = [],
  children,
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-paper">
          {label}
        </label>
      )}

      <select
        id={id}
        className="rounded-lg border border-blueprint-line bg-white px-3.5 py-2.5
          text-sm text-paper outline-none transition-all duration-200
          focus:border-cyan focus:ring-2 focus:ring-cyan/15"
        {...props}
      >
        {children
          ? children
          : options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
      </select>
    </div>
  );
}