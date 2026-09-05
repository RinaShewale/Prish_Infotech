import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, ArrowUpRight, Medal, ChevronLeft } from 'lucide-react';

// IMPORTANT: Ensure this path points to your actual slice file
import { fetchTopUsers } from '../../../Courses/Classroom/redux/leaderboard.slice'; 

const Leaderboard = ({ courseId }) => {
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);

  const { topUsers = [], loading, error } = useSelector(
    (state) => state.leaderboard || {}
  );

  useEffect(() => {
    if (courseId) {
      // Fetching 20 users for the "View All" mode
      dispatch(fetchTopUsers({ courseId, limit: 20 }));
    }
  }, [courseId, dispatch]);

  const podiumUsers = useMemo(() => {
    return (topUsers || []).slice(0, 3).map((user, idx) => ({
      name: user.name || `User ${idx + 1}`,
      points: user.points || 0,
      rank: idx + 1,
    }));
  }, [topUsers]);

  const usersList = useMemo(() => {
    return (topUsers || []).map((user, index) => ({
      name: user.name || "Anonymous",
      rank: index + 1,
      points: user.points || 0,
    }));
  }, [topUsers]);

  return (
    <div className="relative h-full bg-bg2/40 border border-border/50 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col overflow-hidden backdrop-blur-md shadow-xl transition-all duration-500">
      
      {/* Header Section */}
      <div className="p-6 md:p-8 pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shadow-inner border border-accent/20"
            >
              <Trophy size={20} />
            </motion.div>
            <div>
              <h2 className="text-xs md:text-sm font-display font-bold uppercase tracking-widest">
                {showAll ? 'All Contributors' : 'Leaderboard'}
              </h2>
              <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] opacity-50">
                Global Cohort 2.0
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowAll(!showAll)}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-accent/10 border border-white/10 hover:border-accent/30 transition-all"
          >
            <span className="text-[10px] font-bold uppercase tracking-tighter text-text-secondary group-hover:text-accent">
              {showAll ? 'Back' : 'View All'}
            </span>
            {showAll ? (
               <ChevronLeft size={14} className="text-text-secondary group-hover:text-accent" />
            ) : (
              <ArrowUpRight size={14} className="text-text-secondary group-hover:text-accent" />
            )}
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {!showAll ? (
            /* --- PODIUM VIEW (TOP 3) --- */
            <motion.div
              key="podium"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col justify-center px-4 pb-8"
            >
              {error ? (
                <div className="text-center py-10 text-red-400 text-xs uppercase tracking-widest">Failed to load rankings</div>
              ) : (
                <div className="flex items-end justify-center gap-2 md:gap-6 h-64">
                  {/* 2nd Place */}
                  {podiumUsers[1] && (
                    <PodiumStep
                      user={podiumUsers[1]}
                      height="h-[45%]"
                      delay={0.1}
                      color="bg-white/[0.03]"
                      borderColor="border-white/10"
                    />
                  )}

                  {/* 1st Place */}
                  {podiumUsers[0] && (
                    <PodiumStep
                      user={podiumUsers[0]}
                      height="h-[70%]"
                      delay={0}
                      active
                      color="bg-accent/10"
                      borderColor="border-accent/30"
                    />
                  )}

                  {/* 3rd Place */}
                  {podiumUsers[2] && (
                    <PodiumStep
                      user={podiumUsers[2]}
                      height="h-[30%]"
                      delay={0.2}
                      color="bg-orange-500/5"
                      borderColor="border-orange-500/10"
                    />
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            /* --- FULL LIST VIEW (TOP 20) --- */
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              {/* Table Header */}
              <div className="flex px-6 md:px-10 py-3 text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] border-y border-border/20 bg-white/[0.02]">
                <span className="flex-1">Contributor</span>
                <span className="w-12 text-center">Rank</span>
                <span className="w-20 text-right">Points</span>
              </div>

              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2">
                {loading ? (
                  <div className="flex items-center justify-center h-full opacity-40 text-[10px] uppercase tracking-widest">Loading...</div>
                ) : (
                  usersList.map((user, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      key={i}
                      className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all border border-transparent hover:border-white/10 ${i < 3 ? 'bg-accent/[0.03]' : 'hover:bg-white/[0.03]'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 shrink-0 rounded-xl border flex items-center justify-center text-[10px] font-bold transition-colors uppercase
                        ${i === 0 ? 'bg-accent text-white border-accent' : 'bg-bg2 border-border/50 text-text-secondary group-hover:text-accent'}`}>
                        {user.name[0]}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-text-secondary group-hover:text-text transition-colors truncate">
                          {user.name}
                        </p>
                      </div>

                      {/* Rank Badge */}
                      <span className={`w-12 text-center text-[10px] font-black italic
                        ${i === 0 ? 'text-accent' : 'opacity-30 group-hover:opacity-100'}`}>
                        #{user.rank}
                      </span>

                      {/* Points */}
                      <span className="w-20 text-right text-xs font-display font-black text-accent/80 group-hover:text-accent">
                        {user.points.toLocaleString()}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* --- Refined PodiumStep --- */
const PodiumStep = ({ user, height, delay, active, color, borderColor }) => (
  <div className="flex flex-col items-center justify-end h-full flex-1 min-w-[80px] max-w-[120px] group">
    {/* Avatar / Crown */}
    <motion.div
      initial={{ scale: 0, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ delay: delay + 0.2, type: "spring", stiffness: 100 }}
      className="mb-4 relative"
    >
      <div className={`
        w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-sm md:text-lg font-black
        transition-all duration-500 group-hover:scale-110 border-2 uppercase
        ${active 
          ? 'bg-accent text-white border-accent shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)]' 
          : 'bg-bg2/80 text-text-secondary border-border/50 backdrop-blur-sm'}
      `}>
        {user.name[0]}
      </div>

      {active && (
        <motion.div
          animate={{ y: [0, -4, 0], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute -top-6 left-1/2 -translate-x-1/2 text-accent"
        >
          <Crown size={20} fill="currentColor" />
        </motion.div>
      )}
    </motion.div>

    {/* The Pillar */}
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: '100%' }} 
      className={`
        ${color} ${borderColor} ${height}
        w-full rounded-t-2xl border-t border-x 
        relative flex flex-col items-center pt-4 overflow-hidden shadow-2xl
      `}
    >
      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
      
      <div className={`flex flex-col items-center z-10 ${active ? 'text-accent' : 'text-text-secondary'}`}>
        {user.rank === 1 ? (
          <Medal size={20} className="mb-1" />
        ) : (
          <span className="text-[10px] font-black italic mb-1 opacity-60">
            {user.rank === 2 ? "2nd" : "3rd"}
          </span>
        )}
        <span className="text-xs md:text-sm font-black tracking-tighter">
          {user.points.toLocaleString()}
        </span>
      </div>
    </motion.div>

    {/* Name Label */}
    <div className="w-full pt-3">
      <p className={`
        text-[10px] md:text-xs font-black truncate text-center transition-colors px-1 uppercase tracking-tight
        ${active ? 'text-text' : 'text-text-secondary/60'}
      `}>
        {user.name}
      </p>
    </div>
  </div>
);

export default Leaderboard;