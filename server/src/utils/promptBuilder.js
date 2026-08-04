
const buildProjectSummaryPrompt = (startup) => {

    const techStack = Array.isArray(startup.tech_stack)
        ? startup.tech_stack.join(", ")
        : "Not specified";

    const requiredRoles = Array.isArray(startup.required_roles)
        ? startup.required_roles.join(", ")
        : "Not specified";

    return `You are helping summarize a startup project for a collaboration platform called BuildTogether.

Write a concise, professional summary (2-3 sentences) of the following project, aimed at developers deciding whether to apply. Focus on what the project does and what kind of contributor it needs. Do not invent details that aren't provided below.

Title: ${startup.title}
Tagline: ${startup.tagline ?? "Not specified"}
Description: ${startup.description}
Tech Stack: ${techStack}
Required Roles: ${requiredRoles}

Summary:`;
};

const buildWeeklyReportPrompt = (startup, stats) => {

    const formatTaskList = (tasks) =>
        tasks.length === 0
            ? "None"
            : tasks
                .map((task) => {
                    const assignee = task.developer_name ?? "Unassigned";
                    const deadline = task.deadline
                        ? new Date(task.deadline).toISOString().slice(0, 10)
                        : "No deadline";
                    return `- "${task.title}" (assigned to ${assignee}, deadline ${deadline}, priority ${task.priority})`;
                })
                .join("\n");

    return `You are writing a concise weekly progress report for a startup project on a collaboration platform called BuildTogether. The report is for the founder, summarizing current team progress based only on the data below. Do not invent numbers, names, or details that aren't provided.

Project: ${startup.title}

Task totals:
- Total tasks: ${stats.total}
- Completed: ${stats.completed}
- In progress: ${stats.inProgress}
- To do: ${stats.todo}

Overdue tasks:
${formatTaskList(stats.overdue)}

Upcoming deadlines (next 7 days):
${formatTaskList(stats.upcoming)}

Write a short weekly report (4-6 sentences) covering: overall progress, any overdue items that need attention, and what's coming up. Keep the tone professional and direct.

Report:`;
};

export const promptBuilder = {
    buildProjectSummaryPrompt,
    buildWeeklyReportPrompt,
};