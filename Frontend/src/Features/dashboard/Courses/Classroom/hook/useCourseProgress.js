import { useState, useCallback } from "react";
import { getCourseProgressAPI } from "../services/courseProgress.service";

export const useCourseProgress = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);

  const fetchProgress = useCallback(async (courseId) => {
    try {
      setLoading(true);
      const res = await getCourseProgressAPI(courseId);

      if (res.success) {
        setProgress(res.progress);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    progress,
    loading,
    fetchProgress,
  };
};