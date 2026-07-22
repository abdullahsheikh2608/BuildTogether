import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import LogoutModal from '../common/LogoutModal.jsx';

import { User, LogOut, ChevronDown } from 'lucide-react';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

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
      <header className="flex h-20 items-center justify-end border-b border-blueprint-line bg-blueprint-900 px-8">
        <div className="relative">
          {/* Avatar Button */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="group flex items-center gap-2 rounded-full transition"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan text-lg font-bold text-black shadow-md transition group-hover:scale-105">
              {initials}
            </div>

            <ChevronDown
              size={18}
              className={`text-paper-dim transition ${menuOpen ? 'rotate-180' : ''}`}
            />
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
