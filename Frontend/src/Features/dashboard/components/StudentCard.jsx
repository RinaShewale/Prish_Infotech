import React from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";

export const StudentCard = ({ name, role, testimonial, rating, image }) => {
  return (
    <div className="w-[280px] sm:w-[350px] md:w-[400px] shrink-0">
      <motion.div
        whileHover={{ y: -5 }}
        className="glow-card glass p-6 md:p-8 rounded-2xl md:rounded-3xl group relative overflow-hidden border border-white/5 h-full flex flex-col"
      >
        <div className="absolute inset-0 gloss-overlay pointer-events-none opacity-20"></div>

        <div className="relative z-10">

          {/* AVATAR (Same as Nav) */}
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">

            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">

              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-accent font-bold text-lg md:text-xl">
                  {name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}

            </div>

            <div>
              <h3 className="font-display text-base md:text-lg text-white font-medium line-clamp-1">
                {name}
              </h3>
              <p className="text-accent text-[8px] md:text-[10px] uppercase tracking-widest font-bold italic font-serif">
                {role}
              </p>
            </div>

          </div>

          {/* Divider */}
          <div className="h-[1px] w-full bg-white/10 mb-4 md:mb-6" />

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3 md:mb-4">
            <span className="text-white/60 text-[10px] md:text-xs font-bold mr-1 md:mr-2">
              {rating}
            </span>

            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  fill={
                    i < Math.floor(rating || 0)
                      ? "var(--accent, #EAB308)"
                      : "transparent"
                  }
                  className={`${
                    i < Math.floor(rating || 0)
                      ? "text-accent"
                      : "text-white/10"
                  } md:w-[12px] md:h-[12px]`}
                />
              ))}
            </div>
          </div>

          {/* Quote */}
          <p className="text-[#b8a9a6] text-xs md:text-sm font-light leading-relaxed">
            "{testimonial}"
          </p>

        </div>
      </motion.div>
    </div>
  );
};