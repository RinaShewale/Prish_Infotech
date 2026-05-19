import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  login,
  register,
  getme,
  updateProfile,
  logout as logoutApi,
  updatePassword,
  forgotPassword,
  resetPassword,
  googleLogin,
} from "../services/auth.api";

import {
  setUser,
  setLoading,
  setError,
  setAuthChecked,
  logout as logoutAction,
} from "../auth.slice";

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ================= REGISTER =================
  const handleRegister = async (data) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const res = await register(data);

      return {
        success: true,
        data: res?.data,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message || "Registration failed";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ================= LOGIN =================
  const handleLogin = async (data) => {
    try {
      dispatch(setLoading(true));

      const res = await login(data);

      const user = res.data?.user;

      if (user) {
        dispatch(setUser(user));
      }

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      return { success: true, user };
    } catch (err) {
      dispatch(setError(err.response?.data?.message));
      return {
        success: false,
        message: err.response?.data?.message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };


  
  // ================= GET ME =================
  const handleGetMe = async () => {
    try {
      dispatch(setLoading(true));

      const res = await getme();

      dispatch(setUser(res?.data?.user || null));

      return { success: true };
    } catch (err) {
      dispatch(setUser(null));
      return { success: false };
    } finally {
      dispatch(setLoading(false));
      dispatch(setAuthChecked(true));
    }
  };

  // ================= UPDATE PROFILE =================
  const handleUpdateProfile = async (data) => {
    try {
      dispatch(setLoading(true));

      const res = await updateProfile(data);

      dispatch(setUser(res?.data?.user));

      return { success: true };
    } catch (err) {
      dispatch(setError(err?.response?.data?.message));
      return { success: false };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.log("Logout error ignored");
    } finally {
      localStorage.removeItem("token");
      dispatch(logoutAction());
      navigate("/login");
    }
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleLogin = () => {
    googleLogin(); // redirects to backend
  };

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleUpdateProfile,
    handleLogout,
    handleGoogleLogin,
  };
}