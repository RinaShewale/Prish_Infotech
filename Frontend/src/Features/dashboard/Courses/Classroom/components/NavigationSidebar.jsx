import React from 'react';
import { ChevronRight, Trophy, Award, Bookmark,ClipboardList,MessageSquare } from 'lucide-react';

const NavigationSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
    { id: 'certificate', label: 'Certificate', icon: <Award size={18} /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark size={18} /> },
    { id: 'assignments', label: 'Assignments', icon: <ClipboardList size={18} /> },
    { id: 'support', label: 'Support', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="bg-bg2 border border-border rounded-xl p-2 hidden lg:flex justify-center py-4 shrink-0">
        <div className="p-2 bg-card rounded-lg cursor-pointer hover:bg-border transition-colors">
          <ChevronRight size={18} className="text-text-secondary" />
        </div>
      </div>

      <div className="flex-1 bg-bg2 border border-border rounded-xl p-4 flex flex-row lg:flex-col gap-2 lg:space-y-3 overflow-x-auto lg:overflow-x-visible">
        {menuItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all flex-1 lg:flex-none justify-center lg:justify-start ${active ? 'bg-accent/10 border border-accent/20 text-accent' : 'text-text-secondary hover:bg-card hover:text-text border border-transparent'
      }`}>
    {icon}
    <span className="text-[10px] font-bold tracking-wide uppercase whitespace-nowrap">{label}</span>
  </div>
);

export default NavigationSidebar;