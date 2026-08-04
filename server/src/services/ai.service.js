import { groqService } from "./groq.service.js";
import { getStartupById } from "./startup.service.js";
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

const checkHealth = () => {
    return {
        status: "ok",
        message: AI_MESSAGES.HEALTH_OK,
    };
};

// Generates a short AI summary of an existing startup's description.
// Reuses startupService instead of querying the startups table directly,
// so ownership/shape stays in one place.
const summarizeProject = async (startupId, requesterId) => {

    const startup = await getStartupById(startupId);

    if (!startup) {
        return "STARTUP_NOT_FOUND";
    }

    if (startup.founder_id !== requesterId) {
        return "FORBIDDEN";
    }

    const prompt = promptBuilder.buildProjectSummaryPrompt(startup);

    const summary = await generateCompletion(prompt);

    return { summary: summary.trim() };
};

export const aiService = {
    generateCompletion,
    checkHealth,
    summarizeProject,
};