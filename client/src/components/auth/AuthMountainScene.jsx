// Self-contained decorative backdrop for the auth visual panel — a
// layered mountain/forest silhouette rendered entirely in SVG. Kept
// local rather than pulling in an external stock photo, per the
// "local placeholder asset" guidance: no network dependency, nothing
// to attribute, and it scales losslessly at any panel size.
export default function AuthMountainScene() {
  return (
    <svg
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="auth-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="55%" stopColor="#15202F" />
          <stop offset="100%" stopColor="#0B1220" />
        </linearGradient>
        <linearGradient id="auth-ridge-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A3A52" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
      </defs>

      <rect width="800" height="1000" fill="url(#auth-sky)" />

      {/* Back ridge */}
      <path
        d="M0 460 L90 380 L180 430 L260 340 L340 410 L430 300 L520 390 L610 320 L700 400 L800 350 L800 1000 L0 1000 Z"
        fill="url(#auth-ridge-back)"
        opacity="0.55"
      />

      {/* Mid ridge */}
      <path
        d="M0 560 L110 470 L210 530 L300 440 L390 520 L480 420 L580 510 L680 440 L800 500 L800 1000 L0 1000 Z"
        fill="#182437"
        opacity="0.8"
      />

      {/* Winding path across the mountains */}
      <path
        d="M60 1000 C 140 780, 40 620, 140 480 C 220 370, 120 260, 210 130"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="2"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />

      {/* Front ridge */}
      <path
        d="M0 660 L100 610 L220 660 L330 590 L440 650 L560 580 L660 640 L800 600 L800 1000 L0 1000 Z"
        fill="#111B2C"
      />

      {/* Foreground pine treeline, bottom-right */}
      <g fill="#0B1526">
        {[
          [560, 760, 46], [610, 800, 60], [650, 740, 40], [700, 810, 70],
          [740, 750, 44], [780, 800, 56], [600, 860, 64], [660, 880, 50],
          [720, 860, 58], [770, 900, 66],
        ].map(([x, y, h], i) => (
          <polygon key={i} points={`${x},${y - h} ${x - h * 0.42},${y} ${x + h * 0.42},${y}`} />
        ))}
      </g>
    </svg>
  );
}
