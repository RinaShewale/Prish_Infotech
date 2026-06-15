import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchLessons } from '../redux/lesson.slice';

const StatsHeader = ({ courseId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lessons = [], error } = useSelector((state) => state.lesson);

  useEffect(() => {
    if (courseId) dispatch(fetchLessons(courseId));
  }, [courseId, dispatch]);

  const stats = useMemo(() => {
    const total = lessons.length;
    if (!total) return { percentage: 0, completed: 0, total: 0 };
    const completed = lessons.filter(l => l.completed).length;
    const avg = lessons.reduce((sum, l) => sum + (l.progress || 0), 0) / total;
    return { percentage: Math.round(avg), completed, total };
  }, [lessons]);

  if (error) return <div className="p-4 text-red-500 text-xs">Error: {error}</div>;

  return (
    <div className="bg-bg2/40 backdrop-blur-md border border-border/50 rounded-2xl p-4 shadow-lg">
      {/* Top Row: Navigation + Percentage */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-card border border-border/50 hover:text-accent transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-[10px] font-bold uppercase tracking-wider text-text">Course Progress</h1>
            <p className="text-[10px] text-text-secondary">{stats.completed} / {stats.total} Lessons</p>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-2xl font-black text-text leading-none">{stats.percentage}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${stats.percentage}%` }}
          className="absolute h-full bg-accent"
        />
      </div>

      {/* Bottom Stats (Compact) */}
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
        <span className="text-text-secondary">
          Status: <span className="text-text">{stats.percentage === 100 ? 'Completed' : 'In Progress'}</span>
        </span>
        <span className="text-accent">
          Next: {stats.percentage > 90 ? 'Certificate' : `Module ${Math.floor(stats.completed / 3) + 1}`}
        </span>
      </div>
    </div>
  );
};

export default StatsHeader;