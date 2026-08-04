import { groqService } from "./groq.service.js";
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

export const aiService = {
    generateCompletion,
    checkHealth,
};