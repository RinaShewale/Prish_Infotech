import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Award, Bookmark, ClipboardList, 
  MessageSquare, Zap, Target, X, 
  ChevronRight, Activity, Layers, Flame, TrendingUp
} from 'lucide-react';

const NavigationSidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'leaderboard', label: 'Rank', desktopLabel: 'Leaderboard', icon: <Trophy /> },
    { id: 'certificate', label: 'Cert', desktopLabel: 'Certificate', icon: <Award /> },
    { id: 'bookmarks', label: 'Saved', desktopLabel: 'Bookmarks', icon: <Bookmark /> },
    { id: 'assignments', label: 'Tasks', desktopLabel: 'Assignments', icon: <ClipboardList /> },
    { id: 'support', label: 'Help', desktopLabel: 'Support', icon: <MessageSquare /> },
  ];

  const activityData = useMemo(() => {
    return Array.from({ length: 140 }, (_, i) => ({
      level: Math.floor(Math.random() * 5),
      date: new Date(Date.now() - (139 - i) * 24 * 60 * 60 * 1000)
    }));
  }, []);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Static) --- */}
      <div className="hidden lg:flex lg:relative lg:h-full lg:w-20 xl:w-64 flex-col gap-4 z-50">
        <div className="bg-bg2/40 backdrop-blur-md border border-border/50 rounded-2xl p-3">
          <button onClick={() => setIsOpen(true)} className="flex items-center justify-between w-full p-3 bg-card hover:bg-accent/10 text-text rounded-xl transition-all group border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent"><Activity size={18} /></div>
              <div className="hidden xl:flex flex-col items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Activity</span>
                <span className="text-xs font-bold text-accent">Level 14</span>
              </div>
            </div>
            <ChevronRight size={14} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <nav className="h-full bg-bg2/40 backdrop-blur-2xl border border-border/50 rounded-3xl flex flex-col items-stretch pt-6 gap-2">
          {menuItems.map((item) => (
            <NavItem key={item.id} icon={item.icon} label={item.label} desktopLabel={item.desktopLabel} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
          ))}
        </nav>
      </div>

      {/* --- MOBILE: COMPACT FLOATING CORE --- */}
      <div className="lg:hidden fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              className="flex flex-col gap-2 mb-1 items-end min-w-[190px]"
            >
                {menuItems.map((item, idx) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (menuItems.length - idx) * 0.04 }}
                    onClick={() => { setActiveTab(item.id); setIsMenuOpen(false); }}
                    className={`
                      flex items-center justify-between gap-6 px-5 py-3.5 rounded-[22px] w-full border
                      transition-all shadow-xl backdrop-blur-lg
                      ${activeTab === item.id 
                        ? 'bg-[#8B6B6B] border-white/20 text-white' 
                        : 'bg-[#121212]/90 border-white/10 text-white/70'}
                    `}
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.15em]">{item.desktopLabel}</span>
                    {React.cloneElement(item.icon, { size: 16, strokeWidth: 2.5 })}
                  </motion.button>
                ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resized Trigger Buttons */}
        <div className="flex flex-col gap-2.5 items-center">
          {/* Smaller Activity Circle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-13 h-13 bg-[#1A1616] border border-white/10 rounded-full flex items-center justify-center text-[#8B6B6B] shadow-xl p-3.5"
          >
            <Activity size={20} strokeWidth={2.5} />
          </motion.button>

          {/* Sized-down Main Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
          >
            {isMenuOpen ? <X size={26} strokeWidth={2.5} /> : <Layers size={26} strokeWidth={2.5} />}
          </motion.button>
        </div>
      </div>

      {/* --- POPUP ACTIVITY STYLE --- */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-end lg:items-center justify-center p-0 lg:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={typeof window !== 'undefined' && window.innerWidth < 1024 ? { y: "100%" } : { scale: 0.95, opacity: 0 }}
              animate={typeof window !== 'undefined' && window.innerWidth < 1024 ? { y: 0 } : { scale: 1, opacity: 1 }}
              exit={typeof window !== 'undefined' && window.innerWidth < 1024 ? { y: "100%" } : { scale: 0.95, opacity: 0 }}
              className="relative bg-[#0A0A0A] border border-white/10 w-full lg:max-w-md lg:rounded-[2.5rem] rounded-t-[2.5rem] p-7 max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white tracking-tight">Activity Status</h2>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-white/40"><X size={18} /></button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                 <MetricBox icon={<Flame size={14} />} label="Streak" value="42" color="text-orange-500" />
                 <MetricBox icon={<TrendingUp size={14} />} label="Rank" value="#12" color="text-accent" />
                 <MetricBox icon={<Target size={14} />} label="Goal" value="92" color="text-emerald-500" />
              </div>

              <div className="bg-[#121212] border border-white/5 p-5 rounded-2xl">
                <div className="overflow-x-auto no-scrollbar">
                  <div className="flex flex-col flex-wrap h-[80px] w-max gap-1">
                    {activityData.map((day, i) => (
                      <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${day.level === 0 ? 'bg-white/5' : 'bg-accent'}`} 
                           style={{ opacity: day.level === 0 ? 1 : day.level * 0.25 }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl">
                Full Analytics
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// Helper Components
const MetricBox = ({ icon, label, value, color }) => (
  <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center gap-0.5">
    <div className={`${color} opacity-80 mb-0.5`}>{icon}</div>
    <span className="text-white font-bold text-lg tracking-tight">{value}</span>
    <span className="text-[7px] text-white/30 font-black uppercase tracking-widest">{label}</span>
  </div>
);

const NavItem = ({ icon, label, desktopLabel, active, onClick }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center justify-start gap-4 px-6 py-4 transition-all duration-300 ${active ? 'text-accent' : 'text-text-secondary/60 hover:text-text'}`}
  >
    {active && <motion.div layoutId="active-nav-pill" className="absolute left-0 w-1 h-6 bg-accent rounded-r-full" />}
    <div className={active ? 'scale-110 opacity-100' : 'opacity-70'}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <span className="hidden xl:inline text-[12px] font-semibold tracking-wide">{desktopLabel}</span>
  </button>
);

export default NavigationSidebar;