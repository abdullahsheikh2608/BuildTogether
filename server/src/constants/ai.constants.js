export const AI_MESSAGES = {
    HEALTH_OK: "AI Assistant initialized successfully",
    PROVIDER_ERROR: "AI provider is currently unavailable. Please try again later.",
    EMPTY_PROMPT: "A prompt is required to generate an AI response.",
    STARTUP_NOT_FOUND: "Startup not found.",
    FORBIDDEN: "You do not have permission to summarize this startup.",
    INVALID_STARTUP_ID: "A valid startup id is required.",
    SUMMARY_GENERATED: "Project summary generated successfully.",
    WEEKLY_REPORT_GENERATED: "Weekly report generated successfully.",
};

// Non-secret request defaults for the Groq client. The API key and model
// name itself are read from environment variables — never hardcoded here.
export const GROQ_CONFIG = {
    BASE_URL: "https://api.groq.com/openai/v1/chat/completions",
    TEMPERATURE: 0.4,
    MAX_TOKENS: 1024,
};