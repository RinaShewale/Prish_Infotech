import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Award, Bookmark, ClipboardList, 
  MessageSquare, X, ChevronRight, Layers
} from 'lucide-react';

const NavigationSidebar = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'leaderboard', label: 'Rank', desktopLabel: 'Leaderboard', icon: <Trophy /> },
    { id: 'certificate', label: 'Cert', desktopLabel: 'Certificate', icon: <Award /> },
    { id: 'bookmarks', label: 'Saved', desktopLabel: 'Bookmarks', icon: <Bookmark /> },
    { id: 'assignments', label: 'Tasks', desktopLabel: 'Assignments', icon: <ClipboardList /> },
    { id: 'support', label: 'Help', desktopLabel: 'Support', icon: <MessageSquare /> },
  ];

  // Get current active item details
  const activeItem = useMemo(() => 
    menuItems.find(item => item.id === activeTab) || menuItems[0], 
  [activeTab]);

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <div className="hidden lg:flex lg:relative lg:h-full lg:w-20 xl:w-64 flex-col gap-4 z-50">
        {/* Static Header showing Current Section Name */}
        <div className="bg-bg2/40 backdrop-blur-md border border-border/50 rounded-2xl p-3 shrink-0">
          <div className="flex items-center justify-center gap-3 p-3 bg-card/50 text-text rounded-xl border border-border/50">
        
            <div className="hidden xl:flex flex-col items-start">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Learning Portal</span>
            </div>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 min-h-0 bg-bg2/40 backdrop-blur-2xl border border-border/50 rounded-3xl flex flex-col items-stretch pt-6 gap-2">
          {menuItems.map((item) => (
            <NavItem 
              key={item.id} 
              icon={item.icon} 
              desktopLabel={item.desktopLabel} 
              active={activeTab === item.id} 
              onClick={() => setActiveTab(item.id)} 
            />
          ))}
        </nav>
      </div>

      {/* --- MOBILE: FLOATING NAV --- */}
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

        {/* Single Menu Toggle Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
        >
          {isMenuOpen ? <X size={26} strokeWidth={2.5} /> : <Layers size={26} strokeWidth={2.5} />}
        </motion.button>
      </div>
    </>
  );
};

// Helper Nav Item Component
const NavItem = ({ icon, desktopLabel, active, onClick }) => (
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