import pool from "../config/db.js";

export const getStartupMembers = async (startupId, founderId) => {

    // Check startup exists
    const startup = await pool.query(
        `
        SELECT founder_id
        FROM startups
        WHERE id = $1
        `,
        [startupId]
    );

    if (startup.rows.length === 0) {
        return "STARTUP_NOT_FOUND";
    }

    // Check ownership
    if (startup.rows[0].founder_id !== founderId) {
        return "FORBIDDEN";
    }

    // Fetch accepted members
    const result = await pool.query(
        `
        SELECT
            u.id,
            u.email,
            p.full_name,
            p.username,
            a.applied_at AS joined_at

        FROM applications a

        INNER JOIN users u
            ON a.developer_id = u.id

        INNER JOIN profiles p
            ON p.user_id = u.id

        WHERE a.startup_id = $1
        AND a.status = 'accepted'

        ORDER BY a.applied_at ASC
        `,
        [startupId]
    );

    return result.rows;
};

export const getMyProjects = async (developerId) => {

    const result = await pool.query(
        `
        SELECT
            s.id,
            s.title,
            s.tagline,
            a.applied_at AS joined_at

        FROM applications a

        INNER JOIN startups s
            ON a.startup_id = s.id

        WHERE a.developer_id = $1
        AND a.status = 'accepted'

        ORDER BY a.applied_at DESC
        `,
        [developerId]
    );

    return result.rows;
};