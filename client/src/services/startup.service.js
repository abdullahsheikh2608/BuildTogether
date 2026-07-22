import api from '../api/axios.js';

export const getAllStartups = () => api.get('/startups').then((res) => res.data);

export const getStartupById = (id) => api.get(`/startups/${id}`).then((res) => res.data);

export const createStartup = (payload) =>
  api.post('/startups', payload).then((res) => res.data);

export const updateStartup = (id, payload) =>
  api.patch(`/startups/${id}`, payload).then((res) => res.data);

export const deleteStartup = (id) => api.delete(`/startups/${id}`).then((res) => res.data);
