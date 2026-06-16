import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  login,
  register,
  getme,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  logout as logoutApi,
  googleLogin,
} from "../services/auth.api";

import {
  setUser,
  setLoading,
  setError,
  setAuthChecked,
  logout as logoutAction,
} from "../redux/auth.slice";

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ================= REGISTER =================
  const handleRegister = async (data) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const res = await register(data);

      if (res?.data?.user) {
        dispatch(setUser(res.data.user));
        dispatch(setAuthChecked(true));
      }

      return {
        success: true,
        data: res.data,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Registration failed";

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
      dispatch(setError(null));

      const res = await login(data);

      if (res?.data?.user) {
        dispatch(setUser(res.data.user));
        dispatch(setAuthChecked(true));
      }

      navigate("/");

      return {
        success: true,
        user: res?.data?.user,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Login failed";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ================= GET CURRENT USER =================
  const handleGetMe = async () => {
    try {
      dispatch(setLoading(true));

      const res = await getme();

      dispatch(
        setUser(res?.data?.user || null)
      );

      return {
        success: true,
        user: res?.data?.user,
      };
    } catch (err) {
      dispatch(setUser(null));

      return {
        success: false,
      };
    } finally {
      dispatch(setLoading(false));
      dispatch(setAuthChecked(true));
    }
  };

  // ================= UPDATE PROFILE =================
  const handleUpdateProfile = async (
    profileData
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const res =
        await updateProfile(
          profileData
        );

      if (res?.data?.user) {
        dispatch(
          setUser(res.data.user)
        );
      }

      return {
        success: true,
        user: res?.data?.user,
        message:
          res?.data?.message ||
          "Profile updated successfully",
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Profile update failed";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };



  // ================= UPDATE PASSWORD =================
  const handleUpdatePassword = async (
    currentPassword,
    newPassword
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const res = await updatePassword({
        currentPassword,
        newPassword,
      });

      return {
        success: true,
        message: res.data.message,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Password update failed";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ================= FORGOT PASSWORD =================
  const handleForgotPassword = async (
    email
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const res =
        await forgotPassword(email);

      return {
        success: true,
        message: res.data.message,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to send reset email";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async (
    token,
    password
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const res =
        await resetPassword(
          token,
          password
        );

      return {
        success: true,
        message: res.data.message,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Password reset failed";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };




  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(logoutAction());
      navigate("/login");
    }
  };




  // ================= GOOGLE LOGIN =================
  const handleGoogleLogin = () => {
    googleLogin();
  };

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleUpdateProfile,
    handleUpdatePassword,
    handleForgotPassword,
    handleResetPassword,
    handleLogout,
    handleGoogleLogin,
  };
}