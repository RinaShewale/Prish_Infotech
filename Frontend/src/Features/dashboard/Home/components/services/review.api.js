// ======================================================
// 📁 services/review.api.js
// ======================================================

import API, {
  PUBLIC_API,
} from "../../../../auth/services/api";

// ======================================================
// ✅ CREATE REVIEW
// ======================================================

export const createReviewApi =
  async (reviewData) => {
    const { data } = await API.post(
      "/reviews/create",
      reviewData
    );

    return data;
  };

// ======================================================
// ✅ GET ALL REVIEWS
// ======================================================

export const getAllReviewsApi =
  async () => {
    const { data } =
      await PUBLIC_API.get(
        "/reviews"
      );

    return data;
  };

// ======================================================
// ✅ GET SINGLE REVIEW
// ======================================================

export const getSingleReviewApi =
  async (id) => {
    const { data } =
      await PUBLIC_API.get(
        `/reviews/${id}`
      );

    return data;
  };

// ======================================================
// ✅ UPDATE REVIEW
// ======================================================

export const updateReviewApi =
  async (
    id,
    reviewData
  ) => {
    const { data } =
      await API.put(
        `/reviews/${id}`,
        reviewData
      );

    return data;
  };

// ======================================================
// ✅ DELETE REVIEW
// ======================================================

export const deleteReviewApi =
  async (id) => {
    const { data } =
      await API.delete(
        `/reviews/${id}`
      );

    return data;
  };