import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../hooks/useAdmin";
import { useEnrollment } from "../../Courses/hooks/useEnrollment";
import { usePayment } from "../../Courses/hooks/usePayment";
import { GlassCard } from "../Shared/GlassCard";
import { RevenueChart } from "../Charts/RevenueChart";
import {
  Users, BookOpen, Wallet, PhoneCall,
  Activity, ChevronRight, Loader2,
  TrendingUp, Plus, Calendar
} from "lucide-react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const AdminDashboard = () => {
  const { dashboard, loading, fetchDashboard } = useAdmin();
  const { enrollments, fetchEnrollments } = useEnrollment();
  const { allPayments, fetchAllPayments } = usePayment();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
    fetchEnrollments();
    fetchAllPayments();
  }, []);

  // Core stat counts from backend
  const stats = useMemo(() => {
    if (!dashboard) return null;
    const d = dashboard;
    return {
      enrollments: d.enrollments ?? 0,
      courses: d.courses ?? 0,
      leads: d.contacts ?? 0,
      revenue: d.revenue ?? 0,
    };
  }, [dashboard]);

  // Build revenue chart data from real payments (same as Analytics.jsx)
  const chartData = useMemo(() => {
    if (!allPayments?.length) return [];
    const growthMap = {};
    allPayments.forEach((p) => {
      if (p.paymentStatus === "paid") {
        const month = MONTHS[new Date(p.createdAt).getMonth()];
        growthMap[month] = (growthMap[month] || 0) + (p.totalAmount || 0);
      }
    });
    return MONTHS
      .map((m) => ({ name: m, revenue: growthMap[m] || 0 }))
      .filter((_, i) => i <= new Date().getMonth());
  }, [allPayments]);

  // Recent enrollments (last 5 by date) for the side panel
  const recentEnrollments = useMemo(() => {
    if (!enrollments?.length) return [];
    return [...enrollments]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [enrollments]);

  if (loading && !dashboard) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto pb-20">

      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">
            Dashboard <span className="text-accent">Overview</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Real-time Institutional Metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right border-r border-white/10 pr-4">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Server Status</p>
            <p className="text-[10px] font-bold text-emerald-500 uppercase flex items-center justify-end gap-1">
              <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"/> Operational
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/courses/create')}
            className="bg-accent hover:bg-accent/80 text-white p-3 rounded-xl transition-all shadow-lg shadow-accent/20"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      {/* --- CORE STATS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatItem title="Students"  value={stats?.enrollments} icon={<Users size={20}/>} trend="+12%" />
        <StatItem title="Courses"   value={stats?.courses}     icon={<BookOpen size={20}/>} />
        <StatItem title="Callbacks" value={stats?.leads}       icon={<PhoneCall size={20}/>} />
        <StatItem title="Revenue"   value={`\u20B9${stats?.revenue?.toLocaleString('en-IN')}`} icon={<Wallet size={20}/>} highlight />
      </div>

      {/* --- ANALYTICS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* REVENUE CHART */}
        <GlassCard className="lg:col-span-2 border-white/5 overflow-hidden">
          <div className="p-6 flex justify-between items-center border-b border-white/5">
            <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} className="text-accent" /> Revenue Flow
            </h3>
            <span className="text-[9px] text-zinc-500 font-bold uppercase bg-white/5 px-2 py-1 rounded">
              {new Date().getFullYear()}
            </span>
          </div>
          <div className="p-6 h-[350px]">
            {chartData.length > 0 ? (
              <RevenueChart data={chartData} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <TrendingUp size={32} />
                <p className="text-[9px] font-black uppercase tracking-widest mt-3">No payment data yet</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* RECENT ENROLLMENTS */}
        <GlassCard className="border-white/5 flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Activity size={14} className="text-accent" /> Recent Enrollments
            </h3>
          </div>

          <div className="flex-1 p-4 overflow-y-auto max-h-[350px] space-y-3 custom-scrollbar">
            {recentEnrollments.length > 0 ? (
              recentEnrollments.map((en, idx) => (
                <div key={en._id || idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-[11px] font-black flex-shrink-0 overflow-hidden">
                    {en.user?.avatar
                      ? <img src={en.user.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      : (en.user?.name?.charAt(0) || 'U')
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-white uppercase truncate">
                      {en.user?.name || "Student"}
                    </p>
                    <p className="text-[9px] text-zinc-500 font-bold truncate flex items-center gap-1 mt-0.5">
                      <BookOpen size={9} className="text-accent flex-shrink-0" />
                      {en.course?.title || "Course"}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-[8px] text-zinc-600 font-bold flex items-center gap-1">
                      <Calendar size={8} />
                      {en.createdAt
                        ? new Date(en.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                        : "\u2014"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                <BookOpen size={30} />
                <p className="text-[8px] font-black uppercase tracking-widest mt-2">No Enrollments Yet</p>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/admin/enrollments')}
            className="m-4 p-3 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-zinc-400 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            All Enrollments <ChevronRight size={12} />
          </button>
        </GlassCard>

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

// Stat Card helper
const StatItem = ({ title, value, icon, trend, highlight }) => (
  <GlassCard className={`p-6 border-white/5 group hover:border-accent/20 transition-all ${highlight ? 'bg-accent/[0.02]' : ''}`}>
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl ${highlight ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-white/5 text-zinc-400 group-hover:text-accent'} transition-colors`}>
        {icon}
      </div>
      {trend && <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">{trend}</span>}
    </div>
    <div className="mt-4">
      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-2xl font-black text-white italic tracking-tighter mt-1 uppercase">{value ?? 0}</h3>
    </div>
  </GlassCard>
);

export default AdminDashboard;