import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboard: null,
  users: [],
  courses: [],
  enrollments: [],
  selectedCourse: null,
  loading: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDashboard: (state, action) => {
      state.dashboard = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    setEnrollments: (state, action) => {
      state.enrollments = action.payload;
    },
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
  },
});

export const {
  setLoading,
  setDashboard,
  setUsers,
  setCourses,
  setEnrollments,
  setSelectedCourse,
} = adminSlice.actions;

export default adminSlice.reducer;