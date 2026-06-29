import React, { useEffect, useMemo } from "react";
import { useEnrollment } from "../../Courses/hooks/useEnrollment";
import { usePayment } from "../../Courses/hooks/usePayment"; // 🔥 Import Payment for accurate revenue
import { GlassCard } from "../Shared/GlassCard";
import { StatCard } from "../components/StatCard";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";
import { TrendingUp, Users, Target, Zap, DollarSign, Loader2 } from "lucide-react";

// Professional, muted accent palette
const COLORS = ["#e6cec8", "#c8b2ac", "#a89691", "#827571", "#4d4240"];

const Analytics = () => {
  const { enrollments, loading: enrollLoading, fetchEnrollments } = useEnrollment();
  const { allPayments, loading: payLoading, fetchAllPayments } = usePayment();

  useEffect(() => { 
    fetchEnrollments(); 
    fetchAllPayments();
  }, []);

  // 📊 CALCULATE ANALYTICS
  const stats = useMemo(() => {
    if (!enrollments?.length && !allPayments?.length) return null;

    // 1. Accuracy: Total Revenue from actual Payment records
    const totalRevenue = allPayments?.reduce((acc, curr) => 
        curr.paymentStatus === 'paid' ? acc + (curr.totalAmount || 0) : acc, 0
    ) || 0;

    // 2. Average Progress from Enrollment records
    const totalProgress = enrollments?.reduce((acc, curr) => acc + (curr.progress || 0), 0) || 0;
    const avgProgress = enrollments?.length ? Math.round(totalProgress / enrollments.length) : 0;

    // 3. Category Distribution
    const catMap = {};
    enrollments?.forEach(en => {
      const cat = en.course?.category?.[0] || "General";
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    const categoryStats = Object.keys(catMap).map(name => ({ name, value: catMap[name] }));

    // 4. Course Performance (Top 5)
    const courseMap = {};
    enrollments?.forEach(en => {
      const title = en.course?.title || "Unknown";
      courseMap[title] = (courseMap[title] || 0) + 1;
    });
    const courseStats = Object.keys(courseMap)
      .map(title => ({ 
        title: title.length > 20 ? title.substring(0, 20) + "..." : title, 
        students: courseMap[title] 
      }))
      .sort((a, b) => b.students - a.students)
      .slice(0, 5);

    // 5. Growth Timeline (Grouped by Month)
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
    })).filter((item, index) => index <= new Date().getMonth()); // Show up to current month

    return { avgProgress, categoryStats, courseStats, revenueGrowth, totalRevenue };
  }, [enrollments, allPayments]);

  if (enrollLoading || payLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-accent" size={40} />
        <p className="text-slate-500 italic animate-pulse">Computing Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-5xl font-display font-bold italic tracking-tighter text-white">Intelligence</h1>
          <p className="text-slate-500 mt-2">Aggregated performance data for the current fiscal year.</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Live Data
            </span>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Students" value={enrollments?.length || 0} icon={Users} trend={+8} delay={0.1} />
        <StatCard title="Avg. Progress" value={`${stats?.avgProgress || 0}%`} icon={Target} delay={0.2} />
        <StatCard 
            title="Total Revenue" 
            value={`₹${stats?.totalRevenue?.toLocaleString('en-IN')}`} 
            icon={DollarSign} 
            trend={+14} 
            delay={0.3} 
        />
        <StatCard title="Course Completion" value="68%" icon={Zap} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* REVENUE GROWTH AREA CHART */}
        <GlassCard className="lg:col-span-2 p-8" delay={0.5}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold italic text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-accent" /> Revenue Timeline
            </h3>
            <select className="bg-white/5 border border-white/10 rounded-md text-[10px] text-slate-400 p-1 outline-none">
                <option>Yearly View</option>
            </select>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.revenueGrowth}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e6cec8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e6cec8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                    contentStyle={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }}
                    itemStyle={{ color: "#e6cec8" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#e6cec8" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* PIE CHART */}
        <GlassCard className="p-8 flex flex-col justify-between" delay={0.6}>
          <div>
            <h3 className="text-xl font-bold italic text-white mb-8">Sales by Category</h3>
            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={stats?.categoryStats}
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
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
          </div>
          <div className="space-y-3 mt-4">
            {stats?.categoryStats.map((c, i) => (
              <div key={i} className="flex justify-between items-center bg-white/[0.02] p-2 rounded-lg border border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">{c.name}</span>
                </div>
                <span className="text-xs font-bold text-white">{c.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* BAR CHART PERFORMANCE */}
        <GlassCard className="lg:col-span-3 p-8" delay={0.7}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold italic text-white tracking-tight">Top Performing Courses</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Enrollment Volume</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.courseStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                <XAxis type="number" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis dataKey="title" type="category" stroke="#ffffff" fontSize={11} axisLine={false} tickLine={false} width={150} />
                <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.03)'}}
                    contentStyle={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} 
                />
                <Bar dataKey="students" fill="#e6cec8" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;