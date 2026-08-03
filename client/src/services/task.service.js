import api from "../api/axios";

export const getStartupTasks = async (startupId) => {
    const response = await api.get(`/tasks/startup/${startupId}`);
    return response.data.data;
};

export const getMyTasks = async () => {
    const response = await api.get("/tasks");
    return response.data.data;
};

export const createTask = async (payload) => {
    const response = await api.post("/tasks", payload);
    return response.data.data;
};

export const updateTask = async (taskId, payload) => {
    const response = await api.patch(`/tasks/${taskId}`, payload);
    return response.data.data;
};

export const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
};

export const updateTaskStatus = async (taskId, status) => {
    const response = await api.patch(`/tasks/${taskId}/status`, {
        status,
    });

    return response.data.data;
};