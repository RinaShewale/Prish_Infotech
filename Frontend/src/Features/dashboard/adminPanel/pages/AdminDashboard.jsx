import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../hooks/useAdmin";
import { StatCard } from "../components/StatCard";
import { GlassCard } from "../Shared/GlassCard";
import { RevenueChart } from "../Charts/RevenueChart";
import {
  Users, BookOpen, CreditCard, DollarSign, PhoneCall,
  ArrowUpRight, TrendingUp, Download, Activity,
  ChevronRight, ShieldCheck, Loader2, LayoutGrid
} from "lucide-react";

const AdminDashboard = () => {
  const { dashboard, loading, fetchDashboard } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading && !dashboard) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
        <p className="text-slate-500 text-xs tracking-[0.3em] uppercase">Synchronizing Systems...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      
      {/* --- REFINED HEADER --- */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Live Systems Optimal</span>
            </div>
            <span className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">
              {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long' })}
            </span>
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">
            Institutional <span className="text-accent italic font-serif">Intelligence</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
            <Download size={18} />
          </button>
          <button 
            onClick={() => navigate('/admin/analytics')}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent text-black font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-accent/10"
          >
            Deep Analytics <ArrowUpRight size={14} />
          </button>
        </div>
      </header>

      {/* --- BENTO STATS GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <StatCard title="Active Learners" value={dashboard?.totalUsers || 0} icon={Users} trend="+12%" delay={0.1} />
        <StatCard title="Course Assets" value={dashboard?.totalCourses || 0} icon={BookOpen} delay={0.2} />
        <StatCard title="Enrollments" value={dashboard?.totalEnrollments || 0} icon={CreditCard} trend="+5.2%" delay={0.3} />
        <StatCard title="Gross Revenue" value={`₹${dashboard?.totalRevenue?.toLocaleString('en-IN') || 0}`} icon={DollarSign} trend="+24%" delay={0.4} color="text-accent" />
        <StatCard title="Lead Pipeline" value={dashboard?.totalContacts || 0} icon={PhoneCall} delay={0.5} />
      </div>

      {/* --- MAIN ANALYTICS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* REVENUE SECTION */}
        <GlassCard className="lg:col-span-8 overflow-hidden group" delay={0.6}>
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <div>
              <h3 className="text-white font-bold flex items-center gap-2">
                Revenue Flow <Activity size={16} className="text-accent" />
              </h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Financial Performance Index</p>
            </div>
            <select className="bg-white/5 border border-white/10 text-[10px] uppercase font-bold text-slate-400 rounded-lg px-2 py-1 outline-none">
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
            </select>
          </div>
          <div className="p-8 h-[360px] relative">
            <RevenueChart data={dashboard?.revenueChart || []} />
          </div>
        </GlassCard>

        {/* LIVE FEED SECTION */}
        <GlassCard className="lg:col-span-4 flex flex-col" delay={0.7}>
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="text-white font-bold italic">Live Feed</h3>
            <div className="flex gap-1">
                <span className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{animationDelay: '0s'}} />
                <span className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{animationDelay: '0.2s'}} />
                <span className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{animationDelay: '0.4s'}} />
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
            {dashboard?.recentEnrollments?.length > 0 ? (
              dashboard.recentEnrollments.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-none mb-1">
                        {item.user?.name || item.userName || "Unknown Student"}
                      </p>
                      <p className="text-[9px] text-slate-500 font-medium truncate w-32">
                         {item.course?.title || item.courseName || "General Course"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-white">₹{item.totalAmount || item.amount}</p>
                    <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Success</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 py-10">
                <LayoutGrid size={32} className="mb-2" />
                <p className="text-[10px] uppercase font-bold tracking-widest">No Recent Activity</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => navigate('/admin/payments')}
            className="m-4 p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-accent hover:border-accent/30 flex items-center justify-center gap-2 transition-all"
          >
            Open Terminal <ChevronRight size={14} />
          </button>
        </GlassCard>
      </div>

      {/* --- QUICK ACTION TILES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickAction 
            title="Curriculum Leader" 
            subtitle="Trending: Fullstack MERN Development"
            icon={<TrendingUp size={20} />}
            onClick={() => navigate('/admin/courses')}
            color="from-accent/20"
        />
        <QuickAction 
            title="Support Queue" 
            subtitle="12 Unresolved learner inquiries"
            icon={<PhoneCall size={20} />}
            onClick={() => {}}
            color="from-blue-500/20"
        />
      </div>
    </div>
  );
};

// Sub-component for cleaner code
const QuickAction = ({ title, subtitle, icon, onClick, color }) => (
    <motion.div 
        whileHover={{ y: -2, x: 2 }}
        onClick={onClick}
        className={`bg-gradient-to-br ${color} to-transparent border border-white/5 p-5 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all`}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/5 text-white rounded-xl group-hover:bg-white group-hover:text-black transition-all">
            {icon}
        </div>
        <div>
          <h4 className="text-white font-bold text-sm italic">{title}</h4>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{subtitle}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
    </motion.div>
);

export default AdminDashboard;