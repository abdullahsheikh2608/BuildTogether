import { useCallback, useEffect, useRef, useState } from "react";
import { NotificationsContext } from "./notifications-context.js";
import {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "../services/notification.service.js";
import { useAuth } from "../hooks/useAuth.js";

const POLL_INTERVAL_MS = 30000;

export function NotificationsProvider({ children }) {
    const { user } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const pollRef = useRef(null);

    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyNotifications();

            setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err?.response?.data?.message ??
                    "Unable to load notifications."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = useCallback(async (id) => {
        // Optimistic update, no need to wait for the server.
        setNotifications((list) =>
            list.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );

        try {
            await markNotificationAsRead(id);
        } catch {
            // Re-sync with server state on failure.
            loadNotifications();
        }
    }, [loadNotifications]);

    const markAllAsRead = useCallback(async () => {
        setNotifications((list) =>
            list.map((n) => ({ ...n, is_read: true }))
        );

        try {
            await markAllNotificationsAsRead();
        } catch {
            loadNotifications();
        }
    }, [loadNotifications]);

    const removeNotification = useCallback(async (id) => {
        setNotifications((list) => list.filter((n) => n.id !== id));

        try {
            await deleteNotification(id);
        } catch {
            loadNotifications();
        }
    }, [loadNotifications]);

    // Fetch once the user is logged in, then poll periodically so the bell
    // stays fresh without needing a full page refresh.
    useEffect(() => {
        if (!user) {
            setNotifications([]);
            return;
        }

        loadNotifications();

        pollRef.current = setInterval(loadNotifications, POLL_INTERVAL_MS);

        return () => {
            if (pollRef.current) {
                clearInterval(pollRef.current);
            }
        };
    }, [user, loadNotifications]);

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                error,
                loadNotifications,
                markAsRead,
                markAllAsRead,
                removeNotification,
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
}