import pool from "../config/db.js";
import { notificationService } from "./notification.service.js";
import { NOTIFICATION_TYPES } from "../constants/notification.constants.js";

export const createApplication = async (applicationData, developerId) => {

    const {
        startup_id,
        message,
    } = applicationData;

    // Check startup exists
    const startup = await pool.query(
        `
        SELECT id, founder_id, title
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

    await notificationService.createNotification(
        startup.rows[0].founder_id,
        "New Application Received",
        `You have a new application for "${startup.rows[0].title}".`,
        NOTIFICATION_TYPES.APPLICATION,
        result.rows[0].id
    );

    return result.rows[0];
};

export const getMyApplications = async (
    developerId,
    search = "",
    status = "",
    page = 1,
    limit = 10,
    sortBy = "applied_at",
    order = "DESC"
) => {

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const offset = (pageNumber - 1) * limitNumber;

    const allowedSortFields = [
        "applied_at"
    ];

    const allowedOrder = [
        "ASC",
        "DESC"
    ];

    const sortField = allowedSortFields.includes(sortBy)
        ? sortBy
        : "applied_at";

    const sortDirection = allowedOrder.includes(order.toUpperCase())
        ? order.toUpperCase()
        : "DESC";

    let query = `
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
    `;

    const values = [developerId];

    if (search) {
        values.push(`%${search}%`);

        query += `
            AND (
                s.title ILIKE $${values.length}
                OR s.tagline ILIKE $${values.length}
            )
        `;
    }

    if (status) {
        values.push(status);

        query += `
            AND a.status = $${values.length}
        `;
    }

    query += `
        ORDER BY a.${sortField} ${sortDirection}
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
    `;

    values.push(limitNumber);
    values.push(offset);

    const result = await pool.query(query, values);

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
            a.developer_id,
            a.startup_id,

            s.title,

            s.founder_id,

            p.full_name

        FROM applications a

        LEFT JOIN startups s
        ON a.startup_id = s.id

        LEFT JOIN profiles p
        ON p.user_id = a.developer_id

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
    await notificationService.createNotification(

    result.rows[0].developer_id,

    "Application Status Updated",

    status === "accepted"
        ? `Congratulations! Your application for "${application.rows[0].title}" has been accepted.`
        : `Your application for "${application.rows[0].title}" has been rejected.`,

    NOTIFICATION_TYPES.APPLICATION,

    applicationId

);

    if (status === "accepted") {
        await notificationService.createNotification(
            founderId,
            "New Member Joined",
            `${application.rows[0].full_name || "A developer"} has joined "${application.rows[0].title}".`,
            NOTIFICATION_TYPES.PROJECT,
            applicationId
        );
    }

    return result.rows[0];
};