import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setDashboard,
  setUsers,
} from "../redux/admin.slice";

import {
  getDashboard,
  blockUser,
} from "../services/admin.api";

import toast from "react-hot-toast";

export const useAdmin = () => {
  const dispatch = useDispatch();
  const { dashboard, users, loading } = useSelector(
    (state) => state.admin
  );

  // ================= DASHBOARD =================
  const fetchDashboard = async () => {
    try {
      dispatch(setLoading(true));

      const { data } = await getDashboard();

      dispatch(setDashboard(data.data));
      dispatch(setUsers(data.data.recentUsers || []));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ================= BLOCK / UNBLOCK USER =================
  const toggleBlockUser = async (id) => {
    try {
      const { data } = await blockUser(id);

      dispatch(
        setUsers(
          users.map((user) =>
            user._id === id
              ? { ...user, isBlocked: data.user.isBlocked }
              : user
          )
        )
      );

      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    }
  };

  return {
    dashboard,
    users,
    loading,
    fetchDashboard,
    toggleBlockUser,
  };
};