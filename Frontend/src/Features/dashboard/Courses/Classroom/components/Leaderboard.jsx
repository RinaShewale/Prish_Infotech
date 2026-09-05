import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, ArrowUpRight, Medal, ChevronLeft } from 'lucide-react';

// IMPORTANT: Ensure this path points to your actual slice file
import { fetchTopUsers } from '../../../Courses/Classroom/redux/leaderboard.slice'; 

const Leaderboard = ({ courseId }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);

  const { topUsers = [], loading, error } = useSelector(
    (state) => state.leaderboard || {}
  );

  useEffect(() => {
    // Fetch 20 users so we have enough data for the expanded view
    if (courseId && typeof fetchTopUsers === 'function') {
      dispatch(fetchTopUsers({ courseId, limit: 20 }));
    }
  }, [courseId, dispatch]);

  // Always exactly top 3 for the podium
  const podiumUsers = useMemo(() => {
    return (topUsers || []).slice(0, 3).map((user, idx) => ({
      ...user,
      name: user.name || `User ${idx + 1}`,
      points: user.points || 0,
      rank: idx + 1,
    }));
  }, [topUsers]);

  // Determine list size based on state
  const usersList = useMemo(() => {
    const list = isExpanded ? (topUsers || []).slice(0, 20) : (topUsers || []).slice(0, 10);
    return list.map((user, index) => ({
      ...user,
      name: user.name || "Anonymous",
      rank: index + 1,
      points: user.points || 0,
    }));
  }, [topUsers, isExpanded]);

  return (
    <div className="h-full bg-bg2/40 border border-border/50 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col overflow-hidden backdrop-blur-md shadow-xl transition-all duration-500">
      
      {/* Header */}
      <div className="p-4 md:p-8 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent/10 flex items-center justify-center text-accent shadow-inner">
              <Trophy size={18} />
            </div>
            <div>
              <h2 className="text-[10px] md:text-sm font-display font-bold uppercase tracking-[0.15em] md:tracking-[0.2em]">
                {isExpanded ? 'Full Rankings' : 'Leaderboard'}
              </h2>
              <p className="text-[8px] md:text-[10px] text-text-secondary uppercase tracking-widest opacity-50">
                {loading ? 'Refreshing...' : 'Global Cohort 2.0'}
              </p>
            </div>
          </div>
          
          {/* Toggle Button */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-full transition-all group"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary group-hover:text-accent">
              {isExpanded ? 'Back' : 'View All'}
            </span>
            {isExpanded ? (
                <ChevronLeft size={16} className="text-accent" />
            ) : (
                <ArrowUpRight size={16} className="text-text-secondary group-hover:text-accent" />
            )}
          </button>
        </div>

        {/* Podium Section - Hidden when expanded to show full list */}
        <AnimatePresence mode="wait">
          {!isExpanded && (
            <motion.div 
              key="podium"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-end justify-center gap-1 md:gap-6 h-36 md:h-56 mb-4 overflow-hidden"
            >
              {error ? (
                <div className="flex items-center justify-center text-red-400 text-[10px]">Failed to load rankings</div>
              ) : (
                <>
                  {/* 2nd Place */}
                  {podiumUsers[1] && (
                    <PodiumStep
                      user={podiumUsers[1]}
                      height="h-[40%] md:h-[45%]"
                      delay={0.1}
                      color="bg-white/5"
                      borderColor="border-white/10"
                    />
                  )}

                  {/* 1st Place */}
                  {podiumUsers[0] && (
                    <PodiumStep
                      user={podiumUsers[0]}
                      height="h-[65%] md:h-[75%]"
                      delay={0}
                      active
                      color="bg-accent/15"
                      borderColor="border-accent/30"
                    />
                  )}

                  {/* 3rd Place */}
                  {podiumUsers[2] && (
                    <PodiumStep
                      user={podiumUsers[2]}
                      height="h-[25%] md:h-[30%]"
                      delay={0.2}
                      color="bg-orange-500/5"
                      borderColor="border-orange-500/10"
                    />
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table Labels */}
      <div className="flex px-4 md:px-8 py-2.5 text-[8px] md:text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] border-y border-border/20 bg-white/[0.01] items-center">
        <span className="flex-1">Contributor</span>
        <span className="hidden sm:block w-12 text-center">Rank</span>
        <span className="w-16 md:w-20 text-right">Points</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 md:px-4 py-2">
        {loading && usersList.length === 0 ? (
          <div className="flex items-center justify-center h-full opacity-40 text-[10px]">Loading...</div>
        ) : usersList.length === 0 ? (
          <div className="flex items-center justify-center h-full opacity-40 text-[10px]">No entries yet</div>
        ) : (
          usersList.map((user, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              key={user.rank}
              className={`group flex items-center gap-3 px-2 md:px-4 py-3 rounded-xl md:rounded-2xl transition-all border border-transparent hover:border-border/10 ${
                user.rank <= 3 && isExpanded ? 'bg-accent/5' : 'hover:bg-white/[0.03]'
              }`}
            >
              {/* Avatar Icon - USING NAV LOGIC */}
              <div className="w-8 h-8 shrink-0 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-lg object-cover border border-border/50"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-bg2 border border-border/50 flex items-center justify-center text-[10px] font-bold text-text-secondary group-hover:text-accent transition-colors uppercase">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-[11px] md:text-xs font-semibold text-text-secondary group-hover:text-text transition-colors truncate">
                  {user.name}
                </p>
                <p className="sm:hidden text-[8px] text-text-secondary/40 font-bold uppercase">
                  Rank #{user.rank}
                </p>
              </div>

              {/* Rank column */}
              <span className={`hidden sm:block w-12 text-center text-[10px] font-bold ${user.rank <= 3 ? 'text-accent' : 'opacity-30'}`}>
                {user.rank}
              </span>

              {/* Points */}
              <span className="w-16 md:w-20 text-right text-[11px] md:text-xs font-display font-bold text-accent/90 group-hover:text-accent">
                {user.points.toLocaleString()}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

/* --- PodiumStep with Avatar Logic --- */
const PodiumStep = ({ user, height, delay, active, color, borderColor }) => (
  <div className="flex flex-col items-center justify-end h-full flex-1 min-w-[60px] max-w-[110px] group">
    {/* Avatar - USING NAV LOGIC */}
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: delay + 0.1, type: "spring", stiffness: 200 }}
      className="mb-1.5 md:mb-3 relative"
    >
      <div className={`
        w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center overflow-hidden
        transition-all duration-500 group-hover:scale-110 border-2
        ${active ? 'border-accent shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]' : 'border-border/50'}
      `}>
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-[10px] md:text-sm font-bold uppercase
            ${active ? 'bg-accent text-white' : 'bg-bg2 text-text-secondary'}
          `}>
            {user?.name?.charAt(0)}
          </div>
        )}
      </div>

      {active && (
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute -top-4 md:-top-5 left-1/2 -translate-x-1/2 text-accent"
        >
          <Crown size={14} className="md:w-5 md:h-5" fill="currentColor" />
        </motion.div>
      )}
    </motion.div>

    <motion.div
      initial={{ height: 0 }}
      animate={{ height: '100%' }}
      className={`
        ${color} ${borderColor} ${height}
        w-full rounded-t-lg md:rounded-t-2xl border-t border-x 
        relative flex flex-col items-center pt-2 md:pt-4 overflow-hidden
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent" />
      
      <div className={`flex flex-col items-center z-10 ${active ? 'text-accent' : 'text-text-secondary/50'}`}>
        {user.rank === 1 ? (
          <Medal size={12} className="md:w-5 md:h-5 mb-0.5 md:mb-1" />
        ) : (
          <span className="text-[7px] md:text-[10px] font-black italic mb-0.5 md:mb-1">
            {user.rank === 2 ? "2nd" : "3rd"}
          </span>
        )}
        <span className="text-[8px] md:text-xs font-black tracking-tight">
          {user.points}
        </span>
      </div>
    </motion.div>

    <div className="w-full pt-1.5">
      <p className={`
        text-[8px] md:text-xs font-bold truncate text-center transition-colors px-1
        ${active ? 'text-text' : 'text-text-secondary/80'}
      `}>
        {user.name}
      </p>
    </div>
  </div>
);

export default Leaderboard;