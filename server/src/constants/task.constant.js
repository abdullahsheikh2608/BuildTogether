export const TASK_PRIORITY = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
};

export const TASK_STATUS = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done",
};

export const TASK_LIMITS = {
    TITLE_MIN: 3,
    TITLE_MAX: 255,
    DESCRIPTION_MAX: 1000,
};

// How far ahead of a task's deadline a reminder notification is sent,
// and how often the server checks for tasks that just entered that window.
export const TASK_DEADLINE_REMINDER = {
    WINDOW_HOURS: 24,
    CHECK_INTERVAL_MS: 60 * 60 * 1000, // hourly
};