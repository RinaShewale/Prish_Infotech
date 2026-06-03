import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Trophy, Crown, ArrowUpRight, Medal } from 'lucide-react';
import { fetchTopUsers } from '../leaderboard.slice';

const Leaderboard = ({ courseId }) => {
  const dispatch = useDispatch();

  const { topUsers = [], loading, error } = useSelector(
    (state) => state.leaderboard
  );

  useEffect(() => {
    if (courseId) {
      dispatch(fetchTopUsers({ courseId, limit: 10 }));
    }
  }, [courseId, dispatch]);

  const podiumUsers = useMemo(() => {
    return topUsers.slice(0, 3).map((user, idx) => ({
      name: user.name || `User ${idx + 1}`,
      points: user.points || "0",
      rank: String(idx + 1),
    }));
  }, [topUsers]);

  const users = useMemo(() => {
    if (!topUsers || topUsers.length === 0) return [];
    return topUsers.map((user, index) => ({
      name: user.name || "Anonymous",
      rank: index + 1,
      points: user.points || 0,
    }));
  }, [topUsers]);

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
              <p className="text-[10px] text-text-secondary uppercase tracking-widest opacity-60">
                {loading ? 'Loading...' : 'Global Cohort 2.0'}
              </p>
            </div>
          </div>
          <ArrowUpRight size={18} className="text-text-secondary cursor-pointer hover:text-accent transition-colors" />
        </div>

        {/* Cinematic Podium Section */}
        {error ? (
          <div className="text-red-500 text-sm mb-6 text-center">Error loading leaderboard</div>
        ) : (
          <div className="flex items-end justify-center gap-3 sm:gap-5 h-52 mb-6 px-2">
            
            {/* 2nd Place (Left) */}
            {podiumUsers[1] && (
              <PodiumStep
                name={podiumUsers[1].name}
                points={podiumUsers[1].points}
                rank="2"
                height="h-[60%]"
                delay={0.3}
                color="bg-white/5"
                borderColor="border-slate-400/20"
              />
            )}

            {/* 1st Place (Center) */}
            {podiumUsers[0] && (
              <PodiumStep
                name={podiumUsers[0].name}
                points={podiumUsers[0].points}
                rank="1"
                height="h-[85%]"
                delay={0.1}
                active
                color="bg-accent/20"
                borderColor="border-accent/40"
              />
            )}

            {/* 3rd Place (Right) */}
            {podiumUsers[2] && (
              <PodiumStep
                name={podiumUsers[2].name}
                points={podiumUsers[2].points}
                rank="3"
                height="h-[45%]"
                delay={0.5}
                color="bg-orange-900/10"
                borderColor="border-orange-900/20"
              />
            )}
          </div>
        )}
      </div>

      {/* Table Headers */}
      <div className="flex px-8 py-3 text-[9px] font-black text-text-secondary uppercase tracking-[0.25em] border-y border-border/30 bg-bg/20">
        <span className="flex-1">Contributor</span>
        <span className="w-12 text-center">Rank</span>
        <span className="w-20 text-right">Points</span>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2">
        {loading ? (
          <div className="flex items-center justify-center h-full text-xs opacity-50">Loading...</div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-secondary text-sm">No leaderboard data</p>
          </div>
        ) : (
          users.map((user, i) => (
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
          ))
        )}
      </div>
    </div>
  );
};

/* --- Updated PodiumStep Sub-component --- */
const PodiumStep = ({ name, points, rank, height, delay, active, color, borderColor }) => (
  <div className="flex flex-col items-center flex-1 h-full justify-end group min-w-0">
    {/* Avatar Area */}
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.2, type: "spring" }}
      className="mb-4 relative z-10"
    >
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold
        transition-all duration-500 group-hover:scale-110 border-2
        ${active 
          ? 'bg-accent text-white border-accent shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]' 
          : 'bg-card text-text-secondary border-transparent'}
      `}>
        {name[0]}
      </div>

      {active && (
        <motion.div
          animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute -top-7 left-1/2 -translate-x-1/2 text-accent"
        >
          <Crown size={16} fill="currentColor" />
        </motion.div>
      )}
    </motion.div>

    {/* Step Glass Bar */}
    <motion.div
      initial={{ height: 0 }}
      animate={{ height }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`
        ${color} ${borderColor} w-full rounded-t-2xl border-t border-x 
        relative flex flex-col items-center pt-4 overflow-hidden backdrop-blur-md
      `}
    >
      {/* Lighting Glint */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      
      <div className={`flex flex-col items-center gap-1 ${active ? 'text-accent' : 'text-text-secondary/60'}`}>
        {rank === "1" ? (
          <Medal size={20} className="mb-1" />
        ) : (
          <span className="text-[10px] font-black tracking-tighter italic">
            {rank === "2" ? "2nd" : "3rd"}
          </span>
        )}
        <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-80">
          {points}
        </span>
      </div>
    </motion.div>

    {/* Name Label */}
    <div className="w-full pt-3">
      <p className={`
        text-[11px] font-bold truncate text-center transition-colors 
        ${active ? 'text-text' : 'text-text-secondary'}
        group-hover:text-accent
      `}>
        {name}
      </p>
    </div>
  </div>
);

export default Leaderboard;