import api from "../api/axios";

export const getMyProjects = async () => {
    const { data } = await api.get("/members/me");
    return data.data;
};