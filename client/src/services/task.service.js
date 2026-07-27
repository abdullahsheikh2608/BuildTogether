import api from "../api/axios";

export const getStartupTasks = async (startupId) => {
    const { data } = await api.get(`/tasks/startup/${startupId}`);
    return data.data;
};

export const getMyTasks = async () => {
    const { data } = await api.get("/tasks/me");
    return data.data;
};