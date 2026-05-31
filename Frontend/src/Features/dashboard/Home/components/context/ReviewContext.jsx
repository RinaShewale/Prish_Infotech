// ======================================================
// 📁 context/review.context.jsx
// ======================================================

import {
  createContext,
} from "react";

import { useReview } from "../hooks/useReview";

export const ReviewContext =
  createContext();

export const ReviewProvider = ({
  children,
}) => {
  const reviewData = useReview();

  return (
    <ReviewContext.Provider
      value={reviewData}
    >
      {children}
    </ReviewContext.Provider>
  );
};