import { getInitials, formatMessageTime } from "../../utils/avatar.js";

export default function ChatMessage({ message, isOwn }) {
    const initials = getInitials(message.full_name);
    const time = formatMessageTime(message.created_at);

    return (
        <div
            className={`flex items-end gap-3 ${
                isOwn ? "flex-row-reverse" : "flex-row"
            }`}
        >
            <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm
                    ${isOwn ? "bg-amber" : "bg-cyan"}`}
            >
                {initials}
            </div>

            <div className={`flex max-w-[75%] flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
                <div className={`flex items-center gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                    <span className="text-xs font-medium text-paper-dim">
                        {isOwn ? "You" : message.full_name}
                    </span>

                    {time && (
                        <span className="text-[11px] text-paper-faint">
                            {time}
                        </span>
                    )}
                </div>

                <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words
                        ${
                            isOwn
                                ? "bg-cyan text-white"
                                : "border border-blueprint-line bg-blueprint-800/60 text-paper"
                        }`}
                >
                    {message.message}
                </div>
            </div>
        </div>
    );
}