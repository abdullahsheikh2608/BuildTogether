const VARIANTS = {
  primary:
    'bg-cyan text-white border-transparent shadow-sm hover:bg-cyan/90 hover:shadow-md',
  outline:
    'bg-white text-paper border-blueprint-line hover:border-cyan/40 hover:bg-cyan-dim/40 hover:text-cyan',
  ghost:
    'bg-transparent text-paper-dim border-transparent hover:bg-blueprint-800 hover:text-paper',
  danger:
    'bg-ink-red text-white border-transparent shadow-sm hover:bg-ink-red/90',
};

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5
        text-sm font-medium transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none
        cursor-pointer
        ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </Tag>
  );
}