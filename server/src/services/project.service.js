import pool from "../config/db.js";

const projectService = {

    getFounderProjects: async (founderId) => {

        const result = await pool.query(
            `
            SELECT
                s.id,
                s.title,
                s.tagline,
                s.description,
                s.status,
                s.created_at

            FROM startups s

            WHERE s.founder_id = $1

            ORDER BY s.created_at DESC
            `,
            [founderId]
        );

        return result.rows;

    },

    getDeveloperProjects: async (developerId) => {

        const result = await pool.query(
            `
            SELECT
                s.id,
                s.title,
                s.tagline,
                s.description,
                s.status,
                s.created_at

            FROM applications a

            JOIN startups s
            ON a.startup_id = s.id

            WHERE a.developer_id = $1
            AND a.status = 'accepted'

            ORDER BY s.created_at DESC
            `,
            [developerId]
        );

        return result.rows;

    },

    getProjectById: async (projectId, userId) => {

        const startup = await pool.query(
            `
            SELECT
                id,
                founder_id,
                title,
                tagline,
                description,
                status,
                created_at

            FROM startups

            WHERE id = $1
            `,
            [projectId]
        );

        if (startup.rows.length === 0) {
            return "PROJECT_NOT_FOUND";
        }

        if (startup.rows[0].founder_id === userId) {
            return startup.rows[0];
        }

        const member = await pool.query(
            `
            SELECT id

            FROM applications

            WHERE startup_id = $1
            AND developer_id = $2
            AND status = 'accepted'
            `,
            [
                projectId,
                userId,
            ]
        );

        if (member.rows.length === 0) {
            return "FORBIDDEN";
        }

        return startup.rows[0];

    },

};

export default projectService;