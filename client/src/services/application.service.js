import api from '../api/axios.js';

export const applyToStartup = (payload) =>
  api.post('/applications', payload).then((response) => response.data.data);

export const getMyApplications = (params = {}) =>
  api.get('/applications', { params }).then((response) => response.data.data);

export const getStartupApplications = (startupId, params = {}) =>
  api
    .get(`/applications/startup/${startupId}`, { params })
    .then((response) => response.data.data)
    .catch((err) => {
      // Agar startup ki koi application nahi hai
      // backend 404 bhejta hai, us case mein empty array return karo
      if (err.response?.status === 404) {
        return [];
      }

      throw err;
    });

export const updateApplicationStatus = (id, status) =>
  api.patch(`/applications/${id}`, { status }).then((response) => response.data.data);