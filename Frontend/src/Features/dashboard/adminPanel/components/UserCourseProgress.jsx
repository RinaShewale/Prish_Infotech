import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCourseProgress } from "../../Courses/Classroom/hook/useCourseProgress";
import { GlassCard } from "../Shared/GlassCard";
import { Loader } from "lucide-react";

const UserCourseProgress = () => {
  const { courseId } = useParams();

  const {
    progress,
    loading,
    fetchProgress,
  } = useCourseProgress();

  useEffect(() => {
    if (courseId) {
      fetchProgress(courseId);
    }
  }, [courseId]);

  return (
    <div className="p-6 space-y-6">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Course Progress
        </h1>
        <p className="text-text-secondary text-sm">
          Track your learning progress
        </p>
      </div>

      {/* CARD */}
      <GlassCard className="p-6 space-y-5">
        {loading ? (
          <div className="flex items-center gap-2 text-text-secondary">
            <Loader className="w-4 h-4 animate-spin" />
            Loading progress...
          </div>
        ) : (
          <>
            {/* PROGRESS BAR */}
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
              <div
                className="h-3 bg-green-500 rounded-full transition-all duration-300"
                style={{
                  width: `${progress.progress || 0}%`,
                }}
              />
            </div>

            {/* PERCENTAGE */}
            <p className="text-sm text-white">
              Progress:{" "}
              <span className="text-green-400 font-bold">
                {progress.progress || 0}%
              </span>
            </p>

            {/* LESSON INFO */}
            <div className="text-sm text-text-secondary space-y-1">
              <p>
                Completed Lessons:{" "}
                <span className="text-white">
                  {progress.completedLessons || 0}
                </span>
              </p>

              <p>
                Total Lessons:{" "}
                <span className="text-white">
                  {progress.totalLessons || 0}
                </span>
              </p>
            </div>

            {/* COMPLETION DATE */}
            {progress.courseCompletedAt && (
              <p className="text-green-400 text-sm font-medium">
                🎉 Completed on:{" "}
                {new Date(
                  progress.courseCompletedAt
                ).toLocaleDateString()}
              </p>
            )}

            {/* STATUS */}
            <div>
              {progress.progress === 100 ? (
                <span className="px-3 py-1 text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-full">
                  Course Completed
                </span>
              ) : (
                <span className="px-3 py-1 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                  In Progress
                </span>
              )}
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
};

export default UserCourseProgress;