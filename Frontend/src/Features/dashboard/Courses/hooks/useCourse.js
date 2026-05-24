// ======================================================
// 📁 hooks/useCourse.js
// ======================================================

import { useCallback } from "react";

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

  // Get all courses

  const handleGetCourses =
    useCallback(async () => {

      try {

        dispatch(
          setLoading(true)
        );

        dispatch(
          setError(null)
        );

        const res =
          await getCourses();

        console.log(
          "Courses API Response:",
          res
        );

        console.log(
          "Courses Data:",
          res?.data
        );

        const courses =
          res?.data?.courses || [];

        console.log(
          "Final Courses:",
          courses
        );

        dispatch(
          setCourses(courses)
        );

        return {
          success: true,
          courses,
        };

      } catch (err) {

        console.log(
          "Course Fetch Error:",
          err
        );

        console.log(
          "Backend Error:",
          err?.response
        );

        const message =
          err?.response?.data
            ?.message ||
          "Failed to fetch courses";

        dispatch(
          setError(message)
        );

        return {
          success: false,
          message,
        };

      } finally {

        dispatch(
          setLoading(false)
        );
      }

    }, [dispatch]);

  // Get single course

  const handleGetSingleCourse =
    useCallback(async (slug) => {

      try {

        dispatch(
          setLoading(true)
        );

        dispatch(
          setError(null)
        );

        const res =
          await getSingleCourse(
            slug
          );

        const course =
          res?.data?.course;

        dispatch(
          setSingleCourse(course)
        );

        return {
          success: true,
          course,
        };

      } catch (err) {

        const message =
          err?.response?.data
            ?.message ||
          "Failed to fetch course";

        dispatch(
          setError(message)
        );

        return {
          success: false,
          message,
        };

      } finally {

        dispatch(
          setLoading(false)
        );
      }

    }, [dispatch]);

  // Create course

  const handleCreateCourse =
    async (data) => {

      try {

        dispatch(
          setLoading(true)
        );

        dispatch(
          setError(null)
        );

        const res =
          await createCourse(
            data
          );

        const newCourse =
          res?.data?.course;

        if (newCourse) {

          dispatch(
            addCourse(newCourse)
          );

          await handleGetCourses();
        }

        return {
          success: true,
          data: res?.data,
        };

      } catch (err) {

        const message =
          err?.response?.data
            ?.message ||
          "Course creation failed";

        dispatch(
          setError(message)
        );

        return {
          success: false,
          message,
        };

      } finally {

        dispatch(
          setLoading(false)
        );
      }
    };

  // Update course

  const handleUpdateCourse =
    async (id, data) => {

      try {

        dispatch(
          setLoading(true)
        );

        dispatch(
          setError(null)
        );

        const res =
          await updateCourse(
            id,
            data
          );

        const updatedCourse =
          res?.data?.course;

        if (updatedCourse) {

          dispatch(
            updateCourseState(
              updatedCourse
            )
          );
        }

        return {
          success: true,
          data: res?.data,
        };

      } catch (err) {

        const message =
          err?.response?.data
            ?.message ||
          "Course update failed";

        dispatch(
          setError(message)
        );

        return {
          success: false,
          message,
        };

      } finally {

        dispatch(
          setLoading(false)
        );
      }
    };

  // Delete course

  const handleDeleteCourse =
    async (id) => {

      try {

        dispatch(
          setLoading(true)
        );

        dispatch(
          setError(null)
        );

        await deleteCourse(id);

        dispatch(
          removeCourse(id)
        );

        await handleGetCourses();

        return {
          success: true,
        };

      } catch (err) {

        const message =
          err?.response?.data
            ?.message ||
          "Course delete failed";

        dispatch(
          setError(message)
        );

        return {
          success: false,
          message,
        };

      } finally {

        dispatch(
          setLoading(false)
        );
      }
    };

  // Upload course video

  const handleUploadCourseVideo =
    async (id, formData) => {

      try {

        dispatch(
          setLoading(true)
        );

        dispatch(
          setError(null)
        );

        const res =
          await uploadCourseVideo(
            id,
            formData
          );

        const updatedCourse =
          res?.data?.course;

        if (updatedCourse) {

          dispatch(
            updateCourseState(
              updatedCourse
            )
          );
        }

        return {
          success: true,
          data: res?.data,
        };

      } catch (err) {

        const message =
          err?.response?.data
            ?.message ||
          "Video upload failed";

        dispatch(
          setError(message)
        );

        return {
          success: false,
          message,
        };

      } finally {

        dispatch(
          setLoading(false)
        );
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