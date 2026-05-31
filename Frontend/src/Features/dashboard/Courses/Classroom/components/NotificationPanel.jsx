import React from 'react';
import { Bell } from 'lucide-react';

const NotificationPanel = ({ empty }) => {
  return (
    <div className="glass p-6 rounded-[2rem] border border-border/50 flex flex-col h-full">
      <h3 className="text-sm font-display font-bold text-text mb-6">All Notifications</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
           <Bell size={32} />
        </div>
        <p className="text-sm font-bold">No notifications available</p>
        <p className="text-[10px] mt-1">You're all caught up! Check back later for updates.</p>
      </div>
    </div>
  );
};

export default NotificationPanel;