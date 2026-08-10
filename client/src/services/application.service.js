import api from '../api/axios.js';

export const applyToStartup = (data) => {
  // If data is FormData, set headers appropriately (axios automatically handles boundary for FormData)
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  return api
    .post('/applications', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    .then((response) => response.data.data);
};

export const updateApplication = (id, data) => {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  return api
    .patch(`/applications/${id}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    .then((response) => response.data.data);
};

export const getApplicationById = (id) =>
  api.get(`/applications/${id}`).then((response) => response.data.data);

export const getMyApplications = (params = {}) =>
  api.get('/applications', { params }).then((response) => response.data.data);

export const getStartupApplications = (startupId, params = {}) =>
  api
    .get(`/applications/startup/${startupId}`, { params })
    .then((response) => response.data.data)
    .catch((err) => {
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    });

export const updateApplicationStatus = (id, status) =>
  api.patch(`/applications/${id}/status`, { status }).then((response) => response.data.data);

export const getResumeDownloadUrl = (id) => {
  const baseURL = api.defaults.baseURL || '/api/v1';
  const token = localStorage.getItem('access_token');
  return `${baseURL}/applications/${id}/resume${token ? `?token=${encodeURIComponent(token)}` : ''}`;
};

export const getApplicationResumeBlob = (id) =>
  api.get(`/applications/${id}/resume`, { responseType: 'blob' }).then((response) => response.data);