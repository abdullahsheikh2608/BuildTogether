import AuthHeader from '../components/auth/AuthHeader.jsx';
import AuthCard from '../components/auth/AuthCard.jsx';
import AuthMarketingPanel from '../components/auth/AuthMarketingPanel.jsx';

// Shared shell for Login and Register: a single rounded dark container
// (header + two-column body) centered on a full-page dark background —
// not a full-height split screen. `visualVariant` picks which content
// renders in the right-hand panel; everything else is passed straight
// through to AuthCard/children.
export default function AuthLayout({ eyebrow, title, subtitle, visualVariant = 'login', children }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-auth-bg px-4 py-8 sm:px-6 sm:py-12">
      <div
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-auth-blue/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-auth-blue-bright/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex w-full max-w-[1320px] flex-col overflow-hidden rounded-[24px] border border-auth-border bg-auth-surface shadow-[0_24px_70px_-12px_rgba(0,0,0,0.6)] lg:min-h-[700px]">
        <AuthHeader />

        <div className="grid flex-1 lg:grid-cols-2">
          <AuthCard eyebrow={eyebrow} title={title} subtitle={subtitle}>
            {children}
          </AuthCard>

          <AuthMarketingPanel variant={visualVariant} />
        </div>
      </div>
    </div>
  );
}
