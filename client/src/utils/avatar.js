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
