import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { LayoutDashboard, Rocket, FileText, User, LogOut, PanelLeftClose, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import LogoutModal from '../ui/LogoutModal.jsx';

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, logout } = useAuth();

  const developerLinks = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Startup',
      path: '/dashboard/startups',
      icon: Rocket,
    },
    {
      name: 'My Applications',
      path: '/dashboard/applications',
      icon: FileText,
    },
  ];

  const founderLinks = [
    {
      name: 'Dashboard',
      path: '/founder',
      icon: LayoutDashboard,
    },
    {
      name: 'Analytics',
      path: '/founder/analytics',
      icon: BarChart3,
    },
  ];

  const links = user?.role === 'founder' ? founderLinks : developerLinks;

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-shrink-0 flex-col border-r border-blueprint-line bg-blueprint-900 z-30 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-0 border-r-0 opacity-0 overflow-hidden pointer-events-none' : 'w-72 opacity-100'
      }`}
    >
      {/* Logo */}

      <div className="flex items-center justify-between border-b border-blueprint-line px-6 py-5">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-bold text-paper truncate">BuildTogether</h1>

          <p className="mt-0.5 text-xs text-paper-dim truncate">Startup Collaboration</p>
        </div>

        {onToggle && (
          <button
            onClick={onToggle}
            className="flex-shrink-0 rounded-lg border border-blueprint-line bg-blueprint-800/60 p-2 text-paper-dim transition hover:border-cyan hover:text-cyan focus:outline-none cursor-pointer"
            title="Hide Sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}

      <nav className="mt-6 flex flex-col gap-2 px-4">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/dashboard' || link.path === '/founder'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive
                    ? 'bg-cyan text-black font-semibold'
                    : 'text-paper hover:bg-blueprint-800'
                }`
              }
            >
              <Icon size={20} strokeWidth={2} />

              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-blueprint-line p-4">
        <button
          onClick={() => navigate('/profile')}
          className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-paper transition hover:bg-blueprint-800"
        >
          <User size={20} />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          logout();
          setShowLogoutModal(false);
          navigate('/login');
        }}
      />
    </aside>
  );
}