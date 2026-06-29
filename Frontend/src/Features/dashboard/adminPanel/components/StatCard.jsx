import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { GlassCard } from "../../adminPanel/Shared/GlassCard";

export const StatCard = ({ title, value, icon: Icon, trend, delay, description }) => {
  // Logic to determine if trend is positive, negative, or neutral
  const trendString = trend?.toString() || "";
  const isPositive = trendString.includes("+") || parseFloat(trend) > 0;
  const isNegative = trendString.includes("-") || parseFloat(trend) < 0;
  const isNeutral = !isPositive && !isNegative;

  return (
    <GlassCard 
      className="p-6 relative overflow-hidden group border-white/5 hover:border-accent/30 transition-all duration-500" 
      delay={delay}
    >
      {/* 1. Subtle Background Decorative Glow */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/15 transition-all duration-700" />

      <div className="flex justify-between items-start mb-5">
        <div className="space-y-1">
          {/* Title with tracking-widest for high-end SaaS feel */}
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-white tracking-tight leading-none">
            {value}
          </h3>
        </div>

        {/* Icon Container with Glass Effect */}
        <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20 group-hover:scale-110 group-hover:border-accent/40 transition-all duration-300">
          <Icon className="w-5 h-5 text-accent" />
        </div>
      </div>

      {/* 2. Trend & Analytics Footer */}
      <div className="flex items-center gap-2.5">
        {trend && (
          <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
            isPositive 
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
              : isNegative 
              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
              : 'bg-slate-500/10 text-slate-400 border-white/10'
          }`}>
            {isPositive && <ArrowUpRight size={12} strokeWidth={3} />}
            {isNegative && <ArrowDownRight size={12} strokeWidth={3} />}
            {isNeutral && <Minus size={12} strokeWidth={3} />}
            <span>{trend}</span>
          </div>
        )}
        
        {/* Context description (e.g., "vs last month") */}
        <span className="text-[10px] text-slate-500 font-medium truncate">
          {description || "from previous period"}
        </span>
      </div>

      {/* 3. Bottom Progress Bar (Optional Decoration) */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-accent/20 w-0 group-hover:w-full transition-all duration-700" />
    </GlassCard>
  );
};