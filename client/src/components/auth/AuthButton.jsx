const VARIANTS = {
  primary:
    'bg-auth-blue text-white shadow-[0_8px_20px_-6px_rgba(33,150,243,0.6)] hover:bg-auth-blue-bright hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-6px_rgba(59,130,246,0.7)]',
  secondary:
    'bg-auth-surface-2 text-auth-text border border-auth-border hover:bg-white/[0.08]',
};

// Primary/secondary button pair used for the "Use another method" +
// submit row on both Login and Register. Kept separate from
// components/ui/Button.jsx (used across the rest of the app) so this
// redesign is fully scoped to the auth pages.
export default function AuthButton({
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px]
        text-sm font-semibold transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none
        ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
