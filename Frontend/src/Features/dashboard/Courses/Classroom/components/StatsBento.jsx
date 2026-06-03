import React from 'react';
import { motion } from 'framer-motion';

const StatsBento = ({ progress = 0 }) => {
  const displayVal = Math.round(progress || 0);

  return (
    // Changed h-full to min-h-fit to prevent clipping
    <div className="glass px-6 pt-4 pb-6 rounded-[2rem] border border-border/50 flex flex-col min-h-fit relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-display font-bold text-text">
          Overall Progress
        </h3>
        <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-text-secondary uppercase">
          Live
        </span>
      </div>

      <div className="mb-2">
        <h2 className="text-5xl font-bold text-text">
          {displayVal}
          <span className="text-text-secondary opacity-40 ml-1">
            %
          </span>
        </h2>
      </div>

      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] uppercase text-text-secondary">
          Current Status
        </span>
        <span className="text-[10px] font-bold text-accent">
          {progress >= 100 ? "Completed" : "In Progress"}
        </span>
      </div>

      {/* PROGRESS LINE CONTAINER */}
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
          // If bg-accent doesn't show up, it's a Tailwind config issue. 
          // I added a style fallback to ensure it's visible.
          className="h-full bg-accent rounded-full"
          style={{ backgroundColor: 'var(--accent, #926868)' }} 
        />
      </div>
    </div>
  );
};

export default StatsBento;