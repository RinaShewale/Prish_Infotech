import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  media: null,
  loading: false,
  error: null,
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setMediaLoading: (state, action) => {
      state.loading = action.payload;
    },

    setMedia: (state, action) => {
      state.media = action.payload;
    },

    setMediaError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMediaLoading,
  setMedia,
  setMediaError,
} = mediaSlice.actions;

export default mediaSlice.reducer;