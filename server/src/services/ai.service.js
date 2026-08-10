import pool from "../config/db.js";
import { groqService } from "./groq.service.js";
import { getStartupById } from "./startup.service.js";
import taskService from "./task.service.js";
import { promptBuilder } from "../utils/promptBuilder.js";
import { AI_MESSAGES } from "../constants/ai.constants.js";

// Provider-agnostic AI service. Future features (project summary, weekly
// report, etc.) should call generateCompletion() rather than reaching into
// groqService directly — this keeps the AI provider swappable later
// without touching feature code.
const generateCompletion = async (prompt) => {

    if (!prompt || !prompt.trim()) {
        throw new Error(AI_MESSAGES.EMPTY_PROMPT);
    }

    return groqService.getCompletion(prompt);
};

// Founders can access any startup they own. Developers can access a
// startup only once their application to it has been accepted — same
// membership rule used by taskService.getStartupTasks().
const canAccessStartup = async (startup, requesterId) => {

    if (startup.founder_id === requesterId) {
        return true;
    }

    const membership = await pool.query(
        `
        SELECT id
        FROM applications
        WHERE startup_id = $1
        AND developer_id = $2
        AND status = 'accepted'
        `,
        [startup.id, requesterId]
    );

    return membership.rows.length > 0;
};

// Generates a short AI summary of an existing startup's description.
// Reuses startupService instead of querying the startups table directly,
// so ownership/shape stays in one place.
const summarizeProject = async (startupId, requesterId) => {

    const startup = await getStartupById(startupId);

    if (!startup) {
        return "STARTUP_NOT_FOUND";
    }

    if (!(await canAccessStartup(startup, requesterId))) {
        return "FORBIDDEN";
    }

    const prompt = promptBuilder.buildProjectSummaryPrompt(startup);

    const summary = await generateCompletion(prompt);

    return { summary: summary.trim() };
};

// Derives report-ready stats from the startup's task list. Kept local to
// this service since it's only needed for the weekly report prompt.
const buildTaskStats = (tasks) => {

    const today = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(today.getDate() + 7);

    const isOverdue = (task) =>
        task.status !== "done" &&
        task.deadline &&
        new Date(task.deadline) < today;

    const isUpcoming = (task) =>
        task.status !== "done" &&
        task.deadline &&
        new Date(task.deadline) >= today &&
        new Date(task.deadline) <= weekFromNow;

    return {
        total: tasks.length,
        completed: tasks.filter((t) => t.status === "done").length,
        inProgress: tasks.filter((t) => t.status === "in_progress").length,
        todo: tasks.filter((t) => t.status === "todo").length,
        overdue: tasks.filter(isOverdue),
        upcoming: tasks.filter(isUpcoming),
    };
};

// Generates a short AI-written weekly progress report for a startup.
// Reuses taskService.getStartupTasks() instead of a new query — the
// founder ownership check already happens inside that call.
const generateWeeklyReport = async (startupId, requesterId) => {

    const startup = await getStartupById(startupId);

    if (!startup) {
        return "STARTUP_NOT_FOUND";
    }

    if (!(await canAccessStartup(startup, requesterId))) {
        return "FORBIDDEN";
    }

    const tasks = await taskService.getStartupTasks(startupId, requesterId);

    const stats = buildTaskStats(Array.isArray(tasks) ? tasks : []);

    const prompt = promptBuilder.buildWeeklyReportPrompt(startup, stats);

    const report = await generateCompletion(prompt);

    return {
        report: report.trim(),
        stats: {
            total: stats.total,
            completed: stats.completed,
            inProgress: stats.inProgress,
            todo: stats.todo,
            overdueCount: stats.overdue.length,
            upcomingCount: stats.upcoming.length,
        },
    };
};

export const aiService = {
    generateCompletion,
    summarizeProject,
    generateWeeklyReport,
};