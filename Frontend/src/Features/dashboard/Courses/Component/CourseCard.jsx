import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CourseCard({ course }) {
  const navigate = useNavigate(); 
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -12 }}
      className="relative group h-full"
    >
      {/* Background Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 rounded-[2.5rem]" />

      <div className="relative h-full flex flex-col bg-[#1a171c]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 group-hover:border-accent/40 group-hover:bg-[#1a171c]/80 shadow-2xl">
        
        {/* Image Section */}
        <div className="relative h-60 overflow-hidden">
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131014] via-transparent to-transparent opacity-80" />
          
          {/* Tech Tags */}
          <div className="absolute top-5 left-5 flex gap-2">
            {course.techTags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-bold tracking-widest text-white uppercase">
                {tag}
              </span>
            ))}
          </div>

          {/* Live Badge */}
          {course.isLive && (
            <div className="absolute top-5 right-5 px-3 py-1 bg-red-500/10 backdrop-blur-md border border-red-500/40 rounded-full text-[10px] font-bold text-red-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]" />
              LIVE
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-8 flex flex-col flex-grow">
          <h3 className="font-display text-2xl mb-4 leading-tight group-hover:text-accent transition-colors duration-300 text-white">
            {course.title}
          </h3>
          
          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-8">
            {course.features.map((feature) => (
              <div key={feature} className="flex items-center gap-1.5 text-[11px] text-white/50 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                <Zap className="w-3 h-3 text-accent/70" />
                {feature}
              </div>
            ))}
          </div>

          {/* Pricing & Premium CTA */}
          <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Lifetime Access</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-display font-bold text-white">₹{course.price}</span>
                  <span className="text-sm text-white/30 line-through font-light">₹{course.oldPrice}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md font-bold">
                  {Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)}% OFF
                </span>
              </div>
            </div>

            {/* HIGHLY INTERACTIVE BUTTON */}
            <motion.button
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate(`/cohort/${course.slug}`)}
              className="relative w-full group/btn overflow-hidden rounded-2xl py-4 bg-accent flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(146,104,104,0.3)]"
            >
              {/* Shine Effect Animation */}
              <motion.div 
                variants={{
                    hover: { x: ["-100%", "200%"] }
                }}
                onClick={() => navigate(`/cohort/${course.slug}`)}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full"
              />

              <span className="relative z-10 font-display font-bold text-[#131014] text-lg tracking-tight">
                Check Course
              </span>
              
              <motion.div
                variants={{
                  hover: { x: 3, y: -3 }
                }}
                className="relative z-10"
              >
                <ArrowUpRight className="w-5 h-5 text-[#131014] stroke-[2.5px]" />
              </motion.div>

              {/* Internal subtle border */}
              <div className="absolute inset-0 border border-white/20 rounded-2xl pointer-events-none" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}