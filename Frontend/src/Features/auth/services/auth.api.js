import API from "./api";

// ================= AUTH =================

export const register = (data) =>
  API.post("/auth/register", data);

export const login = (data) =>
  API.post("/auth/login", data);

export const getme = () =>
  API.get("/auth/me");

export const logout = () =>
  API.post("/auth/logout");

// ================= PROFILE =================

export const updateProfile = (data) =>
  API.patch("/auth/profile", data);

// ================= PASSWORD =================

// Change password (logged in user)
export const updatePassword = (data) =>
  API.put("/auth/update-password", data);

// Forgot password
export const forgotPassword = (email) =>
  API.post("/auth/forgot-password", {
    email,
  });

// Reset password
export const resetPassword = (
  token,
  password
) =>
  API.post(
    `/auth/reset-password/${token}`,
    {
      password,
    }
  );

// ================= GOOGLE =================

export const googleLogin = () => {
  window.location.href =
    "https://prish-infotech.onrender.com/api/auth/google";
};