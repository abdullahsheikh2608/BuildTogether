import api from "../api/axios.js";

// Global search across Projects, Tasks, Startups and Applications.
// Returns a flat array of { id, title, subtitle, type, route }.
export const globalSearch = async (query, options = {}) => {
    const response = await api.get("/search", {
        params: { q: query },
        signal: options.signal,
    });

    return response.data.data;
};