import "dotenv/config";
import app from "./app.js";
import pool from "./config/db.js";
import { deadlineReminderService } from "./services/deadlineReminder.service.js";
import { TASK_DEADLINE_REMINDER } from "./constants/task.constant.js";

const PORT = process.env.PORT || 5000;

async function runDeadlineReminderCheck() {
    try {
        const remindersSent = await deadlineReminderService.sendDeadlineReminders();

        if (remindersSent > 0) {
            console.log(`🔔 Sent ${remindersSent} task deadline reminder(s)`);
        }
    } catch (error) {
        console.error("❌ Deadline reminder check failed");
        console.error(error);
    }
}

async function startServer() {
    try {

        await pool.query("SELECT NOW()");

        console.log("✅ Database Connected Successfully");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

        // Run once on startup, then on a recurring interval, so reminders
        // don't wait a full interval before the first check.
        runDeadlineReminderCheck();
        setInterval(runDeadlineReminderCheck, TASK_DEADLINE_REMINDER.CHECK_INTERVAL_MS);

    } catch (error) {

        console.error("❌ Database Connection Failed");
        console.error(error);

        process.exit(1);
    }
}

startServer();