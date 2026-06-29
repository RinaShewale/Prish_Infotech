import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboard: null,
  users: [],
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
  },
});

export const {
  setLoading,
  setDashboard,
  setUsers,
} = adminSlice.actions;

export default adminSlice.reducer;