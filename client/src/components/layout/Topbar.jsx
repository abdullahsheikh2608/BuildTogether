import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import LogoutModal from '../common/LogoutModal.jsx';

import { User, LogOut, PanelLeftOpen, PanelLeftClose, Menu } from 'lucide-react';

export default function Topbar({ collapsed, onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
    : 'U';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <header className="sticky top-0 z-20 flex h-20 flex-shrink-0 items-center justify-between border-b border-blueprint-line bg-blueprint-900 px-8">
        {/* Toggle Sidebar Button */}
        <button
          onClick={onToggleSidebar}
          className="flex items-center gap-2 rounded-lg border border-blueprint-line bg-blueprint-800/80 px-3.5 py-2 text-sm font-medium text-paper transition hover:border-cyan hover:bg-blueprint-800 hover:text-cyan focus:outline-none shadow-sm cursor-pointer"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <Menu size={20} className="text-cyan" /> : <PanelLeftClose size={20} className="text-cyan" />}
          <span>{collapsed ? 'Show Menu' : 'Hide Menu'}</span>
        </button>
        <div className="relative" ref={menuRef}>
          {/* Avatar Button */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="group flex items-center rounded-full transition focus:outline-none"
            aria-label="User Menu"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan text-lg font-bold text-black shadow-md transition group-hover:scale-105">
              {initials}
            </div>
          </button>

          {/* Dropdown Menu */}

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-xl border border-blueprint-line bg-blueprint-900 shadow-2xl z-50">
              {/* User Info */}

              <div className="border-b border-blueprint-line px-5 py-4">
                <h3 className="font-semibold text-paper">{user?.full_name || 'User'}</h3>

                <p className="mt-1 text-sm text-paper-dim">{user?.email}</p>
              </div>

              {/* Profile */}

              <button
                onClick={() => {
                  navigate('/profile');
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-5 py-3 text-paper transition hover:bg-slate-800"
              >
                <User size={18} />

                <span>Profile</span>
              </button>

              {/* Logout */}

              <button
                onClick={() => {
                  setShowLogout(true);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-5 py-3 text-red-400 transition hover:bg-slate-800"
              >
                <LogOut size={18} />

                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}

      <LogoutModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
