import { GlassCard } from "../../adminPanel/Shared/GlassCard";

export const StatCard = ({ title, value, icon: Icon, trend, delay }) => (
  <GlassCard className="p-6" delay={delay}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-text-secondary text-[10px] uppercase tracking-[0.2em] font-bold mb-1">{title}</p>
        <h3 className="text-3xl font-display font-bold text-white">{value}</h3>
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% <span className="text-text-secondary font-normal italic ml-1">vs last month</span>
          </p>
        )}
      </div>
      <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20">
        <Icon className="w-6 h-6 text-accent" />
      </div>
    </div>
  </GlassCard>
);