// Dark-themed text input used only on the auth pages. Kept separate
// from components/ui/Input.jsx (which many other pages depend on) so
// this redesign can't affect any light-themed screen elsewhere.
export default function AuthInput({ label, id, hint, error, icon: Icon, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-auth-text-dim">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-auth-text-muted"
          />
        )}
        <input
          id={id}
          className={`h-[52px] w-full rounded-[14px] border bg-auth-input text-sm text-auth-text
            placeholder:text-auth-text-muted outline-none transition-all duration-200
            ${Icon ? 'pl-11 pr-4' : 'px-4'}
            ${error
              ? 'border-red-500/60 focus:ring-2 focus:ring-red-500/20'
              : 'border-auth-border focus:border-auth-blue-bright focus:ring-2 focus:ring-auth-blue-bright/20'}`}
          {...props}
        />
      </div>
      {hint && !error && <span className="text-xs text-auth-text-muted">{hint}</span>}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
