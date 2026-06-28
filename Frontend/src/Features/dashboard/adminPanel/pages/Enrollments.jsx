import React, { useEffect, useState } from "react";
import { useAdmin } from "../hooks/useAdmin";
import { GlassCard } from "../Shared/GlassCard";
import { TableSkeleton } from "../Shared/TableSkeleton";
import { Search, Filter, Download, ExternalLink } from "lucide-react";

const Enrollments = () => {
  const { enrollments, loading, fetchEnrollments } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { fetchEnrollments(); }, []);

  const filteredData = enrollments?.filter(en => 
    en.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    en.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold italic">Student Enrollments</h1>
          <p className="text-text-secondary">Monitoring course access and payment lifecycle.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <GlassCard className="p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-accent transition-colors"
            placeholder="Search student or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </GlassCard>

      <GlassCard className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-white/5 bg-white/[0.01]">
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">Student Identity</th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">Course Title</th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">Amount</th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">Progress</th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">Status</th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold text-right">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <TableSkeleton rows={8} cols={6} /> : filteredData?.map((en) => (
              <tr key={en._id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                <td className="p-6">
                  <p className="text-sm font-bold text-white">{en.user?.name}</p>
                  <p className="text-xs text-text-secondary">{en.user?.email}</p>
                </td>
                <td className="p-6 text-sm font-medium">{en.course?.title}</td>
                <td className="p-6 text-sm font-mono text-accent">₹{en.amount?.toLocaleString()}</td>
                <td className="p-6">
                  <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${en.progress || 0}%` }} />
                  </div>
                  <span className="text-[10px] text-text-secondary mt-1 block">{en.progress || 0}% Complete</span>
                </td>
                <td className="p-6">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-bold uppercase">
                    Active
                  </span>
                </td>
                <td className="p-6 text-right">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-text-secondary hover:text-accent transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};

export default Enrollments;