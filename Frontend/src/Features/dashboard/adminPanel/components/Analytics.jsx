import React, { useEffect } from "react";
import { useAdmin } from "../hooks/useAdmin";
import { GlassCard } from "../Shared/GlassCard";
import { StatCard } from "../components/StatCard";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from "recharts";
import { TrendingUp, Users, Target, Zap } from "lucide-react";

const COLORS = ["#e6cec8", "#bfa8a3", "#8c7a77", "#4d4240"];

const Analytics = () => {
  const { dashboard, fetchDashboard } = useAdmin();

  useEffect(() => { fetchDashboard(); }, []);

  const courseData = dashboard?.categoryStats || [
    { name: "Frontend", value: 400 },
    { name: "Backend", value: 300 },
    { name: "UI/UX", value: 200 },
    { name: "Systems", value: 100 },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold italic tracking-tight">Intelligence</h1>
          <p className="text-text-secondary">Deep dive into school performance and user behavior.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Growth Velocity" value="+22%" icon={TrendingUp} trend={4} delay={0.1} />
        <StatCard title="Avg. Progress" value="68%" icon={Target} delay={0.2} />
        <StatCard title="Active Sessions" value="1.2k" icon={Zap} delay={0.3} />
        <StatCard title="Retention" value="92%" icon={Users} trend={2} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Line Chart */}
        <GlassCard className="p-8" delay={0.5}>
          <h3 className="text-xl font-bold italic mb-6">User Acquisition</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboard?.growthChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #333" }} />
                <Line type="monotone" dataKey="users" stroke="#e6cec8" strokeWidth={3} dot={{ fill: "#e6cec8" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Category Distribution Pie Chart */}
        <GlassCard className="p-8" delay={0.6}>
          <h3 className="text-xl font-bold italic mb-6">Course Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {courseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #333" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {courseData.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[10px] uppercase font-bold text-text-secondary">{c.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Sales Performance Bar Chart */}
        <GlassCard className="lg:col-span-2 p-8" delay={0.7}>
          <h3 className="text-xl font-bold italic mb-6">Enrollment by Course</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard?.courseEnrollmentStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="title" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #333" }} />
                <Bar dataKey="students" fill="#e6cec8" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;