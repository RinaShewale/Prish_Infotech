import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const CourseCard = ({ title, category, desc, duration }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="glow-card glass p-6 rounded-2xl group cursor-pointer aspect-square flex flex-col"
    >
      <div className="absolute inset-0 gloss-overlay pointer-events-none opacity-50"></div>

      <div className="relative z-10 h-full flex flex-col">

        <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold block mb-4 italic font-serif">
          {category}
        </span>

        <h3 className="font-display text-2xl mb-2 tracking-tight group-hover:text-text transition-colors">
          {title}
        </h3>

        <p className="text-[#b8a9a6] text-sm font-light leading-relaxed mb-auto">
          {desc}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-border/30 mt-4">

          <span className="text-[10px] uppercase tracking-widest text-text-secondary/50 font-bold">
            {duration}
          </span>

          <span className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            Register <ArrowRight className="w-3 h-3" />
          </span>

        </div>

      </div>
    </motion.div>
  );
};

export default CourseCard;