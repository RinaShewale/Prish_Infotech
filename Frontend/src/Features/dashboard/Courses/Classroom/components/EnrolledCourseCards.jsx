import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowUpRight } from 'lucide-react';

const EnrolledCourseCards = ({ course, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative glass glow-card rounded-[2.5rem] p-6 mb-6"
    >
      <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
        <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden border border-border shrink-0">
          <img src={course.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0" alt="" />
        </div>

        <div className="flex-1 w-full space-y-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-display font-bold text-text group-hover:text-accent transition-colors leading-tight">{course.title}</h3>
              <p className="text-xs text-text-secondary/60 font-medium italic mt-1">with {course.instructor}</p>
            </div>
            <ArrowUpRight className="text-text-secondary group-hover:text-accent transition-colors" size={20} />
          </div>

          <div className="flex items-center gap-8">
            <div className="flex-1 space-y-2">
               <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-text-secondary/40">
                  <span>Progress</span>
                  <span className="text-accent">{course.progress}%</span>
               </div>
               <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    className="h-full bg-accent shadow-[0_0_10px_rgba(146,104,104,0.4)]"
                  />
               </div>
            </div>
            
            <button className="flex items-center gap-2 px-8 py-3.5 bg-accent text-text font-display font-bold text-xs uppercase tracking-widest rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-accent/10">
              <Play size={14} fill="currentColor" />
              Resume
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnrolledCourseCards;