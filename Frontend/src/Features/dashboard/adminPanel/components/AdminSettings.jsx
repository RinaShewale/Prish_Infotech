import React from 'react';
import { GlassCard } from '../Shared/GlassCard';
import { User, Bell, Lock, Globe, Save } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="text-4xl font-bold italic">System Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar for Settings */}
        <div className="space-y-2">
          {[
            { icon: User, label: "Profile", active: true },
            { icon: Bell, label: "Notifications", active: false },
            { icon: Lock, label: "Security", active: false },
            { icon: Globe, label: "SEO & Platform", active: false },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              item.active ? 'bg-accent text-bg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}>
              <item.icon size={18}/> {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          <GlassCard className="p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              Admin Identity <User size={20} className="text-accent" />
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500">Full Name</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-accent text-sm" defaultValue="Prish Admin" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500">Contact Email</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-accent text-sm" defaultValue="admin@prishinfotech.com" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button className="bg-accent text-bg px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform">
                <Save size={18}/> Update Profile
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};