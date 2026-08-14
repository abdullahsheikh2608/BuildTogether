import { useEffect, useRef, useState } from "react";

// A curated set of commonly used emojis, grouped loosely by category.
// Kept as a static list (no external package) to avoid adding a new
// dependency / build risk.
const EMOJIS = [
    "😀", "😁", "😂", "🤣", "😊", "😍", "😘", "😎", "🤔", "🙄",
    "😴", "😢", "😭", "😡", "🥳", "😱", "🤯", "🥺", "😇", "🤗",
    "👍", "👎", "👏", "🙌", "🙏", "💪", "🤝", "✌️", "👌", "🤞",
    "❤️", "🔥", "🎉", "✅", "⭐", "🚀", "💡", "📌", "⚡", "💯",
];

export default function EmojiPicker({ onSelect, onClose }) {
    const popoverRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                onClose();
            }
        };
        const handleEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    return (
        <div
            ref={popoverRef}
            role="dialog"
            aria-label="Emoji picker"
            className="absolute bottom-full left-0 z-20 mb-2 w-64 rounded-lg border border-blueprint-line bg-blueprint-900 p-3 shadow-lg"
        >
            <div className="grid grid-cols-8 gap-1">
                {EMOJIS.map((emoji) => (
                    <button
                        key={emoji}
                        type="button"
                        onClick={() => onSelect(emoji)}
                        className="flex items-center justify-center rounded-md p-1.5 text-lg transition-colors duration-150 hover:bg-blueprint-800"
                        aria-label={`Insert ${emoji}`}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
}