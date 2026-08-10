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

const ensureResetColumnsExist = async () => {
    try {
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
            ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;
        `);
    } catch (err) {
        console.error("Failed to ensure reset token columns exist:", err.message);
    }
};

export const requestPasswordResetCode = async (email) => {
    await ensureResetColumnsExist();

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
        "SELECT id, email FROM users WHERE LOWER(email) = LOWER($1)",
        [normalizedEmail]
    );

    if (result.rows.length === 0) {
        throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const user = result.rows[0];

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
        `
        UPDATE users
        SET reset_token = $1, reset_token_expires = $2
        WHERE id = $3
        `,
        [resetCode, expiresAt, user.id]
    );

    return {
        email: user.email,
        resetCode,
    };
};

export const resetPasswordWithCode = async ({ email, code, newPassword }) => {
    await ensureResetColumnsExist();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.toString().trim();

    const result = await pool.query(
        `
        SELECT id, reset_token, reset_token_expires
        FROM users
        WHERE LOWER(email) = LOWER($1)
        `,
        [normalizedEmail]
    );

    if (result.rows.length === 0) {
        throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const user = result.rows[0];

    if (!user.reset_token || user.reset_token !== normalizedCode) {
        throw new Error(AUTH_MESSAGES.INVALID_OR_EXPIRED_RESET_CODE);
    }

    if (new Date(user.reset_token_expires).getTime() < Date.now()) {
        throw new Error("Verification code has expired. Please request a new code.");
    }

    const hashedPassword = await hashPassword(newPassword);

    await pool.query(
        `
        UPDATE users
        SET password = $1, reset_token = NULL, reset_token_expires = NULL, updated_at = NOW()
        WHERE id = $2
        `,
        [hashedPassword, user.id]
    );

    return true;
};