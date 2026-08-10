import api from "../api/axios";

export const getDashboardAnalytics = async (startupId) => {
    const response = await api.get("/dashboard/analytics", {
        params: startupId ? { startupId } : {},
    });
    return response.data;
};