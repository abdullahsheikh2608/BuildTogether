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
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-md
                    ${isOwn ? "bg-amber text-blueprint-950" : "bg-cyan text-blueprint-950"}`}
            >
                {initials}
            </div>

            <div className={`flex max-w-[75%] flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
                <div className={`flex items-center gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                    <span className="font-mono text-xs font-semibold text-paper-dim">
                        {isOwn ? "You" : message.full_name}
                    </span>

                    {time && (
                        <span className="font-mono text-[11px] text-paper-faint">
                            {time}
                        </span>
                    )}
                </div>

                <div
                    className={`rounded-lg border px-4 py-2.5 text-sm leading-relaxed break-words
                        ${
                            isOwn
                                ? "border-amber-dim/40 bg-amber/10 text-paper"
                                : "border-blueprint-line bg-blueprint-800/60 text-paper"
                        }`}
                >
                    {message.message}
                </div>
            </div>
        </div>
    );
}
