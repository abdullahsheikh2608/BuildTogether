import api from '../api/axios.js';

export const getAllStartups = (params = {}) =>
  api.get('/startups', { params }).then((response) => response.data.data);

export const getStartupById = (id) => api.get(`/startups/${id}`).then((response) => response.data.data);

export const createStartup = (payload) =>
  api.post('/startups', payload).then((response) => response.data.data);

export const updateStartup = (id, payload) =>
  api.patch(`/startups/${id}`, payload).then((response) => response.data.data);

export const deleteStartup = (id) => api.delete(`/startups/${id}`).then((response) => response.data);