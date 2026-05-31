import React from 'react';
import { motion } from 'framer-motion';

const StatsBento = () => {
  const progress = 65;
  const collaborators = [
    "https://i.pravatar.cc/150?u=1",
    "https://i.pravatar.cc/150?u=2",
    "https://i.pravatar.cc/150?u=3"
  ];

  return (
    <div className="glass px-6 pt-4 pb-6 rounded-[2rem] border border-border/50 flex flex-col h-full relative overflow-hidden">
      
      {/* Header Section */}
      <div className="flex flex-col gap-2 mb-1">
        {/* Spinner Icon using theme secondary color */}
        <div className="w-5 h-5 text-text-secondary opacity-50">
            <line x1="12" y1="2" x2="12" y2="6" strokeLinecap="round" />
            <line x1="12" y1="18" x2="12" y2="22" strokeLinecap="round" />
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" strokeLinecap="round" />
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" strokeLinecap="round" />
            <line x1="2" y1="12" x2="6" y2="12" strokeLinecap="round" />
            <line x1="18" y1="12" x2="22" y2="12" strokeLinecap="round" />
        
        </div>
        
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-display font-bold text-text">
            Student Progress
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-border/30 text-[9px] font-bold text-text-secondary uppercase tracking-wider">
            Onboarding prototype
          </span>
        </div>
      </div>

      {/* Large Percentage */}
      <div className="mb-2">
        <h2 className="text-5xl font-bold tracking-tighter text-text">
          {progress}<span className="text-text-secondary opacity-30 ml-1">%</span>
        </h2>
      </div>

      {/* Small, Theme-Consistent Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center">
             <span className="text-[10px] font-bold text-text-secondary uppercase">Current Status</span>
             <span className="text-[10px] font-bold text-accent">Due July 28</span>
        </div>
        
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full bg-accent rounded-full relative"
            style={{
              boxShadow: '0 0 12px var(--accent)', // Uses your theme's accent color for the glow
            }}
          >
            {/* Subtle gloss effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </div>
      </div>

    
    </div>
  );
};

export default StatsBento;