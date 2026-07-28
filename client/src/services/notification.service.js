import api from "../api/axios.js";

export const getMyNotifications = () =>
  api.get("/notifications").then((res) => res.data.data);

export const markNotificationAsRead = (id) =>
  api.patch(`/notifications/${id}/read`).then((res) => res.data.data);

export const markAllNotificationsAsRead = () =>
  api.patch("/notifications/read-all").then((res) => res.data);

export const deleteNotification = (id) =>
  api.delete(`/notifications/${id}`).then((res) => res.data);