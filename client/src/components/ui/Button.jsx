const VARIANTS = {
  primary: "bg-amber text-blueprint-950 hover:bg-cyan border-transparent",
  outline: "bg-transparent text-cyan border-cyan hover:bg-cyan/10",
  ghost: "bg-transparent text-paper-dim border-transparent hover:text-paper hover:bg-white/5",
  danger: "bg-transparent text-ink-red border-ink-red hover:bg-ink-red/10",
};

export default function Button({
  as: Tag = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  return (
    <Tag
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-sm border-2 px-5 py-2.5
        font-mono text-sm font-semibold uppercase tracking-wide transition-colors duration-150
        disabled:cursor-not-allowed disabled:opacity-50
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
