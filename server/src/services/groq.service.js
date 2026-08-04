import "dotenv/config";

import { GROQ_CONFIG, AI_MESSAGES } from "../constants/ai.constants.js";

// Reusable, low-level Groq client. This is the ONLY place that talks to
// the Groq API directly. Every future AI feature should go through
// aiService instead of calling this file directly.
const getCompletion = async (prompt) => {

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.AI_MODEL;
    const baseUrl =
        process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1/chat/completions";

    if (!apiKey || !model) {
        throw new Error(
            "GROQ_API_KEY and AI_MODEL must be set in the environment."
        );
    }

    let response;

    try {

        response = await fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: GROQ_CONFIG.TEMPERATURE,
                max_tokens: GROQ_CONFIG.MAX_TOKENS,
            }),
        });

    } catch (error) {
        // Network-level failure talking to Groq — don't leak provider
        // internals to the client.
        throw new Error(AI_MESSAGES.PROVIDER_ERROR);
    }

    if (!response.ok) {
        throw new Error(AI_MESSAGES.PROVIDER_ERROR);
    }

    const data = await response.json();

    return data?.choices?.[0]?.message?.content ?? "";
};

export const groqService = {
    getCompletion,
};