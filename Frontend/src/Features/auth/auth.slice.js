import { createSlice } from "@reduxjs/toolkit";

/* =========================
   INITIAL STATE
========================= */
const initialState = {
  user: null,          // logged-in user data
  loading: false,      // API loading state
  error: null,         // error messages
  authChecked: false,  // tells if /me API has completed
};

/* =========================
   AUTH SLICE
========================= */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* Set logged-in user */
    setUser: (state, action) => {
      state.user = action.payload;
    },

    /* Loading state */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    /* Error state */
    setError: (state, action) => {
      state.error = action.payload;
    },

    /* Marks auth check completed */
    setAuthChecked: (state, action) => {
      state.authChecked = action.payload;
    },

    /* Logout user completely */
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.authChecked = true; // important so UI doesn't hang
    },
  },
});

/* =========================
   EXPORT ACTIONS
========================= */
export const {
  setUser,
  setLoading,
  setError,
  setAuthChecked,
  logout,
} = authSlice.actions;

/* =========================
   EXPORT REDUCER
========================= */
export default authSlice.reducer;