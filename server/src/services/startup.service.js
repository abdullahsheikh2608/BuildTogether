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

export const getAllStartups = async (
    userId = null,
    role = null,
    search = "",
    status = "",
    page = 1,
    limit = 10,
    sortBy = "created_at",
    order = "DESC"
) => {

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const offset = (pageNumber - 1) * limitNumber;

    const allowedSortFields = [
        "title",
        "created_at",
        "updated_at"
    ];

    const allowedOrder = [
        "ASC",
        "DESC"
    ];

    const sortField = allowedSortFields.includes(sortBy)
        ? sortBy
        : "created_at";

    const sortDirection = allowedOrder.includes(order.toUpperCase())
        ? order.toUpperCase()
        : "DESC";

    let query = `
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
    `;

    const conditions = [];
    const values = [];

    if (role === "founder") {
        values.push(userId);
        conditions.push(`founder_id = $${values.length}`);
    }

    if (search) {
        values.push(`%${search}%`);
        conditions.push(`
            (
                title ILIKE $${values.length}
                OR tagline ILIKE $${values.length}
            )
        `);
    }

    if (status) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += `
        ORDER BY ${sortField} ${sortDirection}
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
    `;

    values.push(limitNumber);
    values.push(offset);

    const result = await pool.query(query, values);

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

// Startups eligible for the automatic weekly report: still open, and
// either never reported on or last reported on more than INTERVAL_DAYS
// ago. Closed startups are skipped — a founder doesn't need progress
// reports on a startup that isn't actively being worked on anymore.
export const getOpenStartupsDueForWeeklyReport = async (intervalDays) => {

    const result = await pool.query(
        `
        SELECT
            id,
            founder_id,
            title
        FROM startups
        WHERE status = 'open'
        AND (
            last_weekly_report_at IS NULL
            OR last_weekly_report_at <= NOW() - ($1 * INTERVAL '1 day')
        )
        `,
        [intervalDays]
    );

    return result.rows;
};

// Stamps a startup as just having had its weekly report sent, so the
// scheduler's "due" query won't pick it up again until the next cycle.
export const markWeeklyReportSent = async (startupId) => {

    await pool.query(
        `
        UPDATE startups
        SET last_weekly_report_at = NOW()
        WHERE id = $1
        `,
        [startupId]
    );
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