import {
    getOpenStartupsDueForWeeklyReport,
    markWeeklyReportSent,
} from "./startup.service.js";
import { aiService } from "./ai.service.js";
import { notificationService } from "./notification.service.js";
import { NOTIFICATION_TYPES, NOTIFICATION_LIMITS } from "../constants/notification.constants.js";
import {
    WEEKLY_REPORT_SCHEDULE,
    WEEKLY_REPORT_NOTIFICATION,
} from "../constants/weeklyReport.constant.js";

// Builds the notification body: a quick stats line founders can scan at
// a glance, followed by as much of the AI-written narrative as fits in
// the notification message limit.
const buildNotificationMessage = (startupTitle, result) => {

    const { report, stats } = result;

    const statsLine =
        `Tasks: ${stats.completed}/${stats.total} done, ` +
        `${stats.inProgress} in progress, ${stats.overdueCount} overdue, ` +
        `${stats.upcomingCount} due this week.`;

    const header = `Weekly report for "${startupTitle}" is ready.\n${statsLine}\n\n`;

    const remainingLength = NOTIFICATION_LIMITS.MESSAGE_MAX - header.length;

    const trimmedReport =
        remainingLength > 0 && report.length > remainingLength
            ? `${report.slice(0, remainingLength - 1).trimEnd()}…`
            : report;

    return remainingLength > 0 ? `${header}${trimmedReport}` : header.trimEnd();
};

// Finds every open startup that's due for its automatic weekly report,
// generates one via the existing AI report pipeline, and notifies the
// founder. Each startup is handled independently so one failure (e.g. the
// AI provider being briefly unavailable) doesn't block reports for
// everyone else, and only startups that actually succeed get stamped as
// sent — a failed one will simply be retried on the next check.
const sendWeeklyReports = async () => {

    const dueStartups = await getOpenStartupsDueForWeeklyReport(
        WEEKLY_REPORT_SCHEDULE.INTERVAL_DAYS
    );

    let sentCount = 0;

    for (const startup of dueStartups) {
        try {
            const result = await aiService.generateWeeklyReport(
                startup.id,
                startup.founder_id
            );

            // Defensive only — founder_id here always comes straight from
            // the startups table, so FORBIDDEN/STARTUP_NOT_FOUND shouldn't
            // actually occur, but generateWeeklyReport can still return
            // them by contract.
            if (result === "STARTUP_NOT_FOUND" || result === "FORBIDDEN") {
                continue;
            }

            await notificationService.createNotification(
                startup.founder_id,
                `${WEEKLY_REPORT_NOTIFICATION.TITLE_PREFIX}: ${startup.title}`,
                buildNotificationMessage(startup.title, result),
                NOTIFICATION_TYPES.SYSTEM,
                startup.id
            );

            await markWeeklyReportSent(startup.id);

            sentCount++;

        } catch (error) {
            console.error(`❌ Weekly report failed for startup ${startup.id}`);
            console.error(error);
        }
    }

    return sentCount;
};

export const weeklyReportGeneratorService = {
    sendWeeklyReports,
};