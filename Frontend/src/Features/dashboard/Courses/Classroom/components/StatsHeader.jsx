import React from 'react';
import { ArrowLeft } from 'lucide-react';

const StatsHeader = () => {
  return (
    <div className="bg-bg2 border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <ArrowLeft size={18} className="text-text-secondary cursor-pointer hover:text-text" />
        <h1 className="text-lg font-medium tracking-tight">2.0 Job Ready AI Powered Cohort</h1>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-accent/80 tracking-wide">10.07% Complete</span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-1 w-full bg-card rounded-full overflow-hidden">
          <div className="h-full bg-accent/60 w-[10.07%] shadow-[0_0_10px_rgba(146,104,104,0.4)]" />
        </div>

        <div className="flex justify-between text-[11px] font-medium text-text-secondary uppercase tracking-wider">
          <div>Modules: <span className="text-text">4/9</span></div>
          <div>Sub-Modules: <span className="text-text">173/318</span></div>
          <div>Score: <span className="text-accent">2.88k/28.57k</span></div>
        </div>
      </div>
    </div>
  );
};

export default StatsHeader;