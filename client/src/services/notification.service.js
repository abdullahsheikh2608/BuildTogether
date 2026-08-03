import api from "../api/axios.js";

export const getMyNotifications = () =>
  api.get("/notifications").then((response) => response.data.data);

export const markNotificationAsRead = (id) =>
  api.patch(`/notifications/${id}/read`).then((response) => response.data.data);

export const markAllNotificationsAsRead = () =>
  api.patch("/notifications/read-all").then((response) => response.data);

export const deleteNotification = (id) =>
  api.delete(`/notifications/${id}`).then((response) => response.data);