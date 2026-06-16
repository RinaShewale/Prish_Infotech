import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
  authChecked: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // ================= USER =================
    setUser: (state, action) => {
      state.user = action.payload;
    },

    updateUser: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },

    // ================= LOADING =================
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // ================= ERROR =================
    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    // ================= AUTH CHECK =================
    setAuthChecked: (state, action) => {
      state.authChecked = action.payload;
    },

    // ================= LOGOUT =================
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.authChecked = true;
    },
  },
});

export const {
  setUser,
  updateUser,
  setLoading,
  setError,
  clearError,
  setAuthChecked,
  logout,
} = authSlice.actions;

export default authSlice.reducer;