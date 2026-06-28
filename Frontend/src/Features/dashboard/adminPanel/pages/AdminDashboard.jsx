import React, { useEffect } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { StatCard } from '../components/StatCard';
import { GlassCard } from '../Shared/GlassCard';
import { RevenueChart } from '../Charts/RevenueChart';
import { Users, BookOpen, CreditCard, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const { dashboard, loading, fetchDashboard } = useAdmin();

  useEffect(() => { fetchDashboard(); }, []);

  if (loading && !dashboard) return <div className="p-10 text-accent animate-pulse font-display">INITIALIZING...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-4xl font-display font-bold italic tracking-tight">Executive Overview</h1>
        <p className="text-text-secondary mt-1">Real-time performance analytics for Prish Infotech.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={dashboard?.totalUsers || 0} icon={Users} trend={12} delay={0.1} />
        <StatCard title="Total Courses" value={dashboard?.totalCourses || 0} icon={BookOpen} delay={0.2} />
        <StatCard title="Enrollments" value={dashboard?.totalEnrollments || 0} icon={CreditCard} trend={8} delay={0.3} />
        <StatCard title="Revenue" value={`₹${dashboard?.totalRevenue?.toLocaleString() || 0}`} icon={DollarSign} trend={24} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-8" delay={0.5}>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold italic">Revenue Stream</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg text-xs p-2 outline-none">
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>
          </div>
          <RevenueChart data={dashboard?.revenueChart || []} />
        </GlassCard>

        <GlassCard className="p-8" delay={0.6}>
          <h3 className="text-xl font-bold mb-6 italic">Recent Signups</h3>
          <div className="space-y-6">
            {dashboard?.recentUsers?.map((user) => (
              <div key={user._id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-accent">
                  {user.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{user.name}</p>
                  <p className="text-xs text-text-secondary truncate">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
export default AdminDashboard;