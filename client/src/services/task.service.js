import api from "../api/axios";

export const getStartupTasks = async (startupId) => {
    const { data } = await api.get(`/tasks/startup/${startupId}`);
    return data.data;
};

export const getMyTasks = async () => {
    const { data } = await api.get("/tasks");
    return data.data;
};

export const createTask = async (payload) => {
    const { data } = await api.post("/tasks", payload);
    return data.data;
};

export const updateTask = async (taskId, payload) => {
    const { data } = await api.patch(`/tasks/${taskId}`, payload);
    return data.data;
};

export const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
};

export const updateTaskStatus = async (taskId, status) => {
    const { data } = await api.patch(`/tasks/${taskId}/status`, {
        status,
    });

    return data.data;
};