// ======================================================
// 📁 reviewSlice.js
// ======================================================

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviews: [],
  singleReview: null,
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "reviews",

  initialState,

  reducers: {
    // LOADING
    setReviewLoading: (state, action) => {
      state.loading = action.payload;
    },

    // ERROR
    setReviewError: (state, action) => {
      state.error = action.payload;
    },

    // ALL REVIEWS
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },

    // SINGLE REVIEW
    setSingleReview: (state, action) => {
      state.singleReview = action.payload;
    },

    // CREATE REVIEW
    addReview: (state, action) => {
      state.reviews.unshift(action.payload);
    },

    // UPDATE REVIEW
    updateReviewState: (state, action) => {
      state.reviews = state.reviews.map(
        (review) =>
          review._id === action.payload._id
            ? action.payload
            : review
      );
    },

    // DELETE REVIEW
    removeReview: (state, action) => {
      state.reviews = state.reviews.filter(
        (review) =>
          review._id !== action.payload
      );
    },
  },
});

export const {
  setReviewLoading,
  setReviewError,
  setReviews,
  setSingleReview,
  addReview,
  updateReviewState,
  removeReview,
} = reviewSlice.actions;

export default reviewSlice.reducer;