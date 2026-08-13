import api from "../api/axios";

export const getStartupMembers = async (
    startupId,
    search = ""
) => {

    const response = await api.get(
        `/members/startups/${startupId}/members`,
        {
            params: {
                search,
            },
        }
    );

    return response.data.data;
};

export const getMyProjects = async () => {
    const response = await api.get("/members");
    return response.data.data;
};

export const removeMember = async (startupId, developerId) => {
    const response = await api.delete(
        `/members/startups/${startupId}/developers/${developerId}`
    );

    return response.data.data;
};