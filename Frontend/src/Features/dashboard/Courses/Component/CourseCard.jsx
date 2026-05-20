import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Zap, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const isLive = course.type === "live";

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

          {/* Top Tags on Image */}
          <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
            {/* Level Tag */}
            <span className="px-3 py-1 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-bold tracking-widest text-white uppercase">
              {course.level || "Beginner"}
            </span>

            {/* LIVE Badge */}
            {isLive && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-full shadow-lg border border-white/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Live</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 flex flex-col grow">
          <h3 className="font-display text-2xl mb-3 leading-tight group-hover:text-accent transition-colors duration-300 text-white">
            {course.title}
          </h3>
          
          <p className="text-white/50 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          {/* CATEGORIES MOVED HERE (Below Description) */}
          <div className="flex flex-wrap gap-2 mb-6">
            {course.category?.map((cat, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/[0.03] border border-white/10 rounded-md text-[9px] font-bold tracking-wider text-white/40 uppercase"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">{course.accessDuration}</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-display font-bold text-white">₹{course.price}</span>
                  <span className="text-sm text-white/30 line-through font-light">
                    ₹{course.oldPrice}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md font-bold">SAVINGS</span>
              </div>
            </div>

            <motion.button
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                window.scrollTo(0, 0);
                navigate(`/cohort/${course.slug}`);
              }}
              className="relative w-full group/btn overflow-hidden rounded-2xl py-4 bg-accent flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span className="relative z-10 font-display font-bold text-bg text-lg">Check Course</span>
              <ArrowUpRight className="relative z-10 w-5 h-5 text-bg group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}