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

// Placeholder — implemented in PR3 (Weekly Project Report).
const buildWeeklyReportPrompt = () => {
    throw new Error("buildWeeklyReportPrompt() is not implemented yet.");
};

export const promptBuilder = {
    buildProjectSummaryPrompt,
    buildWeeklyReportPrompt,
};