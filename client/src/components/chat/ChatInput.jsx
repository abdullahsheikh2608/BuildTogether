import { useState } from "react";
import { Send, Paperclip, Smile } from "lucide-react";

import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";

export default function ChatInput({ onSend, disabled }) {
    const [text, setText] = useState("");

    const trimmed = text.trim();

    const handleSend = async () => {
        if (!trimmed || disabled) return;

        // Clear immediately for a snappy feel; restore on failure so the
        // person doesn't lose what they typed.
        setText("");

        try {
            await onSend(trimmed);
        } catch {
            setText(trimmed);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex items-end gap-2 border-t border-blueprint-line bg-blueprint-900 p-4">
            <button
                type="button"
                disabled
                title="Attachments coming soon"
                aria-disabled="true"
                className="hidden shrink-0 cursor-not-allowed rounded-lg p-2.5 text-paper-faint transition-colors duration-200 hover:bg-blueprint-800 sm:flex"
            >
                <Paperclip size={17} />
            </button>

            <button
                type="button"
                disabled
                title="Emoji coming soon"
                aria-disabled="true"
                className="hidden shrink-0 cursor-not-allowed rounded-lg p-2.5 text-paper-faint transition-colors duration-200 hover:bg-blueprint-800 sm:flex"
            >
                <Smile size={17} />
            </button>

            <Input
                className="flex-1"
                placeholder="Type a message..."
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                aria-label="Chat message"
            />

            <Button
                onClick={handleSend}
                disabled={!trimmed || disabled}
                className="shrink-0"
            >
                <Send size={16} />
                <span className="hidden sm:inline">Send</span>
            </Button>
        </div>
    );
}
