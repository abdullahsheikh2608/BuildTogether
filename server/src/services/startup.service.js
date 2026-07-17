import pool from "../config/db.js";

export const createStartup = async (startupData, founderId) => {
    const {
        title,
        tagline,
        description,
        tech_stack,
        required_roles,
        status,
    } = startupData;

    const result = await pool.query(
        `
        INSERT INTO startups (
            founder_id,
            title,
            tagline,
            description,
            tech_stack,
            required_roles,
            status
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7
        )
        RETURNING
            id,
            founder_id,
            title,
            tagline,
            description,
            tech_stack,
            required_roles,
            status,
            created_at,
            updated_at
        `,
        [
            founderId,
            title,
            tagline,
            description,
            tech_stack,
            required_roles,
            status,
        ]
    );

    return result.rows[0];
};

export const getAllStartups = async () => {
    const result = await pool.query(`
        SELECT
            id,
            founder_id,
            title,
            tagline,
            description,
            tech_stack,
            required_roles,
            status,
            created_at,
            updated_at
        FROM startups
        ORDER BY created_at DESC
    `);

    return result.rows;
};

export const getStartupById = async (startupId) => {

    const result = await pool.query(
        `
        SELECT
            id,
            founder_id,
            title,
            tagline,
            description,
            tech_stack,
            required_roles,
            status,
            created_at,
            updated_at
        FROM startups
        WHERE id = $1
        `,
        [startupId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};