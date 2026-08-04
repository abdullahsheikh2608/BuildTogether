import { useEffect, useRef, useState } from 'react';
import { Bell, Check, Trash2, CheckCheck, X } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications.js';

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);

  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(dateString).toLocaleDateString();
}

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setSelectedNotification(null);
      }
    }
    if (selectedNotification) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedNotification]);

  function handleItemClick(notification) {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-12 w-12 items-center justify-center rounded-full border border-blueprint-line bg-blueprint-800/80 text-paper transition hover:border-cyan hover:text-cyan focus:outline-none cursor-pointer"
        aria-label="Notifications"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-blueprint-line bg-blueprint-900 shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-blueprint-line px-5 py-4">
            <h3 className="font-semibold text-paper">Notifications</h3>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 text-xs font-medium text-cyan transition hover:text-cyan/80 cursor-pointer"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-paper-dim">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleItemClick(notification)}
                  className={`group flex cursor-pointer items-start gap-3 border-b border-blueprint-line/60 px-5 py-3.5 transition hover:bg-slate-800 ${
                    notification.is_read ? '' : 'bg-cyan/5'
                  }`}
                >
                  {!notification.is_read && (
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-cyan" />
                  )}

                  <div className={`min-w-0 flex-1 ${notification.is_read ? 'ml-5' : ''}`}>
                    <p className="text-sm font-medium text-paper">
                      {notification.title}
                    </p>
                    <p className="mt-0.5 text-sm text-paper-dim line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-paper-dim/70">
                      {timeAgo(notification.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
                    {!notification.is_read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="rounded-md p-1.5 text-paper-dim transition hover:bg-blueprint-700 hover:text-cyan cursor-pointer"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="rounded-md p-1.5 text-paper-dim transition hover:bg-blueprint-700 hover:text-red-400 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {selectedNotification && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-xl border border-blueprint-line bg-blueprint-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-blueprint-line px-5 py-4">
              <h3 className="font-semibold text-paper">
                {selectedNotification.title}
              </h3>

              <button
                onClick={() => setSelectedNotification(null)}
                className="flex-shrink-0 rounded-md p-1 text-paper-dim transition hover:bg-blueprint-700 hover:text-cyan cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
              <p className="whitespace-pre-wrap text-sm text-paper-dim">
                {selectedNotification.message}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-blueprint-line px-5 py-3">
              <p className="text-xs text-paper-dim/70">
                {timeAgo(selectedNotification.created_at)}
              </p>

              <button
                onClick={() => {
                  removeNotification(selectedNotification.id);
                  setSelectedNotification(null);
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-paper-dim transition hover:text-red-400 cursor-pointer"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}