import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { fetchLessons } from '../lesson.slice';

const StatsHeader = ({ courseId }) => {
  const dispatch = useDispatch();
  

  const { lessons = [], loading, error } = useSelector(
    (state) => state.lesson
  );
  

  useEffect(() => {
    if (courseId) {
      dispatch(fetchLessons(courseId));
    }
  }, [courseId, dispatch]);

  // Calculate progress from lesson progress data
  const progress = useMemo(() => {
    if (!lessons.length) {
      return {
        percentage: 0,
        completed: 0,
        total: 0,
      };
    }

    const totalLessons = lessons.length;

    const completedLessons = lessons.filter(
      (lesson) => lesson.completed
    ).length;

    const totalProgress = lessons.reduce(
      (sum, lesson) => sum + (lesson.progress || 0),
      0
    );

    const averageProgress =
      totalProgress / totalLessons;

    return {
      percentage: Math.round(averageProgress),
      completed: completedLessons,
      total: totalLessons,
    };
  }, [lessons]);

  return (
    <div className="bg-bg2 border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <ArrowLeft
          size={18}
          className="text-text-secondary cursor-pointer hover:text-text"
        />

        <h1 className="text-lg font-medium tracking-tight">
          Course Progress
        </h1>
      </div>

      {error ? (
        <div className="text-red-500 text-sm">
          Error loading progress: {error}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-accent/80 tracking-wide">
              {progress.percentage}% Complete
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="h-1 w-full bg-card rounded-full overflow-hidden">
            <div
              className="h-full bg-accent/60 shadow-[0_0_10px_rgba(146,104,104,0.4)] transition-all duration-700"
              style={{
                width: `${progress.percentage}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-[11px] font-medium text-text-secondary uppercase tracking-wider">
            <div>
              Lessons:{' '}
              <span className="text-text">
                {progress.completed}/{progress.total}
              </span>
            </div>

            <div>
              Progress:{' '}
              <span className="text-accent">
                {progress.percentage}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsHeader;