import pool from "../config/db.js";
import { getIO } from "../socket/socket.js";
import { notificationService } from "./notification.service.js";
import { NOTIFICATION_TYPES } from "../constants/notification.constants.js";

const verifyStartupAccess = async (startupId, userId) => {

    // Founder can access
    const founderResult = await pool.query(
        `
        SELECT id
        FROM startups
        WHERE id = $1
        AND founder_id = $2
        `,
        [startupId, userId]
    );

    if (founderResult.rows.length > 0) {
        return;
    }

    // Accepted developer can access
    const developerResult = await pool.query(
        `
        SELECT id
        FROM applications
        WHERE startup_id = $1
        AND developer_id = $2
        AND status = 'accepted'
        `,
        [startupId, userId]
    );

    if (developerResult.rows.length > 0) {
        return;
    }

    throw new Error("You are not a member of this startup.");
};

const getOrCreateChat = async (startupId) => {

    let chatResult = await pool.query(
        `
        SELECT *
        FROM chats
        WHERE startup_id = $1
        `,
        [startupId]
    );

    if (chatResult.rows.length > 0) {
        return chatResult.rows[0];
    }

    chatResult = await pool.query(
        `
        INSERT INTO chats(startup_id)
        VALUES($1)
        RETURNING *
        `,
        [startupId]
    );

    return chatResult.rows[0];
};

const getMessages = async (startupId, userId) => {

    await verifyStartupAccess(startupId, userId);

    const chat = await getOrCreateChat(startupId);

    const messagesResult = await pool.query(
        `
        SELECT
            m.id,
            m.chat_id,
            m.sender_id,
            p.full_name,
            m.message,
            m.created_at

        FROM messages m

        INNER JOIN profiles p
        ON m.sender_id = p.user_id

        WHERE m.chat_id = $1

        ORDER BY m.created_at ASC
        `,
        [chat.id]
    );

    return messagesResult.rows;
};

const getTeamParticipants = async (startupId) => {

    const startupResult = await pool.query(
        `
        SELECT founder_id, title
        FROM startups
        WHERE id = $1
        `,
        [startupId]
    );

    const developersResult = await pool.query(
        `
        SELECT developer_id
        FROM applications
        WHERE startup_id = $1
        AND status = 'accepted'
        `,
        [startupId]
    );

    const participantIds = new Set([
        startupResult.rows[0].founder_id,
        ...developersResult.rows.map((row) => row.developer_id),
    ]);

    return {
        title: startupResult.rows[0].title,
        participantIds,
    };
};

const sendMessage = async (startupId, senderId, message) => {

    await verifyStartupAccess(startupId, senderId);

    const chat = await getOrCreateChat(startupId);

    const messageResult = await pool.query(
        `
        INSERT INTO messages
        (
            chat_id,
            sender_id,
            message
        )
        VALUES
        (
            $1,
            $2,
            $3
        )
        RETURNING *
        `,
        [
            chat.id,
            senderId,
            message,
        ]
    );

    const newMessage = messageResult.rows[0];

    const io = getIO();

    io.to(startupId).emit("receive_message", newMessage);

    // Notify everyone else on the team so the message also shows up
    // in their notification bar, not just in the live chat window.
    try {

        const senderResult = await pool.query(
            `
            SELECT full_name
            FROM profiles
            WHERE user_id = $1
            `,
            [senderId]
        );

        const senderName = senderResult.rows[0]?.full_name ?? "Someone";

        const { title, participantIds } = await getTeamParticipants(startupId);

        const preview = message.length > 80
            ? `${message.slice(0, 80)}...`
            : message;

        const notifyTargets = [...participantIds].filter(
            (userId) => userId !== senderId
        );

        await Promise.all(
            notifyTargets.map((userId) =>
                notificationService.createNotification(
                    userId,
                    `New message in ${title}`,
                    `${senderName}: ${preview}`,
                    NOTIFICATION_TYPES.MESSAGE,
                    startupId
                )
            )
        );

    } catch (error) {
        // A notification failure shouldn't block the message from sending.
        console.error("Failed to create chat notifications:", error.message);
    }

    return newMessage;
};

export const chatService = {
    getOrCreateChat,
    getMessages,
    sendMessage,
};