import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
  // Drives the slide-in transition: the drawer mounts off-screen
  // (translate-x-full) and flips to translate-x-0 one frame later, so the
  // panel animates in from the right instead of just appearing.
  const [visible, setVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  function closeDrawer() {
    setVisible(false);
    // Wait for the slide-out transition to finish before unmounting.
    setTimeout(() => setOpen(false), 200);
  }

  // Lock background scroll whenever either overlay is open
  useEffect(() => {
    if (!open && !selectedNotification) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open, selectedNotification]);

  // Escape closes whichever overlay is open (detail view takes priority)
  useEffect(() => {
    function handleEscape(event) {
      if (event.key !== 'Escape') return;
      if (selectedNotification) {
        setSelectedNotification(null);
      } else if (open) {
        closeDrawer();
      }
    }
    if (open || selectedNotification) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, selectedNotification]);

  function handleItemClick(notification) {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-12 w-12 items-center justify-center rounded-full border border-blueprint-line bg-blueprint-800/80 text-paper transition hover:border-cyan hover:text-cyan focus:outline-none cursor-pointer"
        aria-label="Notifications"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink-red px-1 text-[11px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && createPortal(
        <div
          className={`fixed inset-0 z-[100] bg-paper/60 backdrop-blur-sm transition-opacity duration-200 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeDrawer}
        >
          <div
            className={`absolute inset-y-0 right-0 flex h-full w-full max-w-md flex-col border-l border-blueprint-line bg-blueprint-900 shadow-2xl transition-transform duration-200 ease-out ${
              visible ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-blueprint-line px-5 py-4">
              <h3 className="font-semibold text-paper">Notifications</h3>

              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1.5 text-xs font-medium text-cyan transition hover:text-cyan/80 cursor-pointer"
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                )}

                <button
                  onClick={closeDrawer}
                  className="flex-shrink-0 rounded-md p-1 text-paper-dim transition hover:bg-blueprint-700 hover:text-cyan cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-paper-dim">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleItemClick(notification)}
                    className={`group flex cursor-pointer items-start gap-3 border-b border-blueprint-line/60 px-5 py-3.5 transition hover:bg-blueprint-800 ${
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
                        className="rounded-md p-1.5 text-paper-dim transition hover:bg-blueprint-700 hover:text-ink-red cursor-pointer"
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
        </div>,
        document.body
      )}

      {selectedNotification && createPortal(
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-paper/60 px-4"
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
                className="flex items-center gap-1.5 text-xs font-medium text-paper-dim transition hover:text-ink-red cursor-pointer"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}