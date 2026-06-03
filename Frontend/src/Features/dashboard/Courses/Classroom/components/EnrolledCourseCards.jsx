import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnrolledCourseCards = ({ course, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative w-full"
    >
      <div className="relative glass border border-white/10 rounded-[1.5rem] p-4 transition-all hover:border-white/20">
        {/* flex-col on mobile, sm:flex-row on tablet+ to prevent squeezing */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
          
          {/* Thumb and Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <img 
              src={course.image} 
              className="w-14 h-14 md:w-20 md:h-20 rounded-2xl object-cover shrink-0 border border-white/5 shadow-lg" 
              alt={course.title} 
            />
            <div className="min-w-0 flex-1">
              {/* line-clamp prevents the title from squeezing the button and progress */}
              <h3 className="text-base font-bold text-text line-clamp-1 group-hover:text-accent transition-colors">
                {course.title}
              </h3>
              <p className="text-xs text-text-secondary/60">by {course.instructor}</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="w-full sm:w-32 md:w-48 shrink-0">
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px] uppercase text-text-secondary/40 font-bold tracking-wider">Progress</span>
              <span className="text-[11px] font-bold text-accent">{Math.round(course.progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-accent"
              />
            </div>
          </div>

          {/* Button */}
          <button 
            onClick={() => navigate(`/classroom/course/${course.id}`)}
            className="flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 bg-accent text-black font-bold text-[10px] uppercase rounded-xl hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto shadow-lg shadow-accent/20"
          >
            <Play size={12} fill="currentColor" /> Resume
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EnrolledCourseCards;