import { useCallback, useState } from "react";

import { getMessages, sendMessage } from "../services/chat.service.js";

export function useChat() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const loadMessages = useCallback(async (startupId) => {
        try {
            setLoading(true);
            setError("");

            const data = await getMessages(startupId);

            setMessages(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err?.response?.data?.message ??
                    "Unable to load messages."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // Appends a message coming from either a successful send or the
    // `receive_message` socket event. Guards against duplicates so an
    // echoed socket event for a message we just sent doesn't double it up.
    const appendMessage = useCallback((message) => {
        setMessages((current) => {
            if (current.some((item) => item.id === message.id)) {
                return current;
            }

            return [...current, message];
        });
    }, []);

    const sendChatMessage = useCallback(async (startupId, message) => {
        try {
            setSending(true);
            setError("");

            const newMessage = await sendMessage(startupId, message);

            appendMessage(newMessage);

            return newMessage;
        } catch (err) {
            setError(
                err?.response?.data?.message ??
                    "Unable to send message."
            );

            throw err;
        } finally {
            setSending(false);
        }
    }, [appendMessage]);

    return {
        messages,
        loading,
        sending,
        error,
        loadMessages,
        sendChatMessage,
        appendMessage,
        setMessages,
    };
}
