import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, ArrowUpRight, Medal } from 'lucide-react';

const Leaderboard = () => {
  const users = [
    { name: "Akshansh Saraf", rank: 4, points: "27.76k", trend: 'up' },
    { name: "Vedant Dubey", rank: 5, points: "27.74k", trend: 'up' },
    { name: "Shama Khan", rank: 6, points: "27.57k", trend: 'down' },
    { name: "Akib Ahmed Tahcin", rank: 7, points: "27.17k", trend: 'up' },
    { name: "Saksham Walia", rank: 8, points: "26.66k", trend: 'up' },
  ];

  return (
    <div className="h-full bg-bg2/40 border border-border/50 rounded-[2rem] flex flex-col overflow-hidden backdrop-blur-md">
      {/* Header Area */}
      <div className="p-8 pb-4 shrink-0">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="text-sm font-display font-bold uppercase tracking-[0.2em]">Rankings</h2>
              <p className="text-[10px] text-text-secondary uppercase tracking-widest opacity-60">Global Cohort 2.0</p>
            </div>
          </div>
          <ArrowUpRight size={18} className="text-text-secondary cursor-pointer hover:text-accent transition-colors" />
        </div>

        {/* Cinematic Podium */}
        <div className="flex items-end justify-center gap-3 h-48 mb-6 px-2">
          <PodiumStep 
            name="Bilal" points="28.2k" rank="2" 
            height="h-[65%]" delay={0.2} 
            color="bg-slate-400/20"
          />
          <PodiumStep 
            name="Bhavya" points="28.32k" rank="1" 
            height="h-[85%]" delay={0.1} active
            color="bg-accent/30"
          />
          <PodiumStep 
            name="Prathmesh" points="27.84k" rank="3" 
            height="h-[50%]" delay={0.3}
            color="bg-orange-900/20"
          />
        </div>
      </div>

      {/* Table Headers */}
      <div className="flex px-8 py-3 text-[9px] font-black text-text-secondary uppercase tracking-[0.25em] border-y border-border/30 bg-bg/20">
        <span className="flex-1">Contributor</span>
        <span className="w-12 text-center">Rank</span>
        <span className="w-20 text-right">Points</span>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2">
        {users.map((user, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            key={i}
            className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-border/30 cursor-default"
          >
            <div className="w-8 h-8 rounded-lg bg-bg border border-border flex items-center justify-center text-[10px] font-bold text-text-secondary group-hover:text-accent transition-colors">
              {user.name[0]}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-text-secondary group-hover:text-text transition-colors">{user.name}</p>
            </div>
            <span className="w-12 text-center text-[10px] font-display font-bold opacity-40">{user.rank}</span>
            <span className="w-20 text-right text-xs font-display font-bold text-accent">{user.points}</span>
          </motion.div>
        ))}
      </div>

      
    </div>
  );
};

const PodiumStep = ({ name, points, rank, height, delay, active, color }) => (
  <div className="flex flex-col items-center flex-1 h-full justify-end group">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.2 }}
      className="mb-3 relative"
    >
      <div className={`w-10 h-10 rounded-full border-2 border-bg flex items-center justify-center text-[10px] font-bold ${active ? 'bg-accent text-white' : 'bg-card text-text-secondary'}`}>
        {name[0]}
      </div>
      {active && (
        <motion.div 
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-6 left-1/2 -translate-x-1/2 text-accent"
        >
          <Crown size={14} fill="currentColor" />
        </motion.div>
      )}
    </motion.div>
    
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: height.split('[')[1].split(']')[0] }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`${color} w-full rounded-t-xl border-t border-x border-white/10 relative flex flex-col items-center pt-4 overflow-hidden`}
    >
      <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
      <span className={`text-xs font-display font-black ${active ? 'text-text' : 'text-text-secondary'}`}>
        {rank === "1" ? <Medal size={16} /> : rank + 'th'}
      </span>
      <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mt-1">{points}</span>
    </motion.div>
    <span className="text-[10px] font-bold mt-3 text-text-secondary truncate w-full text-center group-hover:text-text transition-colors">
      {name}
    </span>
  </div>
);

export default Leaderboard;