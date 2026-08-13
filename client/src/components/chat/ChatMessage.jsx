import { getInitials, formatMessageTime } from "../../utils/avatar.js";

export default function ChatMessage({ message, isOwn, showMeta = true }) {
    const initials = getInitials(message.full_name);
    const time = formatMessageTime(message.created_at);

    return (
        <div
            className={`flex items-end gap-2.5 ${
                isOwn ? "flex-row-reverse" : "flex-row"
            } ${showMeta ? "mt-4" : "mt-0.5"}`}
        >
            {showMeta ? (
                <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white
                        ${isOwn ? "bg-amber-500" : "bg-cyan-600"}`}
                >
                    {initials}
                </div>
            ) : (
                <div className="w-8 flex-shrink-0" aria-hidden="true" />
            )}

            <div className={`flex max-w-[75%] flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
                {showMeta && (
                    <div className={`flex items-center gap-2 px-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                        <span className="text-xs font-medium text-slate-500">
                            {isOwn ? "You" : message.full_name}
                        </span>

                        {time && (
                            <span className="text-[11px] text-slate-400">
                                {time}
                            </span>
                        )}
                    </div>
                )}

                <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words shadow-sm
                        ${
                            isOwn
                                ? "bg-cyan-600 text-white rounded-br-md"
                                : "border border-slate-200 bg-slate-50 text-slate-800 rounded-bl-md"
                        }`}
                >
                    {message.message}
                </div>
            </div>
        </div>
    );
}