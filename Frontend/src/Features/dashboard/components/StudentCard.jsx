import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";

export const StudentCard = ({ name, role, testimonial, rating, image }) => {
  const [imgError, setImgError] = useState(false);
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      // Responsive Width: 280px on mobile, 340px on desktop
      className="glow-card glass group relative w-[280px] sm:w-[310px] md:w-[340px] shrink-0 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 flex flex-col justify-between h-[230px] md:h-[250px]"
    >
      <div className="noise-bg" />
      <div className="gloss-overlay absolute inset-0 pointer-events-none" />

      {/* TOP: Profile Info */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-bg2 border border-accent/20 flex items-center justify-center overflow-hidden">
            {image && !imgError ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-accent font-display font-bold text-base md:text-lg">
                {initial}
              </span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-bg rounded-full p-0.5 border border-border">
            <CheckCircle2 size={10} className="md:size-3 text-accent" />
          </div>
        </div>

        <div className="overflow-hidden">
          <h4 className="font-display text-text font-bold text-sm md:text-base truncate tracking-tight">
            {name}
          </h4>
          <p className="text-accent/60 text-[9px] md:text-[10px] uppercase tracking-widest font-bold">
            {role || "Verified Student"}
          </p>
        </div>
      </div>

      {/* MIDDLE: Testimonial */}
      <div className="relative z-10 mt-3 md:mt-4 flex-grow">
        <p className="font-serif italic text-text/80 text-xs md:text-[15px] leading-relaxed line-clamp-3 tracking-wide">
          "{testimonial}"
        </p>
      </div>

      {/* BOTTOM: Rating */}
      <div className="relative z-10 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border/40 flex justify-between items-center">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={10}
              fill={i < Math.floor(rating || 5) ? "var(--color-accent)" : "none"}
              className={i < Math.floor(rating || 5) ? "text-accent" : "text-border/30"}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};