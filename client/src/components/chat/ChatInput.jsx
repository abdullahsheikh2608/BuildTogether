import { useRef, useState } from "react";
import { Send, Paperclip, Smile } from "lucide-react";

import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import EmojiPicker from "./EmojiPicker.jsx";

export default function ChatInput({ onSend, disabled }) {
    const [text, setText] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const inputRef = useRef(null);

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

    const handleEmojiSelect = (emoji) => {
        setText((prev) => prev + emoji);
        setShowEmojiPicker(false);
        inputRef.current?.focus();
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

            <div className="relative hidden shrink-0 sm:block">
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    title="Insert emoji"
                    aria-label="Insert emoji"
                    aria-expanded={showEmojiPicker}
                    className="rounded-lg p-2.5 text-paper-faint transition-colors duration-200 hover:bg-blueprint-800 hover:text-paper"
                >
                    <Smile size={17} />
                </button>
                {showEmojiPicker && (
                    <EmojiPicker
                        onSelect={handleEmojiSelect}
                        onClose={() => setShowEmojiPicker(false)}
                    />
                )}
            </div>

            <Input
                ref={inputRef}
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