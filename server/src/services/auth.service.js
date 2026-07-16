import pool from "../config/db.js";
import { hashPassword } from "../utils/hash.js";

export const registerUser = async (userData) => {
    const { email, password, role, full_name, username } = userData;

    // Check if email already exists
    const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Email already exists");
    }

    // Check if username already exists
    const existingUsername = await pool.query(
        "SELECT id FROM profiles WHERE username = $1",
        [username]
    );

    if (existingUsername.rows.length > 0) {
        throw new Error("Username already exists");
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

        return user;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

