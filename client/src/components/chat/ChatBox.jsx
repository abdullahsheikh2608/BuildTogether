import { useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";

import ChatMessage from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import Skeleton from "../ui/Skeleton.jsx";

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
        setMessages,
    } = useChat();

    const scrollAnchorRef = useRef(null);

    // Load history and join the startup's room whenever the workspace changes.
    // Leaving the previous room on cleanup is what stops messages from one
    // project bleeding into another when you switch between workspaces.
    useEffect(() => {
        if (!startupId) return;

        setMessages([]);
        loadMessages(startupId);
        socket.emit("join_startup", startupId);

        return () => {
            socket.emit("leave_startup", startupId);
        };
    }, [startupId, loadMessages, setMessages, socket]);

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

    // Auto-scroll removed: navigation and routing now control page views.

    const handleSend = async (text) => {
        await sendChatMessage(startupId, text);
    };

    return (
        <div className="blueprint-card flex h-[32rem] flex-col overflow-hidden">
            <div className="border-b border-blueprint-line p-6 pb-4">
                <h2 className="font-display text-lg font-semibold text-paper">
                    Team Chat
                </h2>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
                {loading ? (
                    <div className="space-y-4">
                        <div className="flex items-end gap-3">
                            <Skeleton className="h-9 w-9" rounded="rounded-full" />
                            <Skeleton className="h-10 w-48" rounded="rounded-2xl" />
                        </div>
                        <div className="flex items-end justify-end gap-3">
                            <Skeleton className="h-10 w-40" rounded="rounded-2xl" />
                            <Skeleton className="h-9 w-9" rounded="rounded-full" />
                        </div>
                    </div>
                ) : error ? (
                    <p className="text-sm text-ink-red">{error}</p>
                ) : messages.length === 0 ? (
                    <EmptyState
                        icon={MessageSquare}
                        title="No messages yet"
                        body="Start the conversation with your team."
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