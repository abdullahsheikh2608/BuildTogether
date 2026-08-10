// Left-hand form column shared by Login and Register: small eyebrow
// label, heading (caller supplies JSX so the trailing period can be
// styled blue), subtitle, then the page's own form as children.
export default function AuthCard({ eyebrow, title, subtitle, children }) {
  return (
    <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
      <div className="mx-auto w-full max-w-[400px]">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-[0.14em] text-auth-text-muted">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-[1.9rem] font-bold leading-tight text-auth-text sm:text-[2.1rem]">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-auth-text-dim">{subtitle}</p>}

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
