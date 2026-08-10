// One feature row in the register-page visual panel: circular icon
// with a subtle blue glow + title + short description.
export default function FeatureItem({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-auth-blue-bright/20 bg-auth-blue/15 shadow-[0_0_20px_-4px_rgba(59,130,246,0.55)]">
        <Icon size={19} className="text-auth-blue-bright" strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-sm font-semibold text-auth-text">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-auth-text-dim">{description}</p>
      </div>
    </div>
  );
}
