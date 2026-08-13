// Builds a 1-2 letter initials string from a full name, e.g. "Ada Lovelace" -> "AL".
// Falls back to "U" (Unknown) when no name is available.
export function getInitials(fullName) {
    if (!fullName) return "U";

    return fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

// Formats a timestamp for chat messages, e.g. "10:42 AM".
export function formatMessageTime(timestamp) {
    if (!timestamp) return "";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
}

// Formats a timestamp for chat date separators, e.g. "Today", "Yesterday",
// or "March 4, 2026" for anything older.
export function formatDateSeparator(timestamp) {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";

    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const target = startOfDay(date);
    const today = startOfDay(new Date());
    const diffDays = Math.round((today - target) / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";

    return date.toLocaleDateString([], {
        month: "long",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
}

// Two messages belong to the same visual "group" (avatar/name shown once)
// when they're from the same sender and sent within 5 minutes of each other.
export function isSameMessageGroup(a, b) {
    if (!a || !b) return false;
    if (String(a.sender_id) !== String(b.sender_id)) return false;

    const gapMs = Math.abs(new Date(b.created_at) - new Date(a.created_at));
    return gapMs < 5 * 60 * 1000;
}