import React, { useEffect, useState } from 'react';
import { useEnrollment } from '../../Courses/hooks/useEnrollment';
import { GlassCard } from '../Shared/GlassCard';
import { Search, BookOpen, Eye, User, Calendar, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

const Enrollments = () => {
  const { enrollments, loading, fetchEnrollments } = useEnrollment();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const filtered = enrollments?.filter((en) =>
    en.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    en.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    en.course?.title?.toLowerCase().includes(search.toLowerCase())
  );

  // Avatar Helper Component (Matches Nav.jsx logic)
  const StudentAvatar = ({ user, size = "w-10 h-10" }) => (
    <div className={`${size} rounded-full bg-accent/10 border border-accent/20 overflow-hidden flex items-center justify-center flex-shrink-0`}>
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="text-accent font-black text-xs uppercase">
          {user?.name?.charAt(0) || 'U'}
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8 pb-32 px-4 md:px-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white leading-none">
            Registry
          </h1>
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-accent mt-2">
            {enrollments?.length || 0} active student deployments
          </p>
        </motion.div>
      </div>

      {/* SEARCH BAR */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-2 md:p-3 border-white/5 shadow-2xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-accent transition-colors" />
            <input
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 pr-4 outline-none focus:border-accent/50 transition-all text-xs md:text-sm text-white placeholder:text-zinc-600 font-medium"
              placeholder="Filter by student identity, email or curriculum title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </GlassCard>
      </motion.div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="py-20 text-center animate-pulse">
            <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Syncing Enrollment Ledger...</p>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW: CARDS (md:hidden) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filtered?.map((en, idx) => (
              <motion.div 
                key={en._id} 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard className="p-5 border-white/5 relative overflow-hidden">
                   <div className="flex items-center gap-4 mb-4">
                      <StudentAvatar user={en.user} />
                      <div className="min-w-0">
                         <h3 className="text-white font-bold text-sm truncate">{en.user?.name || 'Unknown User'}</h3>
                         <p className="text-[10px] text-zinc-500 truncate font-medium uppercase tracking-tight">{en.user?.email}</p>
                      </div>
                   </div>

                   <div className="space-y-3 pt-3 border-t border-white/5 relative z-10">
                      <div className="flex items-center justify-between text-[11px]">
                         <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">Course</span>
                         <span className="text-white font-medium flex items-center gap-1.5">
                            <BookOpen size={12} className="text-accent" />
                            {en.course?.title || 'Deleted'}
                         </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                         <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">Status</span>
                         <span className={`px-2 py-0.5 rounded-md font-black uppercase text-[8px] border ${
                            en.user?.isBlocked ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
                         }`}>
                            {en.user?.isBlocked ? 'Inhibited' : 'Active'}
                         </span>
                      </div>
                      
                      <button 
                         onClick={() => navigate(`/admin/course-progress/${en.course?._id}`)}
                         className="w-full mt-2 py-3 bg-white/5 rounded-xl flex items-center justify-center gap-2 text-blue-400 font-black uppercase text-[9px] tracking-widest hover:bg-white/10 transition-all border border-white/5"
                      >
                         <Eye size={14} /> Analytics Profile
                      </button>
                   </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* DESKTOP VIEW: TABLE (hidden md:block) */}
          <div className="hidden md:block">
            <GlassCard className="overflow-hidden border-white/5 shadow-2xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-white/5 bg-white/[0.02]">
                    <th className="p-6 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Student Identity</th>
                    <th className="p-6 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Curriculum</th>
                    <th className="p-6 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Deployment</th>
                    <th className="p-6 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Access</th>
                    <th className="p-6 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black text-right">Analytics</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered?.map((en) => (
                    <tr key={en._id} className="border-b border-white/5 hover:bg-white/[0.015] transition-all group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <StudentAvatar user={en.user} />
                          <div>
                            <p className="text-sm font-black italic text-white tracking-tight uppercase group-hover:text-accent transition-colors">
                              {en.user?.name || 'Unknown User'}
                            </p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight mt-0.5">
                              {en.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex items-center gap-2.5">
                          <BookOpen className="w-3.5 h-3.5 text-accent opacity-60" />
                          <p className="text-xs font-bold text-zinc-300">
                            {en.course?.title || 'System Redacted'}
                          </p>
                        </div>
                      </td>

                      <td className="p-6 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                        {en.createdAt ? new Date(en.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '---'}
                      </td>

                      <td className="p-6">
                        <span className={`text-[8px] px-2.5 py-1 rounded-lg uppercase font-black tracking-widest border shadow-lg ${
                            en.user?.isBlocked ? 'border-red-500/20 text-red-500 bg-red-500/5 shadow-red-500/5' : 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5 shadow-emerald-500/5'
                          }`}>
                          {en.user?.isBlocked ? 'Blocked' : 'Verified'}
                        </span>
                      </td>

                      <td className="p-6 text-right">
                        <button
                          onClick={() => navigate(`/admin/course-progress/${en.course?._id}`)}
                          className="p-3 bg-white/5 hover:bg-accent/20 text-accent rounded-xl transition-all hover:scale-110 border border-white/5"
                          title="View Student Progress"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          </div>
        </>
      )}

      {!loading && filtered?.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
          <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <User className="text-zinc-700" size={32} />
          </div>
          <h3 className="text-white font-black italic uppercase text-lg">No Records Captured</h3>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 max-w-xs mx-auto">The enrollment ledger is currently empty based on your filter parameters.</p>
        </motion.div>
      )}
    </div>
  );
};

export default Enrollments;