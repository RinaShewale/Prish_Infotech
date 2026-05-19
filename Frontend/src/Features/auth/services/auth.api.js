import API from "../../auth/services/api";

// ================= AUTH =================
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const getme = () => API.get("/auth/me");
export const logout = () => API.post("/auth/logout");

// ================= PROFILE =================
export const updateProfile = (data) =>
  API.put("/auth/profile", data);

// ================= PASSWORD =================
export const updatePassword = (data) =>
  API.put("/auth/update-password", data);

export const forgotPassword = (email) =>
  API.post("/auth/forgot-password", { email });

export const resetPassword = (token, password) =>
  API.post(`/auth/reset-password/${token}`, { password });

// ================= GOOGLE FIX =================
export const googleLogin = () => {
  window.location.href = "http://localhost:3000/api/auth/google";
};