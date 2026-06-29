import API from "../../../auth/services/api"; // your axios instance

// ================= DASHBOARD =================
export const getDashboard = () => API.get("/admin/dashboard");



// Backend route: PATCH /admin/users/:id (toggles isBlocked)
export const blockUser = (id) => API.patch(`/admin/users/${id}`);

