import { useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";

import ChatMessage from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";
import EmptyState from "../ui/EmptyState.jsx";

import { useChat } from "../../hooks/useChat.js";
import { useSocket } from "../../context/SocketContext.jsx";
import { useAuth } from "../../hooks/useAuth.js";

export default function ChatBox({ startupId }) {
    const { user } = useAuth();
    const socket = useSocket();

    const {
        messages,
        loading,
        sending,
        error,
        loadMessages,
        sendChatMessage,
        appendMessage,
    } = useChat();

    const scrollAnchorRef = useRef(null);

    // Load history and join the startup's room whenever the workspace changes.
    useEffect(() => {
        if (!startupId) return;

        loadMessages(startupId);
        socket.emit("join_startup", startupId);
    }, [startupId, loadMessages, socket]);

    // Listen for new messages in real time, cleaning up on unmount so we
    // never accumulate duplicate listeners across re-renders.
    useEffect(() => {
        const handleReceiveMessage = (message) => {
            appendMessage(message);
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [socket, appendMessage]);

    // Keep the latest message in view.
    useEffect(() => {
        scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (text) => {
        await sendChatMessage(startupId, text);
    };

    return (
        <div className="blueprint-card flex h-[32rem] flex-col overflow-hidden rounded-xl">
            <div className="border-b border-blueprint-line p-6 pb-4">
                <h2 className="font-display text-xl font-semibold text-paper">
                    Team Chat
                </h2>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
                {loading ? (
                    <p className="text-paper-dim">Loading messages...</p>
                ) : error ? (
                    <p className="text-ink-red">{error}</p>
                ) : messages.length === 0 ? (
                    <EmptyState
                        title="No messages yet"
                        body="Start the conversation with your team."
                        action={
                            <MessageSquare
                                size={28}
                                className="text-paper-faint"
                            />
                        }
                    />
                ) : (
                    messages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                            isOwn={String(message.sender_id) === String(user?.id)}
                        />
                    ))
                )}

                <div ref={scrollAnchorRef} />
            </div>

            <ChatInput onSend={handleSend} disabled={sending} />
        </div>
    );
}