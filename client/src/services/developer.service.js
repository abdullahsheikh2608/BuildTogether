import api from "../api/axios";

export const getMyProjects = async () => {
    const response = await api.get("/projects");
    return response.data;
};