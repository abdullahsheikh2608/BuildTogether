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

export const getAllStartups = async (userId = null, role = null) => {
    if (role === 'founder') {
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
            WHERE founder_id = $1
            ORDER BY created_at DESC
        `, [userId]);

        return result.rows;
    }

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

export const updateStartup = async (startupId, founderId, startupData) => {

    const existingStartup = await pool.query(
        `
        SELECT founder_id
        FROM startups
        WHERE id = $1
        `,
        [startupId]
    );

    if (existingStartup.rows.length === 0) {
        return null;
    }

    if (existingStartup.rows[0].founder_id !== founderId) {
        return "FORBIDDEN";
    }

    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(startupData)) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
    }

    values.push(startupId);

    const result = await pool.query(
        `
        UPDATE startups
        SET
            ${fields.join(", ")},
            updated_at = NOW()
        WHERE id = $${index}
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
        values
    );

    return result.rows[0];
};

export const deleteStartup = async (startupId, founderId) => {

    const existingStartup = await pool.query(
        `
        SELECT founder_id
        FROM startups
        WHERE id = $1
        `,
        [startupId]
    );

    if (existingStartup.rows.length === 0) {
        return null;
    }

    if (existingStartup.rows[0].founder_id !== founderId) {
        return "FORBIDDEN";
    }

    await pool.query(
        `
        DELETE FROM startups
        WHERE id = $1
        `,
        [startupId]
    );

    return true;
};