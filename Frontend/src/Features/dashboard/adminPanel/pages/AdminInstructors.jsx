import React from 'react';
import { GlassCard } from '../Shared/GlassCard';
import { Plus, Mail, Star, ShieldCheck, MoreVertical } from 'lucide-react';

const AdminInstructors = () => {
  const instructors = [
    { id: 1, name: "Dr. Arjan Shewale", role: "Lead Fullstack", students: 1200, rating: 4.9, status: "Active" },
    { id: 2, name: "Sarah Connor", role: "UI/UX Specialist", students: 850, rating: 4.8, status: "On Leave" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold italic">Faculty Hub</h1>
          <p className="text-text-secondary">Manage your school's intellectual capital.</p>
        </div>
        <button className="bg-accent text-bg px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2">
          <Plus size={18}/> Add Instructor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {instructors.map((inst) => (
          <GlassCard key={inst.id} className="p-6 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical size={16} className="text-slate-500 cursor-pointer" />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/20 flex items-center justify-center text-accent text-xl font-bold">
                {inst.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{inst.name}</h3>
                <p className="text-xs text-accent font-medium">{inst.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 mb-6">
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Students</p>
                <p className="text-white font-mono">{inst.students.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Rating</p>
                <p className="text-white flex items-center gap-1 font-mono">
                  {inst.rating} <Star size={10} className="fill-yellow-500 text-yellow-500" />
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${
                inst.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
              }`}>
                {inst.status}
              </span>
              <button className="text-slate-400 hover:text-white transition-colors"><Mail size={18}/></button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default AdminInstructors;