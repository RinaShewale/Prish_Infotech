import React from 'react';
import { ChevronRight, Trophy, Award, Bookmark, Pause, LogOut } from 'lucide-react';

const NavigationSidebar = () => {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="bg-bg2 border border-border rounded-xl p-2 flex justify-center py-4 shrink-0">
        <div className="p-2 bg-card rounded-lg cursor-pointer hover:bg-border transition-colors">
            <ChevronRight size={18} className="text-text-secondary" />
        </div>
      </div>

      <div className="flex-1 bg-bg2 border border-border rounded-xl p-4 space-y-3">
        <NavItem icon={<Trophy size={18} />} label="Leaderboard" active />
        <NavItem icon={<Award size={18} />} label="Certificate" />
        <NavItem icon={<Bookmark size={18} />} label="Bookmarks" />
        <NavItem icon={<Pause size={18} />} label="Batch Hold" />
        <NavItem icon={<LogOut size={18} />} label="Opt-Out" />
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active }) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
        active ? 'bg-accent/10 border border-accent/20 text-accent' : 'text-text-secondary hover:bg-card hover:text-text'
    }`}>
        {icon}
        <span className="text-xs font-bold tracking-wide uppercase">{label}</span>
    </div>
);

export default NavigationSidebar;