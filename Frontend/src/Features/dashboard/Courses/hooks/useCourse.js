// ======================================================
// 📁 hooks/useCourse.js
// ======================================================

import { useDispatch } from "react-redux";

import {
  getCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  uploadCourseVideo,
} from "../services/course.api";

import {
  setCourses,
  setSingleCourse,
  setLoading,
  setError,
  addCourse,
  removeCourse,
  updateCourseState,
} from "../course.slice";

export function useCourse() {
  const dispatch = useDispatch();

  // ======================================================
  // ✅ GET ALL COURSES
  // ======================================================
  const handleGetCourses = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const res = await getCourses();

      const courses = res?.data?.courses || [];

      dispatch(setCourses(courses));

      return {
        success: true,
        courses,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to fetch courses";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ======================================================
  // ✅ GET SINGLE COURSE (BY SLUG - IMPORTANT FIX)
  // ======================================================
  const handleGetSingleCourse = async (slug) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const res = await getSingleCourse(slug);

      const course = res?.data?.course;

      dispatch(setSingleCourse(course));

      return {
        success: true,
        course,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to fetch course";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ======================================================
  // ✅ CREATE COURSE (AUTO REFRESH FIX)
  // ======================================================
  const handleCreateCourse = async (data) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const res = await createCourse(data);

      const newCourse = res?.data?.course;

      if (newCourse) {
        dispatch(addCourse(newCourse));

        // 🔥 IMPORTANT: refresh list after create
        await handleGetCourses();
      }

      return {
        success: true,
        data: res?.data,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message || "Course creation failed";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ======================================================
  // ✅ UPDATE COURSE
  // ======================================================
  const handleUpdateCourse = async (id, data) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const res = await updateCourse(id, data);

      const updatedCourse = res?.data?.course;

      if (updatedCourse) {
        dispatch(updateCourseState(updatedCourse));
      }

      return {
        success: true,
        data: res?.data,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message || "Course update failed";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ======================================================
  // ✅ DELETE COURSE
  // ======================================================
  const handleDeleteCourse = async (id) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      await deleteCourse(id);

      dispatch(removeCourse(id));

      // optional refresh (recommended)
      await handleGetCourses();

      return {
        success: true,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message || "Course delete failed";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ======================================================
  // ✅ UPLOAD COURSE VIDEO
  // ======================================================
  const handleUploadCourseVideo = async (id, formData) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const res = await uploadCourseVideo(id, formData);

      const updatedCourse = res?.data?.course;

      if (updatedCourse) {
        dispatch(updateCourseState(updatedCourse));
      }

      return {
        success: true,
        data: res?.data,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message || "Video upload failed";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    handleGetCourses,
    handleGetSingleCourse,
    handleCreateCourse,
    handleUpdateCourse,
    handleDeleteCourse,
    handleUploadCourseVideo,
  };
}