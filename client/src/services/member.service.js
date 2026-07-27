import api from "../api/axios";

export const getStartupMembers = async (startupId) => {
    const { data } = await api.get(`/members/startup/${startupId}`);
    return data.data;
};

export const getMyProjects = async () => {
    const { data } = await api.get("/members/my-projects");
    return data.data;
};