import "dotenv/config";
import app from "./app.js";
import pool from "./config/db.js";
import { deadlineReminderService } from "./services/deadlineReminder.service.js";
import { TASK_DEADLINE_REMINDER } from "./constants/task.constant.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket/socket.js";
import { weeklyReportGeneratorService } from "./services/weeklyReportGenerator.service.js";
import { WEEKLY_REPORT_SCHEDULE } from "./constants/weeklyReport.constant.js";


const PORT = process.env.PORT || 5000;

// Last-resort safety nets. These shouldn't normally fire — the specific
// pool.on('error', ...) handler in config/db.js already catches dropped
// DB connections — but this stops any *other* stray unhandled error
// (e.g. a forgotten .catch() somewhere) from silently killing the
// whole server the same way.
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
});

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

async function runWeeklyReportCheck() {
    try {
        const reportsSent = await weeklyReportGeneratorService.sendWeeklyReports();

        if (reportsSent > 0) {
            console.log(`📊 Sent ${reportsSent} automatic weekly report(s)`);
        }
    } catch (error) {
        console.error("❌ Weekly report check failed");
        console.error(error);
    }
}
runWeeklyReportCheck();
setInterval(runWeeklyReportCheck, WEEKLY_REPORT_SCHEDULE.CHECK_INTERVAL_MS);

// Postgres can take a few seconds to finish starting right after a
// machine boot (or right after a crash-recovery cycle), which used to
// make the very first connection attempt fail and crash the whole
// server immediately. Retrying with a short delay gives it a real
// chance to come up before we give up.
async function connectWithRetry(maxAttempts = 10, delayMs = 3000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            await pool.query("SELECT NOW()");
            return;
        } catch (error) {

            const isLastAttempt = attempt === maxAttempts;

            console.error(
                `❌ Database connection attempt ${attempt}/${maxAttempts} failed: ${error.message}`
            );

            if (isLastAttempt) {
                throw error;
            }

            console.log(`   Retrying in ${delayMs / 1000}s...`);

            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
}

async function startServer() {
    try {

        await connectWithRetry();

        console.log("✅ Database Connected Successfully");

        const httpServer = createServer(app);

        const io = new Server(httpServer, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:5173",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        initializeSocket(io);

        httpServer.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

        // Run once on startup, then on a recurring interval, so reminders
        // don't wait a full interval before the first check.
        runDeadlineReminderCheck();
        setInterval(runDeadlineReminderCheck, TASK_DEADLINE_REMINDER.CHECK_INTERVAL_MS);

    } catch (error) {

        console.error("❌ Database Connection Failed after multiple retries");
        console.error("   Check that PostgreSQL is running (services.msc) and DATABASE_URL in .env is correct.");

        process.exit(1);
    }
}

startServer();