import api from "../api/axios";

export const getStartupTasks = async (
    startupId,
    search = ""
) => {

    const response = await api.get(
        `/tasks/startup/${startupId}`,
        {
            params: {
                search,
            },
        }
    );

    return response.data.data;
};

export const getMyTasks = async (params = {}) => {
    const response = await api.get("/tasks", { params });
    return {
        tasks: response.data.data,
        pagination: response.data.pagination,
    };
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