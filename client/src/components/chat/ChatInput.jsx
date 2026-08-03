import { useState } from "react";
import { Send } from "lucide-react";

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
        <div className="flex items-end gap-3 border-t border-blueprint-line bg-blueprint-900 p-4">
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
                Send
            </Button>
        </div>
    );
}
