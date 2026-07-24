import pool from "../config/db.js";
import { notificationService } from "./notification.service.js";
import { NOTIFICATION_TYPES } from "../constants/notification.constants.js";

const taskService = {
    createTask: async (taskData, founderId) => {
        const {
            startup_id,
            assigned_to,
            title,
            description,
            priority,
            status,
            deadline,
        } = taskData;

        const startup = await pool.query(
            `
            SELECT id, founder_id
            FROM startups
            WHERE id = $1
            `,
            [startup_id]
        );

        if (startup.rows.length === 0) {
            return "STARTUP_NOT_FOUND";
        }

        if (startup.rows[0].founder_id !== founderId) {
            return "FORBIDDEN";
        }

        const application = await pool.query(
            `
            SELECT id
            FROM applications
            WHERE startup_id = $1
            AND developer_id = $2
            AND status = 'accepted'
            `,
            [startup_id, assigned_to]
        );

        if (application.rows.length === 0) {
            return "DEVELOPER_NOT_ACCEPTED";
        }

        const result = await pool.query(
            `
            INSERT INTO tasks (
                startup_id,
                assigned_to,
                title,
                description,
                priority,
                status,
                deadline
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING
                id,
                startup_id,
                assigned_to,
                title,
                description,
                priority,
                status,
                deadline,
                created_at
            `,
            [
                startup_id,
                assigned_to,
                title,
                description,
                priority,
                status,
                deadline,
            ]
        );
        await notificationService.createNotification(
        assigned_to,
        "New Task Assigned",
        `A new task "${title}" has been assigned to you.`,
        NOTIFICATION_TYPES.TASK,
        result.rows[0].id
    );

        return result.rows[0];
    },

    getStartupTasks: async (startupId, founderId) => {
        const startup = await pool.query(
            `
            SELECT id, founder_id
            FROM startups
            WHERE id = $1
            `,
            [startupId]
        );

        if (startup.rows.length === 0) {
            return "STARTUP_NOT_FOUND";
        }

        if (startup.rows[0].founder_id !== founderId) {
            return "FORBIDDEN";
        }

        const result = await pool.query(
            `
            SELECT
                id,
                startup_id,
                assigned_to,
                title,
                description,
                priority,
                status,
                deadline,
                created_at
            FROM tasks
            WHERE startup_id = $1
            ORDER BY created_at DESC
            `,
            [startupId]
        );

        return result.rows;
    },

    getMyTasks: async (developerId) => {
        const result = await pool.query(
            `
            SELECT
                id,
                startup_id,
                assigned_to,
                title,
                description,
                priority,
                status,
                deadline,
                created_at
            FROM tasks
            WHERE assigned_to = $1
            ORDER BY created_at DESC
            `,
            [developerId]
        );

        return result.rows;
    },

    updateTask: async (taskId, founderId, taskData) => {
        const task = await pool.query(
            `
            SELECT
            t.id,
            t.startup_id,
            t.assigned_to,
            s.founder_id
            FROM tasks t
            JOIN startups s ON t.startup_id = s.id
            WHERE t.id = $1
            `,
            [taskId]
        );

        if (task.rows.length === 0) {
            return "TASK_NOT_FOUND";
        }

        if (task.rows[0].founder_id !== founderId) {
            return "FORBIDDEN";
        }

        const fields = [];
        const values = [];
        let index = 1;
        const allowedFields = [
            "assigned_to",
            "title",
            "description",
            "priority",
            "status",
            "deadline",
        ];

        if (taskData.assigned_to !== undefined) {
            const application = await pool.query(
                `
                SELECT id
                FROM applications
                WHERE startup_id = $1
                AND developer_id = $2
                AND status = 'accepted'
                `,
                [task.rows[0].startup_id, taskData.assigned_to]
            );

            if (application.rows.length === 0) {
                return "DEVELOPER_NOT_ACCEPTED";
            }
        }

        for (const [key, value] of Object.entries(taskData)) {
            if (!allowedFields.includes(key)) {
                continue;
            }
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }

        if (fields.length === 0) {
            return "NOTHING_TO_UPDATE";
        }

        values.push(taskId);

        const result = await pool.query(
            `
            UPDATE tasks
            SET ${fields.join(", ")}
            WHERE id = $${index}
            RETURNING
                id,
                startup_id,
                assigned_to,
                title,
                description,
                priority,
                status,
                deadline,
                created_at
            `,
            values
        );
            if (
                taskData.assigned_to !== undefined &&
                task.rows[0].assigned_to !== taskData.assigned_to
            ) {

                await notificationService.createNotification(
                    taskData.assigned_to,
                    "Task Assigned",
                    `A task "${result.rows[0].title}" has been assigned to you.`,
                    NOTIFICATION_TYPES.TASK,
                    result.rows[0].id
    );

}

        return result.rows[0];
    },

    updateTaskStatus: async (taskId, developerId, status) => {
        const task = await pool.query(
            `
            SELECT id, assigned_to
            FROM tasks
            WHERE id = $1
            `,
            [taskId]
        );

        if (task.rows.length === 0) {
            return "TASK_NOT_FOUND";
        }

        if (task.rows[0].assigned_to !== developerId) {
            return "FORBIDDEN";
        }

        const result = await pool.query(
            `
            UPDATE tasks
            SET status = $1
            WHERE id = $2
            RETURNING
                id,
                startup_id,
                assigned_to,
                title,
                description,
                priority,
                status,
                deadline,
                created_at
            `,
            [status, taskId]
        );

        return result.rows[0];
    },

    deleteTask: async (taskId, founderId) => {
        const task = await pool.query(
            `
            SELECT t.id, s.founder_id
            FROM tasks t
            JOIN startups s ON t.startup_id = s.id
            WHERE t.id = $1
            `,
            [taskId]
        );

        if (task.rows.length === 0) {
            return "TASK_NOT_FOUND";
        }

        if (task.rows[0].founder_id !== founderId) {
            return "FORBIDDEN";
        }

        await pool.query(
            `
            DELETE FROM tasks
            WHERE id = $1
            `,
            [taskId]
        );

        return true;
    },
};

export default taskService;
