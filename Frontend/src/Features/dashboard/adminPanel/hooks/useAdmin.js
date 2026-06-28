import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setDashboard,
  setUsers,
  setCourses,
  setEnrollments,
  setSelectedCourse,
} from "../redux/admin.slice";

import {
  getDashboard,
  getAllUsers,
  getAllCourses,
  getEnrollments,
  deleteCourse as deleteCourseAPI,
  updateCourse as updateCourseAPI,
} from "../services/admin.api";

import toast from "react-hot-toast";

export const useAdmin = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.admin);

  // ── DASHBOARD ───────────────────────────────────────────────
  const fetchDashboard = async () => {
    try {
      dispatch(setLoading(true));
      const { data } = await getDashboard();
      // Backend returns: { success, data: { users, courses, enrollments, revenue, recentUsers } }
      // Map to our state shape with friendly keys
      const raw = data.data;
      dispatch(
        setDashboard({
          totalUsers: raw.users,
          totalCourses: raw.courses,
          totalEnrollments: raw.enrollments,
          totalRevenue: raw.revenue,
          recentUsers: raw.recentUsers,
          // Charts and category stats (populated if backend sends them)
          revenueChart: raw.revenueChart || [],
          growthChart: raw.growthChart || [],
          categoryStats: raw.categoryStats || [],
          courseEnrollmentStats: raw.courseEnrollmentStats || [],
        })
      );
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ── USERS ────────────────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      dispatch(setLoading(true));
      const { data } = await getAllUsers();
      dispatch(setUsers(data.users));
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ── COURSES ──────────────────────────────────────────────────
  const fetchCourses = async () => {
    try {
      dispatch(setLoading(true));
      const { data } = await getAllCourses();
      dispatch(setCourses(data.courses));
    } catch (err) {
      toast.error("Failed to load courses");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const removeCourse = async (id) => {
    try {
      await deleteCourseAPI(id);
      dispatch(setCourses(state.courses.filter((c) => c._id !== id)));
      toast.success("Course deleted");
    } catch (err) {
      toast.error("Failed to delete course");
    }
  };

  const editCourse = async (id, courseData) => {
    try {
      const { data } = await updateCourseAPI(id, courseData);
      dispatch(
        setCourses(
          state.courses.map((c) => (c._id === id ? data.course : c))
        )
      );
      toast.success("Course updated");
    } catch (err) {
      toast.error("Failed to update course");
    }
  };

  const selectCourse = (course) => dispatch(setSelectedCourse(course));

  // ── ENROLLMENTS ──────────────────────────────────────────────
  const fetchEnrollments = async () => {
    try {
      dispatch(setLoading(true));
      const { data } = await getEnrollments();
      dispatch(setEnrollments(data.enrollments));
    } catch (err) {
      toast.error("Failed to load enrollments");
    } finally {
      dispatch(setLoading(false));
    }
  };


  return {
    ...state,
    fetchDashboard,
    fetchUsers,
    fetchCourses,
    removeCourse,
    editCourse,
    selectCourse,
    fetchEnrollments,
  };
};