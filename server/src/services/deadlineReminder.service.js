import pool from "../config/db.js";
import { notificationService } from "./notification.service.js";
import { NOTIFICATION_TYPES } from "../constants/notification.constants.js";
import { TASK_STATUS } from "../constants/task.constant.js";
import { TASK_DEADLINE_REMINDER } from "../constants/task.constant.js";

// Finds tasks whose deadline falls within the reminder window, is not yet
// completed, and has not already been reminded about — then notifies the
// assigned developer and marks the task so it isn't reminded twice.
const sendDeadlineReminders = async () => {
    const dueTasksResult = await pool.query(
        `
        SELECT
            id,
            title,
            assigned_to,
            deadline
        FROM tasks
        WHERE status != $1
        AND reminder_sent_at IS NULL
        AND deadline IS NOT NULL
        AND deadline <= NOW() + ($2 * INTERVAL '1 hour')
        `,
        [TASK_STATUS.DONE, TASK_DEADLINE_REMINDER.WINDOW_HOURS]
    );

    const dueTasks = dueTasksResult.rows;

    for (const task of dueTasks) {
        await notificationService.createNotification(
            task.assigned_to,
            "Task Deadline Approaching",
            `Your task "${task.title}" is due on ${new Date(task.deadline).toLocaleDateString()}.`,
            NOTIFICATION_TYPES.DEADLINE,
            task.id
        );

        await pool.query(
            `
            UPDATE tasks
            SET reminder_sent_at = NOW()
            WHERE id = $1
            `,
            [task.id]
        );
    }

    return dueTasks.length;
};

export const deadlineReminderService = {
    sendDeadlineReminders,
};