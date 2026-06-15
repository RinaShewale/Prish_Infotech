// ======================================================
// 📁 redux/course.slice.js
// ======================================================

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  singleCourse: null,
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,

  reducers: {
    // ================= LOADING =================
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // ================= ERROR =================
    setError: (state, action) => {
      state.error = action.payload;
    },

    // ================= SET COURSES =================
    setCourses: (state, action) => {
      state.courses = action.payload;
    },

    // ================= SET SINGLE COURSE =================
    setSingleCourse: (state, action) => {
      state.singleCourse = action.payload;
    },

    // ================= ADD COURSE =================
    addCourse: (state, action) => {
      state.courses.unshift(action.payload);
    },

    // ================= UPDATE COURSE =================
    updateCourseState: (state, action) => {
      state.courses = state.courses.map(
        (course) =>
          course._id === action.payload._id
            ? action.payload
            : course
      );
    },

    // ================= DELETE COURSE =================
    removeCourse: (state, action) => {
      state.courses = state.courses.filter(
        (course) => course._id !== action.payload
      );
    },
  },
});

export const {
  setLoading,
  setError,
  setCourses,
  setSingleCourse,
  addCourse,
  updateCourseState,
  removeCourse,
} = courseSlice.actions;

export default courseSlice.reducer;