import React, { useEffect } from 'react';
import { GlassCard } from '../Shared/GlassCard';
import { Download, CheckCircle, Clock, XCircle, Loader2, AlertCircle, User, BookOpen, Calendar, Hash } from 'lucide-react';
import { usePayment } from '../../Courses/hooks/usePayment'; 

const AdminPayments = () => {
  const { allPayments, loading, error, fetchAllPayments } = usePayment();

  useEffect(() => {
    fetchAllPayments();
  }, []);

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'paid') return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: <CheckCircle size={10}/>, label: 'PAID' };
    if (s === 'failed') return { color: 'text-red-500', bg: 'bg-red-500/10', icon: <XCircle size={10}/>, label: 'FAILED' };
    return { color: 'text-orange-500', bg: 'bg-orange-500/10', icon: <Clock size={10}/>, label: 'PENDING' };
  };

  if (error) {
    return (
      <div className="p-4 md:p-0">
        <GlassCard className="p-8 md:p-12 border-red-500/20 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={40} />
          <h2 className="text-xl font-bold text-white">Data Fetch Error</h2>
          <p className="text-slate-400 mt-2 text-sm">{error}</p>
          <button 
            onClick={() => fetchAllPayments()}
            className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-all"
          >
            Try Again
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 px-4 md:px-0 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold italic">Transactions</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            Showing {allPayments?.length || 0} financial records.
          </p>
        </div>
        <button className="w-full sm:w-auto text-[10px] md:text-xs font-black uppercase tracking-widest border border-white/10 px-5 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all active:scale-95 bg-white/[0.02]">
          <Download size={14}/> Download Statement
        </button>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <GlassCard className="p-20 text-center border-white/5">
          <Loader2 className="animate-spin mx-auto text-purple-500 mb-4" size={32} />
          <span className="text-slate-400 text-sm font-medium animate-pulse uppercase tracking-widest">Syncing ledger...</span>
        </GlassCard>
      ) : allPayments?.length > 0 ? (
        <>
          {/* MOBILE VIEW (CARDS) - Visible only on small screens */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {allPayments.map((txn) => {
              const status = getStatusStyle(txn.paymentStatus);
              return (
                <GlassCard key={txn._id} className="p-5 space-y-4 border-white/5 relative overflow-hidden">
                   {/* Background Decor */}
                   <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-10 ${status.color.replace('text', 'bg')}`} />
                   
                   <div className="flex justify-between items-start relative z-10">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                          <Hash size={10}/> {txn.razorpayOrderId?.slice(-12) || txn._id.slice(-8).toUpperCase()}
                        </p>
                        <h3 className="text-white font-bold">{txn.user?.name || "Unknown"}</h3>
                        <p className="text-[10px] text-slate-400">{txn.user?.email}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-md flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter ${status.color} ${status.bg}`}>
                        {status.icon} {status.label}
                      </div>
                   </div>

                   <div className="pt-3 border-t border-white/5 flex flex-col gap-2 relative z-10">
                      <div className="flex items-center gap-2 text-slate-400">
                        <BookOpen size={12} className="text-slate-600"/>
                        <p className="text-[11px] font-medium truncate">{txn.course?.title || "N/A"}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar size={12}/>
                          <span className="text-[10px]">{new Date(txn.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-white font-black text-lg">₹{txn.totalAmount?.toLocaleString('en-IN')}</p>
                      </div>
                   </div>
                </GlassCard>
              );
            })}
          </div>

          {/* DESKTOP VIEW (TABLE) - Visible on medium screens and up */}
          <div className="hidden md:block">
            <GlassCard className="overflow-hidden border-white/5 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white/[0.03] border-b border-white/5">
                    <tr>
                      <th className="p-5 text-[10px] lg:text-[11px] uppercase text-slate-500 font-black tracking-[0.2em]">Ref ID</th>
                      <th className="p-5 text-[10px] lg:text-[11px] uppercase text-slate-500 font-black tracking-[0.2em]">Student Details</th>
                      <th className="p-5 text-[10px] lg:text-[11px] uppercase text-slate-500 font-black tracking-[0.2em]">Course Name</th>
                      <th className="p-5 text-[10px] lg:text-[11px] uppercase text-slate-500 font-black tracking-[0.2em]">Amount</th>
                      <th className="p-5 text-[10px] lg:text-[11px] uppercase text-slate-500 font-black tracking-[0.2em]">Status</th>
                      <th className="p-5 text-[10px] lg:text-[11px] uppercase text-slate-500 font-black tracking-[0.2em] text-right">Processed On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPayments.map((txn) => {
                      const status = getStatusStyle(txn.paymentStatus);
                      return (
                        <tr key={txn._id} className="border-b border-white/5 hover:bg-white/[0.015] transition-all group">
                          <td className="p-5 text-[11px] font-mono text-slate-500 group-hover:text-accent transition-colors">
                            {txn.razorpayOrderId || txn._id.slice(-10).toUpperCase()}
                          </td>
                          <td className="p-5">
                            <p className="text-sm font-bold text-white leading-none tracking-tight">
                              {txn.user?.name || "Anonymous User"}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1.5 font-medium italic">
                              {txn.user?.email || "No email"}
                            </p>
                          </td>
                          <td className="p-5">
                            <p className="text-xs text-slate-300 font-semibold truncate max-w-[150px] lg:max-w-[250px]">
                              {txn.course?.title || "Unavailable"}
                            </p>
                          </td>
                          <td className="p-5 font-black text-white text-sm">
                            ₹{txn.totalAmount?.toLocaleString('en-IN')}
                          </td>
                          <td className="p-5">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${status.color} ${status.bg}`}>
                              {status.icon}
                              {status.label}
                            </div>
                          </td>
                          <td className="p-5 text-right text-[11px] font-bold text-slate-500">
                            {new Date(txn.paidAt || txn.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        </>
      ) : (
        /* EMPTY STATE */
        <GlassCard className="p-16 md:p-24 text-center border-white/5">
          <div className="bg-white/5 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 group hover:rotate-0 transition-transform duration-500">
            <Clock className="text-slate-600" size={32} />
          </div>
          <p className="text-slate-400 font-bold text-lg">No records found</p>
          <p className="text-slate-600 text-xs mt-2 max-w-xs mx-auto">Transactions will be listed here automatically as soon as purchases occur.</p>
        </GlassCard>
      )}
    </div>
  );
};

export default AdminPayments;