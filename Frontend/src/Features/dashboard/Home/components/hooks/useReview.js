// ======================================================
// 📁 hooks/useReview.js
// ======================================================

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  setReviewLoading,
  setReviewError,
  setReviews,
  addReview,
  updateReviewState,
  removeReview,
} from "../../components/redux/review.slice";

import {
  createReviewApi,
  getAllReviewsApi,
  updateReviewApi,
  deleteReviewApi,
} from "../services/review.api";

export const useReview = () => {
  const dispatch = useDispatch();

  const {
    reviews,
    loading,
    error,
  } = useSelector(
    (state) => state.reviews
  );

  // ======================================================
  // ✅ GET ALL REVIEWS
  // ======================================================

  const handleGetReviews =
    async () => {
      try {
        dispatch(
          setReviewLoading(true)
        );

        const data =
          await getAllReviewsApi();

        dispatch(
          setReviews(data.reviews)
        );

      } catch (err) {
        dispatch(
          setReviewError(
            err?.response?.data
              ?.message ||
              "Failed to fetch reviews"
          )
        );
      } finally {
        dispatch(
          setReviewLoading(false)
        );
      }
    };

  // ======================================================
  // ✅ CREATE REVIEW
  // ======================================================

  const handleCreateReview =
    async (formData) => {
      try {
        dispatch(
          setReviewLoading(true)
        );

        const data =
          await createReviewApi(
            formData
          );

        dispatch(
          addReview(data.review)
        );

        return {
          success: true,
        };

      } catch (err) {
        const message =
          err?.response?.data
            ?.message ||
          "Failed to create review";

        dispatch(
          setReviewError(message)
        );

        return {
          success: false,
          message,
        };

      } finally {
        dispatch(
          setReviewLoading(false)
        );
      }
    };

  // ======================================================
  // ✅ UPDATE REVIEW
  // ======================================================

  const handleUpdateReview =
    async (id, formData) => {
      try {
        dispatch(
          setReviewLoading(true)
        );

        const data =
          await updateReviewApi(
            id,
            formData
          );

        dispatch(
          updateReviewState(
            data.review
          )
        );

      } catch (err) {
        dispatch(
          setReviewError(
            err?.response?.data
              ?.message ||
              "Failed to update review"
          )
        );
      } finally {
        dispatch(
          setReviewLoading(false)
        );
      }
    };

  // ======================================================
  // ✅ DELETE REVIEW
  // ======================================================

  const handleDeleteReview =
    async (id) => {
      try {
        dispatch(
          setReviewLoading(true)
        );

        await deleteReviewApi(id);

        dispatch(
          removeReview(id)
        );

      } catch (err) {
        dispatch(
          setReviewError(
            err?.response?.data
              ?.message ||
              "Failed to delete review"
          )
        );
      } finally {
        dispatch(
          setReviewLoading(false)
        );
      }
    };

  return {
    reviews,
    loading,
    error,

    handleGetReviews,
    handleCreateReview,
    handleUpdateReview,
    handleDeleteReview,
  };
};