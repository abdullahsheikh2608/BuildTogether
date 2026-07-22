import pool from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { AUTH_MESSAGES } from "../constants/messages.js";

export const registerUser = async (userData) => {
    const { email, password, role, full_name, username } = userData;

    const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const existingUsername = await pool.query(
        "SELECT id FROM profiles WHERE username = $1",
        [username]
    );

    if (existingUsername.rows.length > 0) {
        throw new Error(AUTH_MESSAGES.USERNAME_ALREADY_EXISTS);
    }

    const hashedPassword = await hashPassword(password);

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const userResult = await client.query(
            `
            INSERT INTO users (email, password, role)
            VALUES ($1, $2, $3)
            RETURNING id, email, role
            `,
            [email, hashedPassword, role]
        );

        const user = userResult.rows[0];

        await client.query(
            `
            INSERT INTO profiles (user_id, full_name, username)
            VALUES ($1, $2, $3)
            `,
            [user.id, full_name, username]
        );

        await client.query("COMMIT");

        const userWithProfile = await pool.query(
            `
            SELECT u.id, u.email, u.role, p.full_name, p.username
            FROM users u
            LEFT JOIN profiles p ON p.user_id = u.id
            WHERE u.id = $1
            `,
            [user.id]
        );

        return userWithProfile.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export const loginUser = async ({ email, password }) => {
    const result = await pool.query(
        `
        SELECT u.id, u.email, u.password, u.role, p.full_name, p.username
        FROM users u
        LEFT JOIN profiles p ON p.user_id = u.id
        WHERE u.email = $1
        `,
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const user = result.rows[0];

    const isPasswordValid = await comparePassword(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    delete user.password;

    return user;
};