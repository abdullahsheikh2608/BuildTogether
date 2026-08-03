import api from "../api/axios";

export const getMessages = async (startupId) => {
    const response = await api.get(`/chat/${startupId}/messages`);
    return response.data.data;
};

export const sendMessage = async (startupId, message) => {
    const response = await api.post(`/chat/${startupId}/messages`, {
        message,
    });

    return response.data.data;
};