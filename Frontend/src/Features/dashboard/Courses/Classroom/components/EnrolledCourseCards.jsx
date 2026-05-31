import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const EnrolledCourseCards = ({ course, index }) => {
  const navigate = useNavigate(); // 2. Initialize navigate

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, ease: "easeOut" }}
      className="group relative mb-4"
    >
      {/* Background Glow Effect on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-transparent rounded-[1.6rem] opacity-0 group-hover:opacity-100 transition duration-500 blur" />
      
      <div className="relative glass border border-white/10 backdrop-blur-md rounded-[1.5rem] p-3 md:p-4 overflow-hidden transition-all duration-300 group-hover:border-white/20">
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          
          {/* Left: Image Section */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 md:w-28 md:h-20 rounded-2xl overflow-hidden border border-white/5 shrink-0 shadow-2xl">
              <img 
                src={course.image} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                alt={course.title} 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
              {/* Mobile Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center md:hidden">
                 <div className="p-1.5 rounded-full bg-accent/90 text-text shadow-lg">
                    <Play size={12} fill="currentColor" />
                 </div>
              </div>
            </div>

            {/* Title & Instructor (Mobile View Visible Next to Image) */}
            <div className="flex-1 min-w-0 md:hidden">
                <h3 className="text-sm font-bold text-text truncate leading-tight group-hover:text-accent transition-colors">
                  {course.title}
                </h3>
                <p className="text-[10px] text-text-secondary/60 font-medium mt-1">
                  {course.instructor}
                </p>
            </div>
          </div>

          {/* Right: Main Content Container */}
          <div className="flex flex-1 flex-col md:flex-row md:items-center gap-4 md:gap-8">
            
            {/* Desktop Title & Details */}
            <div className="hidden md:block flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base lg:text-lg font-display font-bold text-text truncate group-hover:text-accent transition-colors">
                  {course.title}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-text-secondary/60">
                <span className="font-medium">by {course.instructor}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1">
                    <Clock size={10} /> 12h 30m total
                </span>
              </div>
            </div>

            {/* Progress Section */}
            <div className="flex-1 md:max-w-[200px] lg:max-w-[240px]">
               <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/40">
                    Course Progress
                  </span>
                  <span className="text-[11px] font-bold text-accent">
                    {course.progress}%
                  </span>
               </div>
               <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-accent/60 rounded-full"
                  />
                  {/* Glowing tip of progress bar */}
                  <motion.div 
                    initial={{ left: 0 }}
                    animate={{ left: `${course.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute top-0 bottom-0 w-4 -ml-2 bg-accent/30 blur-sm"
                  />
               </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0 pt-3 md:pt-0 border-t border-white/5 md:border-0">
                <span className="md:hidden text-[10px] text-text-secondary/40 italic">
                  Last watched 2 days ago
                </span>
                <button 
                   onClick={() => navigate(`/classroom/course/${course.id}`)}// 4. Attach Click Event
                  className="group/btn relative flex items-center justify-center gap-2 px-6 py-2.5 md:py-3 bg-accent text-text font-display font-bold text-[10px] uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] transition-all active:scale-95 shrink-0 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Play size={12} fill="currentColor" className="group-hover/btn:scale-110 transition-transform" />
                    <span>Resume</span>
                  </span>
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </button>
            </div>
            
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnrolledCourseCards;