import { useState, useCallback } from "react";
import { getCourseProgressAPI } from "../service/courseProgress.api";

export const useCourseProgress = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    progress: 0,
    completedLessons: 0,
    totalLessons: 0,
  });

  const fetchProgress = useCallback(async (courseId) => {
    try {
      setLoading(true);

      const res = await getCourseProgressAPI(courseId);

      // ✅ SAFE EXTRACTION (FIXED)
      const data = res?.progress || res?.data?.progress || res;

      setProgress({
        progress: data?.progress || 0,
        completedLessons: data?.completedLessons || 0,
        totalLessons: data?.totalLessons || 0,
        courseCompletedAt: data?.courseCompletedAt || null,
      });

    } catch (err) {
      console.log("Course Progress Error:", err);
      setProgress({
        progress: 0,
        completedLessons: 0,
        totalLessons: 0,
      });
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