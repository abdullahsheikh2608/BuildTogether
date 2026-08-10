import pool from "../config/db.js";
import { notificationService } from "./notification.service.js";
import { NOTIFICATION_TYPES } from "../constants/notification.constants.js";

    const getStartupMembers = async (
        startupId,
        requesterId,
        search = ""
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

    const isFounder = startup.rows[0].founder_id === requesterId;

    // Founders always have access. Developers only if they're an
    // accepted member of this specific startup.
    if (!isFounder) {

        const membership = await pool.query(
            `
            SELECT id
            FROM applications
            WHERE startup_id = $1
            AND developer_id = $2
            AND status = 'accepted'
            `,
            [startupId, requesterId]
        );

        if (membership.rows.length === 0) {
            return "FORBIDDEN";
        }
    }

    // Fetch accepted members
    const result = await pool.query(
        `
        SELECT DISTINCT ON (u.id)
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
        AND (
            $2 = ''
            OR p.full_name ILIKE '%' || $2 || '%'
            OR u.email ILIKE '%' || $2 || '%'
        )

        ORDER BY u.id, a.applied_at ASC
        `,
        [
            startupId,
            search.trim(),
        ]
    );

    return result.rows;
};

const getMyProjects = async (developerId) => {

    // Enriches each project the developer has applied to with real,
    // already-modeled data (tech stack, team size, task counts) so the
    // "My Projects" cards can show genuine numbers instead of nothing.
    // No new tables/fields — just additional aggregates over the same
    // applications/tasks rows every other page already reads from.
    const result = await pool.query(
        `
        SELECT
            s.id,
            s.title,
            s.tagline,
            s.description,
            s.tech_stack,
            a.status,
            a.applied_at AS joined_at,
            COUNT(DISTINCT accepted_members.id) AS members_count,
            COUNT(DISTINCT t.id) AS tasks_count,
            COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'done') AS completed_tasks_count

        FROM applications a

        INNER JOIN startups s
            ON a.startup_id = s.id

        LEFT JOIN applications accepted_members
            ON accepted_members.startup_id = s.id
            AND accepted_members.status = 'accepted'

        LEFT JOIN tasks t
            ON t.startup_id = s.id

        WHERE a.developer_id = $1
        AND a.status != 'removed'

        GROUP BY s.id, a.id
        ORDER BY a.applied_at DESC
        `,
        [developerId]
    );

    return result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        tagline: row.tagline,
        description: row.description,
        tech_stack: row.tech_stack ?? [],
        status: row.status,
        joined_at: row.joined_at,
        members_count: Number(row.members_count),
        tasks_count: Number(row.tasks_count),
        completed_tasks_count: Number(row.completed_tasks_count),
    }));
};

const removeProjectMember = async (
    startupId,
    developerId,
    founderId
) => {

    // Check startup exists
    const startup = await pool.query(
        `
        SELECT founder_id, title
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

    await notificationService.createNotification(
        developerId,
        "Removed From Project",
        `You have been removed from "${startup.rows[0].title}".`,
        NOTIFICATION_TYPES.PROJECT,
        startupId
    );

return true;
};

export const memberService = {
    getStartupMembers,
    getMyProjects,
    removeProjectMember,
};