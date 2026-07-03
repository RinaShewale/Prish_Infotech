import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../hooks/useAdmin";
import { StatCard } from "../components/StatCard";
import { GlassCard } from "../Shared/GlassCard";
import { RevenueChart } from "../Charts/RevenueChart";
import {
  Users, BookOpen, CreditCard, DollarSign, PhoneCall,
  ArrowUpRight, Activity, ChevronRight, Loader2, 
  LayoutGrid, Calendar, Wallet, Zap, Settings
} from "lucide-react";

const AdminDashboard = () => {
  const { dashboard, loading, fetchDashboard } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading && !dashboard) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#050505]">
        <Loader2 className="w-12 h-12 text-accent animate-spin mb-6" />
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Intel...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-10 space-y-8 max-w-[1400px] mx-auto pb-32">
      
      {/* --- ELITE HEADER --- */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Systems Active</span>
            </div>
            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Calendar size={12} /> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic text-white tracking-tighter uppercase leading-none">
            Intelligence <span className="text-accent">Console</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none p-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all">
            <Settings size={20} />
          </button>
          <button 
            onClick={() => navigate('/admin/analytics')}
            className="flex-[3] lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-accent text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:shadow-[0_0_40px_rgba(var(--accent-rgb),0.3)] transition-all active:scale-95"
          >
            Deep Analytics <ArrowUpRight size={16} />
          </button>
        </div>
      </header>

      {/* --- BENTO STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatItem title="Enrollments" value={dashboard?.totalEnrollments || 0} icon={<Users/>} trend="+12.5%" />
        <StatItem title="Course Inventory" value={dashboard?.totalCourses || 0} icon={<BookOpen/>} />
        <StatItem title="Lead Conversion" value={dashboard?.totalContacts || 0} icon={<Zap/>} trend="+3.1%" />
        <StatItem title="Gross Revenue" value={`₹${dashboard?.totalRevenue?.toLocaleString('en-IN') || 0}`} icon={<Wallet/>} trend="+22.8%" highlight />
      </div>

      {/* --- PRIMARY ANALYTICS HUB --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* REVENUE GRAPH */}
        <GlassCard className="lg:col-span-8 border-white/5 shadow-2xl overflow-hidden" delay={0.2}>
          <div className="p-6 lg:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-white/[0.02] to-transparent">
            <div>
              <h3 className="text-white font-black italic uppercase tracking-tight flex items-center gap-3">
                Financial Flow <Activity size={18} className="text-accent" />
              </h3>
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-1">Institutional Revenue Index</p>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase text-zinc-400">
                Quarterly Overview
            </div>
          </div>
          <div className="p-8 h-[400px] relative">
            <RevenueChart data={dashboard?.revenueChart || []} />
          </div>
        </GlassCard>

        {/* RECENT ACTIVITY LOG */}
        <GlassCard className="lg:col-span-4 flex flex-col border-white/5" delay={0.3}>
          <div className="p-6 lg:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="text-white font-black italic uppercase tracking-tight">System Logs</h3>
            <div className="flex gap-1.5">
                {[1,2,3].map(i => <span key={i} className="w-1 h-1 rounded-full bg-accent animate-pulse" />)}
            </div>
          </div>

          <div className="flex-1 p-4 lg:p-6 overflow-y-auto custom-scrollbar max-h-[400px] space-y-3">
            {dashboard?.recentEnrollments?.length > 0 ? (
              dashboard.recentEnrollments.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                      <CreditCard size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-white uppercase tracking-tighter truncate leading-none mb-1">
                        {item.user?.name || item.userName || "System User"}
                      </p>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight truncate w-32">
                         {item.course?.title || item.courseName || "General Asset"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-white italic tracking-tighter">₹{item.totalAmount || item.amount}</p>
                    <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">SUCCESS</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                <LayoutGrid size={40} className="mb-4" />
                <p className="text-[10px] uppercase font-black tracking-[0.4em]">Zero Deployments</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => navigate('/admin/payments')}
            className="m-6 p-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white hover:border-accent/40 flex items-center justify-center gap-3 transition-all"
          >
            Access Payments <ChevronRight size={14} />
          </button>
        </GlassCard>
      </div>

      {/* --- QUICK ACTION TILES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 pt-4">
        <QuickTile 
            title="Registry" 
            desc="Manage current student deployments"
            icon={<Users size={22} />}
            onClick={() => navigate('/admin/enrollments')}
            color="from-accent/10"
        />
        <QuickTile 
            title="Callbacks" 
            desc="Review inbound student lead pipeline"
            icon={<PhoneCall size={22} />}
            onClick={() => navigate('/admin/contacts')}
            color="from-emerald-500/10"
        />
      </div>

      <style>{`
        :root { --accent-rgb: 124, 58, 237; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const StatItem = ({ title, value, icon, trend, highlight }) => (
    <GlassCard className={`p-6 flex items-center gap-6 border-white/5 group hover:border-white/10 transition-all ${highlight ? 'bg-accent/[0.03]' : ''}`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 transition-all group-hover:scale-110 ${highlight ? 'bg-accent text-white shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]' : 'bg-white/5 text-zinc-500 group-hover:text-white'}`}>
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <div>
            <div className="flex items-center gap-2">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{title}</p>
                {trend && <span className="text-[8px] font-black text-emerald-500 tracking-tighter">{trend}</span>}
            </div>
            <p className="text-2xl font-black italic text-white tracking-tighter mt-1 uppercase">{value}</p>
        </div>
    </GlassCard>
);

const QuickTile = ({ title, desc, icon, onClick, color }) => (
    <motion.button 
        whileHover={{ y: -4 }}
        onClick={onClick}
        className={`w-full bg-gradient-to-br ${color} to-transparent border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between group text-left transition-all hover:border-white/20`}
    >
      <div className="flex items-center gap-6">
        <div className="p-4 bg-white/5 text-white rounded-2xl group-hover:bg-white group-hover:text-black transition-all">
            {icon}
        </div>
        <div>
          <h4 className="text-xl font-black italic text-white uppercase tracking-tight">{title}</h4>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1 opacity-70">{desc}</p>
        </div>
      </div>
      <div className="p-3 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-all">
          <ChevronRight size={20} className="text-white" />
      </div>
    </motion.button>
);

export default AdminDashboard;