import pool from "../config/db.js";
import { AUTH_MESSAGES } from "../constants/messages.js";

export const updateUserProfile = async (userId, profileData) => {
    const { full_name, username } = profileData;

    const existingUsername = await pool.query(
        `
        SELECT id
        FROM profiles
        WHERE username = $1 AND user_id <> $2
        `,
        [username, userId]
    );

    if (existingUsername.rows.length > 0) {
        throw new Error(AUTH_MESSAGES.USERNAME_ALREADY_EXISTS);
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const profileExists = await client.query(
            `
            SELECT id FROM profiles WHERE user_id = $1
            `,
            [userId]
        );

        if (profileExists.rows.length > 0) {
            await client.query(
                `
                UPDATE profiles
                SET full_name = $1, username = $2
                WHERE user_id = $3
                `,
                [full_name, username, userId]
            );
        } else {
            await client.query(
                `
                INSERT INTO profiles (user_id, full_name, username)
                VALUES ($1, $2, $3)
                `,
                [userId, full_name, username]
            );
        }

        await client.query("COMMIT");

        const result = await pool.query(
            `
            SELECT u.id, u.email, u.role, p.full_name, p.username
            FROM users u
            LEFT JOIN profiles p ON p.user_id = u.id
            WHERE u.id = $1
            `,
            [userId]
        );

        return result.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};
