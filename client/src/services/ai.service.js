import api from "../api/axios";

// AI Assistant service. Both methods call real, working backend endpoints.

export const summarizeProjectDescription = async (startupId) => {
    const response = await api.post(`/ai/startups/${startupId}/summary`);
    return response.data.data;
};

export const generateWeeklyReport = async (startupId) => {
    const response = await api.post(`/ai/startups/${startupId}/weekly-report`);
    return response.data.data;
};