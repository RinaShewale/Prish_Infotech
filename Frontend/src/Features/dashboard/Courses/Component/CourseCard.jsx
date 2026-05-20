import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  // Create a URL-friendly slug from the backend title
  const generateSlug = (title) => title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

  return (
    <motion.div whileHover={{ y: -12 }} className="relative group h-full">
      <div className="absolute -inset-1 bg-linear-to-r from-accent/0 via-accent/20 to-accent/0 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 rounded-[2.5rem]" />
      
      <div className="relative h-full flex flex-col bg-[#1a171c]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 group-hover:border-accent/40 group-hover:bg-[#1a171c]/80 shadow-2xl">
        
        {/* Image Section */}
        <div className="relative h-60 overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-5 left-5 flex gap-2">
            <span className="px-3 py-1 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-bold tracking-widest text-white uppercase">
              {course.category || "Cohort"}
            </span>
            <span className="px-3 py-1 bg-accent/20 backdrop-blur-xl border border-accent/20 rounded-full text-[10px] font-bold tracking-widest text-white uppercase">
              {course.level || "Beginner"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 flex flex-col grow">
          <h3 className="font-display text-2xl mb-4 leading-tight group-hover:text-accent transition-colors duration-300 text-white">
            {course.title}
          </h3>
          <p className="text-white/50 text-sm mb-6 line-clamp-2">{course.description}</p>

          <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Lifetime Access</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-display font-bold text-white">₹{course.price}</span>
                  <span className="text-sm text-white/30 line-through font-light">₹{Math.round(course.price * 2.5)}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md font-bold">60% OFF</span>
              </div>
            </div>

            <motion.button
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                window.scrollTo(0, 0);
                navigate(`/cohort/${generateSlug(course.title)}`);
              }}
              className="relative w-full group/btn overflow-hidden rounded-2xl py-4 bg-accent flex items-center justify-center gap-2"
            >
              <span className="relative z-10 font-display font-bold text-bg text-lg">Check Course</span>
              <ArrowUpRight className="relative z-10 w-5 h-5 text-bg" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}