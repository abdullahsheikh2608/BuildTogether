import pool from "../config/db.js";

const getMyNotifications = async (userId) => {

    const result = await pool.query(
        `
        SELECT
            id,
            title,
            message,
            type,
            reference_id,
            is_read,
            created_at

        FROM notifications

        WHERE user_id = $1

        ORDER BY created_at DESC
        `,
        [userId]
    );

    return result.rows;

};

const markNotificationAsRead = async (notificationId, userId) => {

    const result = await pool.query(
        `
        UPDATE notifications

        SET is_read = TRUE

        WHERE id = $1
        AND user_id = $2

        RETURNING
            id,
            title,
            message,
            type,
            reference_id,
            is_read,
            created_at
        `,
        [
            notificationId,
            userId,
        ]
    );

    if (result.rows.length === 0) {
        return "NOTIFICATION_NOT_FOUND";
    }

    return result.rows[0];

};

const markAllNotificationsAsRead = async (userId) => {

    await pool.query(
        `
        UPDATE notifications

        SET is_read = TRUE

        WHERE user_id = $1
        AND is_read = FALSE
        `,
        [userId]
    );

    return true;

};

const deleteNotification = async (notificationId, userId) => {

    const result = await pool.query(
        `
        DELETE FROM notifications

        WHERE id = $1
        AND user_id = $2

        RETURNING id
        `,
        [
            notificationId,
            userId,
        ]
    );

    if (result.rows.length === 0) {
        return "NOTIFICATION_NOT_FOUND";
    }

    return true;

};

const createNotification = async (
    userId,
    title,
    message,
    type,
    referenceId = null
) => {

    const result = await pool.query(
        `
        INSERT INTO notifications (
            user_id,
            title,
            message,
            type,
            reference_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `,
        [
            userId,
            title,
            message,
            type,
            referenceId,
        ]
    );

    return result.rows[0];

};

export const notificationService = {
    createNotification,
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
};