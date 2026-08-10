import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import LogoutModal from '../common/LogoutModal.jsx';
import NotificationBell from './NotificationBell.jsx';

import { User, LogOut } from 'lucide-react';

export default function Topbar() {
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
      <header className="sticky top-0 z-20 flex h-20 flex-shrink-0 items-center justify-end gap-4 border-b border-blueprint-line bg-white/80 px-8 backdrop-blur-md">
        <div className="flex flex-shrink-0 items-center gap-4">
          <NotificationBell />

          <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="group flex items-center rounded-full transition focus:outline-none"
            aria-label="User Menu"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan text-sm font-semibold text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              {initials}
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-xl border border-blueprint-line bg-white shadow-[var(--shadow-popover)] z-50">
              <div className="border-b border-blueprint-line px-5 py-4">
                <h3 className="font-semibold text-paper">{user?.full_name || 'User'}</h3>
                <p className="mt-1 text-sm text-paper-dim">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  navigate('/profile');
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-5 py-3 text-sm text-paper transition-colors duration-200 hover:bg-blueprint-800"
              >
                <User size={18} />
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  setShowLogout(true);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-5 py-3 text-sm text-ink-red transition-colors duration-200 hover:bg-ink-red/5"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
          </div>
        </div>
      </header>

      <LogoutModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}