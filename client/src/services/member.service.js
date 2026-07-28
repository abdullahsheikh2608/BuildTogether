import api from "../api/axios";

export const getStartupMembers = async (startupId) => {
    const { data } = await api.get(`/members/startups/${startupId}/members`);
    return data.data;
};

export const getMyProjects = async () => {
    const { data } = await api.get("/members/me");
    return data.data;
};

export const removeMember = async (startupId, developerId) => {
    const { data } = await api.delete(
        `/members/startups/${startupId}/members/${developerId}`
    );

    return data.data;
};