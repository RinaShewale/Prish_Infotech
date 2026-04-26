import React from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";

const StudentCard = ({ name, role, testimonial, rating, image }) => {
  return (
    <div className="w-[400px] shrink-0 px-4">
      <motion.div
        whileHover={{ y: -5 }}
        className="glow-card glass p-8 rounded-3xl group relative overflow-hidden border border-white/5 h-full flex flex-col"
      >
        {/* Your Theme's Gloss Overlay */}
        <div className="absolute inset-0 gloss-overlay pointer-events-none opacity-20"></div>

        <div className="relative z-10">
          {/* Header: Profile & Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-accent/30 bg-black">
              <img src={image} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
            </div>
            <div>
              <h3 className="font-display text-lg text-white font-medium">{name}</h3>
              <p className="text-accent text-[10px] uppercase tracking-widest font-bold italic font-serif">
                {role}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] w-full bg-white/10 mb-6" />

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            <span className="text-white/60 text-xs font-bold mr-2">{rating}</span>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(rating) ? "var(--accent, #EAB308)" : "transparent"}
                className={i < Math.floor(rating) ? "text-accent" : "text-white/10"}
              />
            ))}
          </div>

          {/* Quote */}
          <p className="text-[#b8a9a6] text-sm font-light leading-relaxed">
            "{testimonial}"
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentCard;