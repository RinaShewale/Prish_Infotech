import API from "../../../../auth/services/api";

// GET all notifications
export const getNotificationsAPI = () => API.get("/notifications");

// CREATE notification
export const createNotificationAPI = (data) =>
  API.post("/notifications", data);

// MARK as read
export const markAsReadAPI = (id) =>
  API.put(`/notifications/${id}/read`);

// DELETE notification
export const deleteNotificationAPI = (id) =>
  API.delete(`/notifications/${id}`);