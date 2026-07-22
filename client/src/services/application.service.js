import api from "../api/axios.js";

export const applyToStartup = (payload) =>
    api.post("/applications", payload).then((res) => res.data.data);

export const getMyApplications = () =>
    api.get("/applications/me").then((res) => res.data.data);

export const getStartupApplications = (startupId) =>
    api
        .get(`/applications/startup/${startupId}`)
        .then((res) => res.data.data)
        .catch((err) => {
            // Agar startup ki koi application nahi hai
            // backend 404 bhejta hai, us case mein empty array return karo
            if (err.response?.status === 404) {
                return [];
            }

            throw err;
        });

export const updateApplicationStatus = (id, status) =>
    api.patch(`/applications/${id}`, { status }).then((res) => res.data.data);