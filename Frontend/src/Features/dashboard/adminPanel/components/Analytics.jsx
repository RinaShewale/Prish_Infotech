import React, { useEffect, useMemo } from "react";
import { useEnrollment } from "../../Courses/hooks/useEnrollment";
import { usePayment } from "../../Courses/hooks/usePayment";
import { GlassCard } from "../Shared/GlassCard";
import { StatCard } from "../components/StatCard";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";
import { TrendingUp, Users, Target, Zap, DollarSign, Loader2, Calendar } from "lucide-react";

const COLORS = ["#e6cec8", "#c8b2ac", "#a89691", "#827571", "#4d4240"];

const Analytics = () => {
  const { enrollments, loading: enrollLoading, fetchEnrollments } = useEnrollment();
  const { allPayments, loading: payLoading, fetchAllPayments } = usePayment();

  useEffect(() => { 
    fetchEnrollments(); 
    fetchAllPayments();
  }, []);

  const stats = useMemo(() => {
    if (!enrollments?.length && !allPayments?.length) return null;

    const totalRevenue = allPayments?.reduce((acc, curr) => 
        curr.paymentStatus === 'paid' ? acc + (curr.totalAmount || 0) : acc, 0
    ) || 0;

    const totalProgress = enrollments?.reduce((acc, curr) => acc + (curr.progress || 0), 0) || 0;
    const avgProgress = enrollments?.length ? Math.round(totalProgress / enrollments.length) : 0;

    const catMap = {};
    enrollments?.forEach(en => {
      const cat = en.course?.category?.[0] || "General";
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    const categoryStats = Object.keys(catMap).map(name => ({ name, value: catMap[name] }));

    const courseMap = {};
    enrollments?.forEach(en => {
      const title = en.course?.title || "Unknown";
      courseMap[title] = (courseMap[title] || 0) + 1;
    });
    const courseStats = Object.keys(courseMap)
      .map(title => ({ 
        title: title.length > 15 ? title.substring(0, 15) + "..." : title, 
        students: courseMap[title] 
      }))
      .sort((a, b) => b.students - a.students)
      .slice(0, 5);

    const growthMap = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    allPayments?.forEach(p => {
        const date = new Date(p.createdAt);
        const month = months[date.getMonth()];
        growthMap[month] = (growthMap[month] || 0) + (p.totalAmount || 0);
    });

    const revenueGrowth = months.map(m => ({
        name: m,
        revenue: growthMap[m] || 0
    })).filter((item, index) => index <= new Date().getMonth());

    return { avgProgress, categoryStats, courseStats, revenueGrowth, totalRevenue };
  }, [enrollments, allPayments]);

  if (enrollLoading || payLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-accent" size={40} />
        <p className="text-slate-500 italic animate-pulse font-medium">Computing Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-10 space-y-8 md:space-y-12 max-w-[1600px] mx-auto overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-6xl font-display font-bold italic tracking-tighter text-white">
            Intelligence<span className="text-accent">.</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-md">
            Aggregated performance and financial metrics for the current fiscal cycle.
          </p>
        </div>
        <div className="flex items-center self-start md:self-auto">
            <span className="px-4 py-2 bg-emerald-500/5 text-emerald-500 rounded-2xl text-[10px] font-bold border border-emerald-500/10 uppercase tracking-[0.2em] flex items-center gap-2 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Analytics
            </span>
        </div>
      </div>

      {/* KPI GRID - Fluid columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Active Students" value={enrollments?.length || 0} icon={Users} trend={+8} delay={0.1} />
        <StatCard title="Avg. Progress" value={`${stats?.avgProgress || 0}%`} icon={Target} delay={0.2} />
        <StatCard 
            title="Total Revenue" 
            value={`₹${stats?.totalRevenue?.toLocaleString('en-IN')}`} 
            icon={DollarSign} 
            trend={+14} 
            delay={0.3} 
        />
        <StatCard title="Completion Rate" value="68%" icon={Zap} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* REVENUE GROWTH - 8 Cols on Large */}
        <GlassCard className="lg:col-span-8 p-5 md:p-8" delay={0.5}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h3 className="text-lg md:text-xl font-bold italic text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-accent" /> Revenue Timeline
            </h3>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                <Calendar size={14} className="text-slate-400" />
                <select className="bg-transparent border-none text-[11px] font-bold uppercase tracking-widest text-slate-400 outline-none cursor-pointer">
                    <option className="bg-[#050505]">Monthly View</option>
                    <option className="bg-[#050505]">Yearly View</option>
                </select>
            </div>
          </div>
          <div className="h-[300px] md:h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.revenueGrowth}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e6cec8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#e6cec8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#ffffff30" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                    contentStyle={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }}
                    itemStyle={{ color: "#e6cec8" }}
                    cursor={{ stroke: '#e6cec8', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#e6cec8" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* PIE CHART - 4 Cols on Large */}
        <GlassCard className="lg:col-span-4 p-5 md:p-8 flex flex-col" delay={0.6}>
          <h3 className="text-lg md:text-xl font-bold italic text-white mb-6">Sales Category</h3>
          <div className="flex-1 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6">
            <div className="h-[240px] md:h-[280px] w-full max-w-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={stats?.categoryStats}
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={10}
                        dataKey="value"
                    >
                        {stats?.categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0f0f0f", border: "none", borderRadius: "8px" }} />
                </PieChart>
                </ResponsiveContainer>
            </div>
            
            <div className="w-full space-y-2.5">
              {stats?.categoryStats.map((c, i) => (
                <div key={i} className="flex justify-between items-center bg-white/[0.03] p-3 rounded-xl border border-white/5 hover:bg-white/[0.06] transition-colors">
                  <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{c.name}</span>
                  </div>
                  <span className="text-xs font-black text-white">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* TOP COURSES BAR CHART - Full Width */}
        <GlassCard className="lg:col-span-12 p-5 md:p-8" delay={0.7}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-8">
            <h3 className="text-lg md:text-xl font-bold italic text-white tracking-tight">Top Performance Matrix</h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full">Course Enrollment Volume</p>
          </div>
          <div className="h-[300px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.courseStats} layout="vertical" margin={{ left: -20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                <XAxis type="number" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis 
                  dataKey="title" 
                  type="category" 
                  stroke="#ffffff" 
                  fontSize={10} 
                  axisLine={false} 
                  tickLine={false} 
                  width={100} // Reduced width for mobile safety
                />
                <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.03)'}}
                    contentStyle={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} 
                />
                <Bar dataKey="students" fill="#e6cec8" radius={[0, 8, 8, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;