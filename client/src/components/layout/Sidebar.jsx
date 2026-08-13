import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import {
  LayoutDashboard,
  Rocket,
  FileText,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  BarChart3,
  Briefcase,
  Box,
  MessageSquare,
  Users,
  ListChecks,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import LogoutModal from '../common/LogoutModal.jsx';

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, logout } = useAuth();

  const developerLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Projects', path: '/dashboard/projects', icon: Briefcase },
    { name: 'My Applications', path: '/dashboard/applications', icon: FileText },
    { name: 'My Tasks', path: '/dashboard/tasks', icon: ListChecks },
    { name: 'Team Chat', path: '/dashboard/chat', icon: MessageSquare },
    { name: 'Workspace', path: '/dashboard/workspace', icon: Briefcase },
    { name: 'AI Assistant', path: '/dashboard/ai', icon: Sparkles },
  ];

  const founderLinks = [
    { name: 'Dashboard', path: '/founder', icon: LayoutDashboard },
    { name: 'My Startups', path: '/founder/startups', icon: Rocket },
    { name: 'Applications', path: '/founder/applications', icon: FileText },
    { name: 'Team', path: '/founder/team-members', icon: Users },
    { name: 'Tasks', path: '/founder/tasks', icon: ListChecks },
    { name: 'Chat', path: '/founder/chat', icon: MessageSquare },
    { name: 'Workspace', path: '/founder/workspace', icon: Briefcase },
    { name: 'AI Assistant', path: '/founder/ai-assistant', icon: Sparkles },
    { name: 'Analytics', path: '/founder/analytics', icon: BarChart3 },
  ];

  const isDeveloper = user?.role !== 'founder';
  const links = isDeveloper ? developerLinks : founderLinks;

  const renderLinks = (linksArray) =>
    linksArray.map((link) => {
      const Icon = link.icon;

      return (
        <NavLink
          key={link.path}
          to={link.path}
          end={link.path === '/dashboard' || link.path === '/founder'}
          title={collapsed ? link.name : undefined}
          className={({ isActive }) =>
            `flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
              collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3.5 py-2.5'
            } ${
              isActive
                ? 'bg-sidebar-active text-white shadow-sm'
                : 'text-sidebar-text-dim hover:bg-sidebar-hover hover:text-sidebar-text'
            }`
          }
        >
          <Icon size={18} strokeWidth={2} />
          {!collapsed && <span>{link.name}</span>}
        </NavLink>
      );
    });

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-shrink-0 flex-col bg-sidebar z-30 transition-all duration-300 ease-in-out overflow-hidden ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div
        className={`flex items-center border-b border-sidebar-line py-5 ${
          collapsed ? 'flex-col gap-3 px-2' : 'justify-between px-6'
        }`}
      >
        <div className={`flex min-w-0 items-center gap-2.5 ${collapsed ? 'flex-1' : 'flex-1'}`}>
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-sidebar-active text-white shadow-sm">
            <Box size={18} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-display text-base font-bold text-sidebar-text truncate">BuildTogether</h1>
              <p className="text-xs text-sidebar-text-dim truncate">Connect. Build. Grow.</p>
            </div>
          )}
        </div>

        {onToggle && (
          <button
            onClick={onToggle}
            className="flex-shrink-0 rounded-lg p-2 text-sidebar-text-dim transition-all duration-200 hover:bg-sidebar-hover hover:text-sidebar-text focus:outline-none cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        )}
      </div>

      <nav className={`mt-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden ${collapsed ? 'px-2' : 'px-4'}`}>
        {renderLinks(links)}
      </nav>

      <div className={`mt-auto border-t border-sidebar-line p-4 ${collapsed ? 'px-2' : ''}`}>
        <button
          onClick={() => setShowLogoutModal(true)}
          title={collapsed ? 'Logout' : undefined}
          className={`flex w-full items-center rounded-xl text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10 cursor-pointer ${
            collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3.5 py-2.5'
          }`}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
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