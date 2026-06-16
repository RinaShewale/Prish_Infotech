import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  applications: [],
  loading: false,
  error: null,
};

const applicationSlice =
  createSlice({
    name: "application",

    initialState,

    reducers: {
      setLoading: (
        state,
        action
      ) => {
        state.loading =
          action.payload;
      },

      setApplications: (
        state,
        action
      ) => {
        state.applications =
          action.payload;
      },

      setError: (
        state,
        action
      ) => {
        state.error =
          action.payload;
      },
    },
  });

export const {
  setLoading,
  setApplications,
  setError,
} = applicationSlice.actions;

export default applicationSlice.reducer;