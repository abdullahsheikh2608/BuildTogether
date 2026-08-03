const MS_PER_HOUR = 1000 * 60 * 60;
const DUE_SOON_WINDOW_HOURS = 48;

// Returns a small { label, badgeClass } pair describing how urgent a task's
// deadline is, so the same styling logic can be reused across TaskCard,
// UpcomingDeadlines, and anywhere else a deadline needs to be shown.
export function getDeadlineStatus(deadline, status) {
    if (!deadline) {
        return { label: "No deadline", badgeClass: "bg-blueprint-800 text-paper-dim" };
    }

    if (status === "done") {
        return { label: "Completed", badgeClass: "bg-emerald-500/20 text-emerald-300" };
    }

    const hoursRemaining = (new Date(deadline).getTime() - Date.now()) / MS_PER_HOUR;

    if (hoursRemaining < 0) {
        return { label: "Overdue", badgeClass: "bg-red-500/20 text-red-300" };
    }

    if (hoursRemaining <= 24) {
        return { label: "Due today", badgeClass: "bg-amber-500/20 text-amber-300" };
    }

    if (hoursRemaining <= DUE_SOON_WINDOW_HOURS) {
        return { label: "Due soon", badgeClass: "bg-amber-500/20 text-amber-300" };
    }

    return { label: "On track", badgeClass: "bg-blueprint-800 text-paper-dim" };
}