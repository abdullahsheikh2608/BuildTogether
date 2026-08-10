import pool from "../config/db.js";

const RESULT_LIMIT = 5;

const searchService = {

    // Founder: search across their own startups (Projects), tasks that
    // belong to those startups, and applications received on those startups.
    searchAsFounder: async (founderId, term) => {

        const [
            projects,
            tasks,
            applications,
        ] = await Promise.all([

            pool.query(
                `
                SELECT
                    id,
                    title,
                    tagline,
                    status

                FROM startups

                WHERE founder_id = $1
                AND title ILIKE $2

                ORDER BY created_at DESC
                LIMIT ${RESULT_LIMIT}
                `,
                [founderId, term]
            ),

            pool.query(
                `
                SELECT
                    t.id,
                    t.title,
                    t.priority,
                    t.status,
                    t.startup_id,
                    s.title AS startup_title

                FROM tasks t

                INNER JOIN startups s
                    ON t.startup_id = s.id

                WHERE s.founder_id = $1
                AND t.title ILIKE $2

                ORDER BY t.created_at DESC
                LIMIT ${RESULT_LIMIT}
                `,
                [founderId, term]
            ),

            pool.query(
                `
                SELECT
                    a.id,
                    a.status,
                    a.startup_id,
                    s.title AS startup_title,
                    COALESCE(p.full_name, u.email) AS developer_name

                FROM applications a

                INNER JOIN startups s
                    ON a.startup_id = s.id

                INNER JOIN users u
                    ON u.id = a.developer_id

                LEFT JOIN profiles p
                    ON p.user_id = a.developer_id

                WHERE s.founder_id = $1
                AND (
                    s.title ILIKE $2
                    OR p.full_name ILIKE $2
                    OR u.email ILIKE $2
                )

                ORDER BY a.applied_at DESC
                LIMIT ${RESULT_LIMIT}
                `,
                [founderId, term]
            ),
        ]);

        const projectResults = projects.rows.map((row) => ({
            id: row.id,
            title: row.title,
            subtitle: row.tagline || "Your project",
            type: "project",
            route: `/founder/projects/${row.id}`,
        }));

        const taskResults = tasks.rows.map((row) => ({
            id: row.id,
            title: row.title,
            subtitle: `${row.startup_title} • ${row.priority} priority`,
            type: "task",
            route: `/founder/projects/${row.startup_id}?taskId=${row.id}`,
        }));

        const applicationResults = applications.rows.map((row) => ({
            id: row.id,
            title: row.developer_name,
            subtitle: `${row.startup_title} • ${row.status}`,
            type: "application",
            route: `/founder/startups/${row.startup_id}/applications`,
        }));

        return [
            ...projectResults,
            ...taskResults,
            ...applicationResults,
        ];

    },

    // Developer: search across startups they were accepted into (Projects),
    // tasks assigned to them, and open startups they can browse.
    searchAsDeveloper: async (developerId, term) => {

        const [
            projects,
            tasks,
            startups,
        ] = await Promise.all([

            pool.query(
                `
                SELECT
                    s.id,
                    s.title,
                    s.tagline,
                    s.status

                FROM applications a

                INNER JOIN startups s
                    ON a.startup_id = s.id

                WHERE a.developer_id = $1
                AND a.status = 'accepted'
                AND s.title ILIKE $2

                ORDER BY s.created_at DESC
                LIMIT ${RESULT_LIMIT}
                `,
                [developerId, term]
            ),

            pool.query(
                `
                SELECT
                    t.id,
                    t.title,
                    t.priority,
                    t.status,
                    t.startup_id,
                    s.title AS startup_title

                FROM tasks t

                INNER JOIN startups s
                    ON t.startup_id = s.id

                WHERE t.assigned_to = $1
                AND t.title ILIKE $2

                ORDER BY t.created_at DESC
                LIMIT ${RESULT_LIMIT}
                `,
                [developerId, term]
            ),

            pool.query(
                `
                SELECT
                    id,
                    title,
                    tagline,
                    status

                FROM startups

                WHERE status = 'open'
                AND title ILIKE $1

                ORDER BY created_at DESC
                LIMIT ${RESULT_LIMIT}
                `,
                [term]
            ),
        ]);

        const projectResults = projects.rows.map((row) => ({
            id: row.id,
            title: row.title,
            subtitle: row.tagline || "Your project",
            type: "project",
            route: `/developer/workspace/${row.id}`,
        }));

        const taskResults = tasks.rows.map((row) => ({
            id: row.id,
            title: row.title,
            subtitle: `${row.startup_title} • ${row.priority} priority`,
            type: "task",
            route: `/developer/workspace/${row.startup_id}?taskId=${row.id}`,
        }));

        const startupResults = startups.rows.map((row) => ({
            id: row.id,
            title: row.title,
            subtitle: row.tagline || "Open startup",
            type: "startup",
            route: `/dashboard/startups/${row.id}`,
        }));

        return [
            ...projectResults,
            ...taskResults,
            ...startupResults,
        ];

    },

    globalSearch: async (userId, role, query) => {

        const term = `%${query}%`;

        if (role === "founder") {
            return searchService.searchAsFounder(userId, term);
        }

        if (role === "developer") {
            return searchService.searchAsDeveloper(userId, term);
        }

        return [];

    },

};

export default searchService;