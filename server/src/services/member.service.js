import pool from "../config/db.js";

 const getStartupMembers = async (startupId, founderId) => {

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

const getMyProjects = async (developerId) => {

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

const removeProjectMember = async (
    startupId,
    developerId,
    founderId
) => {

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

    // Check accepted member
    const member = await pool.query(
        `
        SELECT id
        FROM applications
        WHERE startup_id = $1
        AND developer_id = $2
        AND status = 'accepted'
        `,
        [
            startupId,
            developerId,
        ]
    );

    if (member.rows.length === 0) {
        return "DEVELOPER_NOT_FOUND";
    }

    // Remove member
// Remove member
    await pool.query(
    `
        UPDATE applications
        SET status = 'removed'
        WHERE startup_id = $1
        AND developer_id = $2
    `,
    [
        startupId,
        developerId,
    ]
);

// Unassign all tasks of this member in this startup
    await pool.query(
    `
        UPDATE tasks
        SET assigned_to = NULL
        WHERE startup_id = $1
        AND assigned_to = $2
    `,
    [
        startupId,
        developerId,
    ]
);

return true;
};

export const memberService = {
    getStartupMembers,
    getMyProjects,
    removeProjectMember,
};