export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-sm border border-blueprint-line md:grid-cols-[1fr_1.1fr]">
        {/* Hero panel */}
        <div className="hidden flex-col justify-between bg-blueprint-900 p-10 md:flex">
          <div>
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M2 10L10 2L18 10L10 18L2 10Z"
                  stroke="var(--color-cyan)"
                  strokeWidth="1.5"
                />
                <circle cx="10" cy="10" r="2" fill="var(--color-amber)" />
              </svg>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-paper-dim">
                BuildTogether
              </span>
            </div>

            <h1 className="mt-10 font-display text-3xl font-semibold leading-tight text-paper">
              Founders draft the plan.
              <br />
              Developers build it.
            </h1>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper-dim">
              One blueprint, two crews. Post a startup, review applications,
              or find the build you want to join.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-4 border-t border-blueprint-line pt-6">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-paper-faint">
                Role · A
              </dt>
              <dd className="mt-1 font-mono text-sm text-amber">Founder</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-paper-faint">
                Role · B
              </dt>
              <dd className="mt-1 font-mono text-sm text-cyan">Developer</dd>
            </div>
          </dl>
        </div>

        {/* Form panel */}
        <div className="blueprint-card animate-draft-in flex flex-col justify-center px-6 py-10 sm:px-10">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan">
            {eyebrow}
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-paper">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1.5 text-sm text-paper-dim">{subtitle}</p>
          )}

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
