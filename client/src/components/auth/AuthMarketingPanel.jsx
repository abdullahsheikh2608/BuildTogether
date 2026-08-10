import { Users, Lightbulb, Rocket } from 'lucide-react';

import AuthMountainScene from './AuthMountainScene.jsx';
import FeatureItem from './FeatureItem.jsx';

const FEATURES = [
  {
    icon: Users,
    title: 'Find the Right People',
    description: 'Connect with talented developers and visionary founders.',
  },
  {
    icon: Lightbulb,
    title: 'Work on Exciting Ideas',
    description: 'Join innovative projects and turn ideas into real products.',
  },
  {
    icon: Rocket,
    title: 'Build the Future',
    description: 'Create something meaningful together.',
  },
];

// Right-hand visual half of the auth container. Same mountain
// backdrop on both pages; the overlaid content switches between the
// login marketing headline and the register feature list via `variant`.
export default function AuthMarketingPanel({ variant = 'login' }) {
  return (
    <div className="relative hidden overflow-hidden lg:block">
      <AuthMountainScene />

      {/* Readability overlay: dark gradient + a soft blue glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-auth-surface via-auth-surface/50 to-auth-surface/10" />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-auth-blue-bright/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
        <div className="flex-1" />

        {variant === 'login' ? (
          <div className="max-w-md">
            <h2 className="text-[2.1rem] font-bold leading-[1.15] text-auth-text xl:text-[2.5rem]">
              Better Ideas.
              <br />
              Stronger Teams.
              <br />
              <span className="text-auth-blue-bright">Bigger Impact.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-auth-text-dim">
              A modern platform where founders and developers connect, collaborate, and build
              amazing startups together.
            </p>
          </div>
        ) : (
          <div className="flex max-w-md flex-col gap-6">
            {FEATURES.map((feature) => (
              <FeatureItem key={feature.title} {...feature} />
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-end gap-1.5 text-sm font-medium text-auth-text-dim">
          <span>Together we build.</span>
          <Rocket size={14} className="text-auth-blue-bright" />
        </div>
      </div>
    </div>
  );
}
