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

      dispatch(
        setCourses(res?.data?.courses || [])
      );

      return {
        success: true,
        courses: res?.data?.courses,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to fetch courses";

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
  // ✅ GET SINGLE COURSE
  // ======================================================
  const handleGetSingleCourse = async (
    id
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const res =
        await getSingleCourse(id);

      dispatch(
        setSingleCourse(
          res?.data?.course
        )
      );

      return {
        success: true,
        course: res?.data?.course,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to fetch course";

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
  // ✅ CREATE COURSE
  // ======================================================
  const handleCreateCourse = async (
    data
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const res = await createCourse(data);

      if (res?.data?.course) {
        dispatch(
          addCourse(res.data.course)
        );
      }

      return {
        success: true,
        data: res?.data,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Course creation failed";

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
  const handleUpdateCourse = async (
    id,
    data
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const res = await updateCourse(
        id,
        data
      );

      if (res?.data?.course) {
        dispatch(
          updateCourseState(
            res.data.course
          )
        );
      }

      return {
        success: true,
        data: res?.data,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Course update failed";

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
  const handleDeleteCourse = async (
    id
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      await deleteCourse(id);

      dispatch(removeCourse(id));

      return {
        success: true,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Course delete failed";

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
  const handleUploadCourseVideo =
    async (id, formData) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const res =
          await uploadCourseVideo(
            id,
            formData
          );

        if (res?.data?.course) {
          dispatch(
            updateCourseState(
              res.data.course
            )
          );
        }

        return {
          success: true,
          data: res?.data,
        };
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          "Video upload failed";

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