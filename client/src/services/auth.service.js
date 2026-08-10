import api from '../api/axios.js';

export const login = (payload) => api.post('/auth/login', payload).then((response) => response.data.data);
export const register = (payload) =>

  api.post('/auth/register', payload).then((response) => response.data.data);

let getMePromise = null;
let cachedMe = null;
export const getMe = () => {
  if (cachedMe) return Promise.resolve(cachedMe);
  if (getMePromise) return getMePromise;
  getMePromise = api
    .get('/auth/me')
    .then((response) => {
      cachedMe = response.data.data;
      return cachedMe;
    })
    .catch((error) => {
      getMePromise = null;
      throw error;
    })
    .finally(() => {
      getMePromise = null;
    });
  return getMePromise;
};
export const clearMeCache = () => {
  cachedMe = null;
  getMePromise = null;
};
export const updateProfile = (payload) =>

  api.put('/profiles/me', payload).then((response) => response.data.data);

export const forgotPassword = (payload) =>
  api.post('/auth/forgot-password', payload).then((response) => response.data);

export const resetPassword = (payload) =>
  api.post('/auth/reset-password', payload).then((response) => response.data);