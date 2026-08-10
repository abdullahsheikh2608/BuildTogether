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
        return { label: "Completed", badgeClass: "bg-[#DCFCE7] text-ink-green" };
    }

    const hoursRemaining = (new Date(deadline).getTime() - Date.now()) / MS_PER_HOUR;

    if (hoursRemaining < 0) {
        return { label: "Overdue", badgeClass: "bg-[#FEE2E2] text-ink-red" };
    }

    if (hoursRemaining <= 24) {
        return { label: "Due today", badgeClass: "bg-amber-dim text-amber" };
    }

    if (hoursRemaining <= DUE_SOON_WINDOW_HOURS) {
        return { label: "Due soon", badgeClass: "bg-amber-dim text-amber" };
    }

    return { label: "On track", badgeClass: "bg-blueprint-800 text-paper-dim" };
}