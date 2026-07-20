import pool from "../config/db.js";

export const createApplication = async (applicationData, developerId) => {

    const {
        startup_id,
        message,
    } = applicationData;

    // Check startup exists
    const startup = await pool.query(
        `
        SELECT id
        FROM startups
        WHERE id = $1
        `,
        [startup_id]
    );

    if (startup.rows.length === 0) {
        return "STARTUP_NOT_FOUND";
    }

    // Check already applied
    const existingApplication = await pool.query(
        `
        SELECT id
        FROM applications
        WHERE startup_id = $1
        AND developer_id = $2
        `,
        [
            startup_id,
            developerId,
        ]
    );

    if (existingApplication.rows.length > 0) {
        return "ALREADY_APPLIED";
    }

    // Create application
    const result = await pool.query(
        `
        INSERT INTO applications (
            startup_id,
            developer_id,
            message,
            status
        )
        VALUES (
            $1,
            $2,
            $3,
            'pending'
        )
        RETURNING
            id,
            startup_id,
            developer_id,
            status,
            applied_at,
            message
        `,
        [
            startup_id,
            developerId,
            message || null,
        ]
    );

    return result.rows[0];
};

export const getMyApplications = async (developerId) => {

    const result = await pool.query(
        `
        SELECT
            a.id,
            a.status,
            a.applied_at,
            a.message,

            s.id AS startup_id,
            s.title,
            s.tagline

        FROM applications a

        LEFT JOIN startups s
        ON a.startup_id = s.id

        WHERE a.developer_id = $1

        ORDER BY a.applied_at DESC
        `,
        [developerId]
    );

    return result.rows;
};
export const getStartupApplications = async (
    startupId,
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

    // Fetch applications
    const result = await pool.query(
        `
        SELECT
            a.id,
            a.status,
            a.message,
            a.applied_at,

            u.id AS developer_id,
            u.email,

            p.full_name,
            p.username

        FROM applications a

        LEFT JOIN users u
        ON a.developer_id = u.id

        LEFT JOIN profiles p
        ON p.user_id = u.id

        WHERE a.startup_id = $1

        ORDER BY a.applied_at DESC
        `,
        [startupId]
    );

    return result.rows;
};
export const updateApplicationStatus = async (
    applicationId,
    founderId,
    status
) => {

    // Find application + startup owner
    const application = await pool.query(
        `
        SELECT
            a.id,
            a.status,
            s.founder_id

        FROM applications a

        LEFT JOIN startups s
        ON a.startup_id = s.id

        WHERE a.id = $1
        `,
        [applicationId]
    );

    if (application.rows.length === 0) {
        return "APPLICATION_NOT_FOUND";
    }

    // Check ownership
    if (application.rows[0].founder_id !== founderId) {
        return "FORBIDDEN";
    }

    // Already accepted/rejected
    if (application.rows[0].status !== "pending") {
        return "ALREADY_UPDATED";
    }

    // Update
    const result = await pool.query(
        `
        UPDATE applications
        SET status = $1

        WHERE id = $2

        RETURNING
            id,
            startup_id,
            developer_id,
            status,
            applied_at,
            message
        `,
        [
            status,
            applicationId,
        ]
    );

    return result.rows[0];
};