import api from "../api/axios";

export const getWorkspaceOverview = async (workspaceId) => {
  const response = await api.get(`/workspaces/${workspaceId}/overview`);
  return response.data.data;
};

export const getWorkspaceMembers = async (workspaceId, params = {}) => {
  const response = await api.get(`/workspaces/${workspaceId}/members`, { params });
  return response.data.data;
};

export const getWorkspaceTasks = async (workspaceId, params = {}) => {
  const response = await api.get(`/workspaces/${workspaceId}/tasks`, { params });
  return response.data.data;
};

export const getWorkspaceMessages = async (workspaceId, params = {}) => {
  const response = await api.get(`/workspaces/${workspaceId}/messages`, { params });
  return response.data.data;
};

export const getWorkspaceDetails = async (workspaceId) => {
  const response = await api.get(`/workspaces/${workspaceId}/details`);
  return response.data.data;
};

export const workspaceService = {
  getWorkspaceOverview,
  getWorkspaceMembers,
  getWorkspaceTasks,
  getWorkspaceMessages,
  getWorkspaceDetails,
};

export default workspaceService;
