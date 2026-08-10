import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { LayoutDashboard, Rocket, FileText, User, LogOut, PanelLeftClose, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import LogoutModal from '../common/LogoutModal.jsx';

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, logout } = useAuth();

  const developerLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Startup', path: '/dashboard/startups', icon: Rocket },
    { name: 'My Applications', path: '/dashboard/applications', icon: FileText },
  ];

  const founderLinks = [
    { name: 'Dashboard', path: '/founder', icon: LayoutDashboard },
    { name: 'Startups', path: '/founder/startups', icon: Rocket },
    { name: 'Analytics', path: '/founder/analytics', icon: BarChart3 },
  ];

  const links = user?.role === 'founder' ? founderLinks : developerLinks;

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-shrink-0 flex-col border-r border-blueprint-line bg-white z-30 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-0 border-r-0 opacity-0 overflow-hidden pointer-events-none' : 'w-72 opacity-100'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cyan text-sm font-bold text-white">
              B
            </div>
            <h1 className="font-display text-lg font-bold text-paper truncate">BuildTogether</h1>
          </div>
        </div>

        {onToggle && (
          <button
            onClick={onToggle}
            className="flex-shrink-0 rounded-lg p-2 text-paper-faint transition-colors duration-200 hover:bg-blueprint-800 hover:text-paper focus:outline-none cursor-pointer"
            title="Hide Sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex flex-col gap-1 px-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/dashboard' || link.path === '/founder'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-cyan-dim text-cyan font-semibold'
                    : 'text-paper-dim hover:bg-blueprint-800 hover:text-paper'
                }`
              }
            >
              <Icon size={19} strokeWidth={2} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-blueprint-line p-4">
        <button
          onClick={() => navigate('/profile')}
          className="mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-paper-dim transition-colors duration-200 hover:bg-blueprint-800 hover:text-paper cursor-pointer"
        >
          <User size={19} />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-ink-red transition-colors duration-200 hover:bg-ink-red/5 cursor-pointer"
        >
          <LogOut size={19} />
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