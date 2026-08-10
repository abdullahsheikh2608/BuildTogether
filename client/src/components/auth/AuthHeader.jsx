import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

// Minimal top nav inside the auth container: brand mark on the left,
// two links on the right. "Home" points at "/" (the app's existing
// entry route) and "Join" points at the existing Register route —
// no new routes are introduced.
export default function AuthHeader() {
  return (
    <div className="flex items-center justify-between border-b border-auth-border px-6 py-5 sm:px-10">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-auth-blue">
          <Layers size={16} className="text-white" />
        </div>
        <span className="text-[15px] font-bold text-auth-text">BuildTogether</span>
      </Link>

      <nav className="flex items-center gap-6">
        <Link to="/" className="text-sm text-auth-text-dim transition-colors hover:text-auth-text">
          Home
        </Link>
        <Link to="/register" className="text-sm text-auth-text-dim transition-colors hover:text-auth-text">
          Join
        </Link>
      </nav>
    </div>
  );
}
