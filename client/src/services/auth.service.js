import api from '../api/axios';

export const login = (payload) => api.post('/auth/login', payload).then((res) => res.data.data);

export const register = (payload) =>
  api.post('/auth/register', payload).then((res) => res.data.data);

let getMePromise = null;
let cachedMe = null;

export const getMe = () => {
  if (cachedMe) return Promise.resolve(cachedMe);
  if (getMePromise) return getMePromise;

  getMePromise = api
    .get('/auth/me')
    .then((res) => {
      cachedMe = res.data.data;
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
  api.put('/profiles/me', payload).then((res) => res.data.data);
