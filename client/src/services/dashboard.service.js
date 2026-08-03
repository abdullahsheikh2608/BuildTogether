import api from "../api/axios";

export const getDashboardAnalytics = async () => {
    const response = await api.get("/dashboard/analytics");
    return response.data;
};