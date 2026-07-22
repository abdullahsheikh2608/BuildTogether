import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../ui/Button.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const roleColor = user?.role === 'founder' ? 'text-amber' : 'text-cyan';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const dashboardPath = user?.role === 'founder' ? '/founder' : '/dashboard';

  return (
    <header className="border-b border-blueprint-line bg-blueprint-900/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}

        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 10L10 2L18 10L10 18L2 10Z" stroke="var(--color-cyan)" strokeWidth="1.5" />

            <circle cx="10" cy="10" r="2" fill="var(--color-amber)" />
          </svg>

          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-paper-dim">
            BuildTogether
          </span>
        </div>

        {/* Navigation */}

        <div className="flex items-center gap-6">
          <NavLink
            to={dashboardPath}
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-cyan' : 'text-paper-dim hover:text-paper'}`
            }
          >
            Dashboard
          </NavLink>

          {user?.role === 'developer' && (
            <>
              <NavLink
                to="/dashboard/startups"
                className={({ isActive }) =>
                  `text-sm font-medium ${
                    isActive ? 'text-cyan' : 'text-paper-dim hover:text-paper'
                  }`
                }
              >
                Browse Startups
              </NavLink>

              <NavLink
                to="/dashboard/applications"
                className={({ isActive }) =>
                  `text-sm font-medium ${
                    isActive ? 'text-cyan' : 'text-paper-dim hover:text-paper'
                  }`
                }
              >
                My Applications
              </NavLink>
            </>
          )}

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-cyan' : 'text-paper-dim hover:text-paper'}`
            }
          >
            Profile
          </NavLink>
        </div>

        {/* User */}

        <div className="flex items-center gap-4">
          <div className="text-right">
            <h3 className="text-sm font-semibold text-paper">{user?.full_name}</h3>

            <p className={`text-xs uppercase ${roleColor}`}>{user?.role}</p>
          </div>

          <Button variant="ghost" className="px-3 py-1.5" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
