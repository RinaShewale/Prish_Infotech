import React, { useEffect } from 'react';
import { GlassCard } from '../Shared/GlassCard';
import { Download, CheckCircle, Clock, XCircle, Loader2, AlertCircle } from 'lucide-react';
// 1. Switched to usePayment hook to get actual financial transactions
import { usePayment } from '../../Courses/hooks/usePayment'; 

const AdminPayments = () => {
  // 2. Destructure properties from usePayment hook
  const { allPayments, loading, error, fetchAllPayments } = usePayment();

  // 3. Fetch all transaction data on component mount
  useEffect(() => {
    fetchAllPayments();
  }, []);

  /**
   * Helper to style status badges based on Payment Model Enum: 
   * ["pending", "paid", "failed"]
   */
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'paid') return { color: 'text-emerald-500', icon: <CheckCircle size={12}/>, label: 'PAID' };
    if (s === 'failed') return { color: 'text-red-500', icon: <XCircle size={12}/>, label: 'FAILED' };
    return { color: 'text-orange-500', icon: <Clock size={12}/>, label: 'PENDING' };
  };

  // ERROR STATE UI
  if (error) {
    return (
      <GlassCard className="p-12 border-red-500/20 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={40} />
        <h2 className="text-xl font-bold text-white">Data Fetch Error</h2>
        <p className="text-slate-400 mt-2">{error}</p>
        <button 
          onClick={() => fetchAllPayments()}
          className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-all"
        >
          Try Again
        </button>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold italic">Transactions</h1>
          <p className="text-slate-500 text-sm mt-1">
            Showing {allPayments?.length || 0} financial records from the database.
          </p>
        </div>
        <button className="text-xs font-bold border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/5 transition-all active:scale-95">
          <Download size={14}/> Download Statement
        </button>
      </div>

      {/* TABLE SECTION */}
      <GlassCard className="overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="p-5 text-[10px] uppercase text-slate-500 font-black tracking-widest">Order ID</th>
                <th className="p-5 text-[10px] uppercase text-slate-500 font-black tracking-widest">Student</th>
                <th className="p-5 text-[10px] uppercase text-slate-500 font-black tracking-widest">Course</th>
                <th className="p-5 text-[10px] uppercase text-slate-500 font-black tracking-widest">Amount</th>
                <th className="p-5 text-[10px] uppercase text-slate-500 font-black tracking-widest">Status</th>
                <th className="p-5 text-[10px] uppercase text-slate-500 font-black tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // LOADING STATE
                <tr>
                  <td colSpan="6" className="p-24 text-center">
                    <Loader2 className="animate-spin mx-auto text-accent mb-4" size={32} />
                    <span className="text-slate-400 text-sm font-medium animate-pulse">Syncing transactions...</span>
                  </td>
                </tr>
              ) : allPayments?.length > 0 ? (
                // DATA STATE
                allPayments.map((txn) => {
                  const status = getStatusStyle(txn.paymentStatus);
                  
                  return (
                    <tr key={txn._id} className="border-b border-white/5 hover:bg-white/[0.01] transition-all group">
                      {/* Mapping to razorpayOrderId from your Payment Model */}
                      <td className="p-5 text-xs font-mono text-slate-400 group-hover:text-accent transition-colors">
                        {txn.razorpayOrderId || txn._id.slice(-10).toUpperCase()}
                      </td>
                      
                      {/* Mapping to User Model (Populated) */}
                      <td className="p-5">
                        <p className="text-sm font-bold text-white leading-none">
                          {txn.user?.name || "Unknown Student"}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {txn.user?.email || "No email available"}
                        </p>
                      </td>

                      {/* Mapping to Course Model (Populated) */}
                      <td className="p-5">
                        <p className="text-xs text-slate-300 font-medium truncate max-w-[200px]">
                          {txn.course?.title || "Course Not Found"}
                        </p>
                      </td>

                      {/* Mapping to totalAmount from Payment Model */}
                      <td className="p-5 font-bold text-white text-sm">
                        ₹{txn.totalAmount?.toLocaleString('en-IN') || txn.amount || '0'}
                      </td>

                      {/* Status Badge */}
                      <td className="p-5">
                        <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter ${status.color}`}>
                          {status.icon}
                          {status.label}
                        </div>
                      </td>

                      {/* Date Formatting */}
                      <td className="p-5 text-right text-[11px] font-medium text-slate-500">
                        {txn.paidAt || txn.createdAt ? (
                          new Date(txn.paidAt || txn.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })
                        ) : '---'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                // EMPTY STATE
                <tr>
                  <td colSpan="6" className="p-24 text-center">
                    <div className="bg-white/5 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="text-slate-600" size={24} />
                    </div>
                    <p className="text-slate-500 font-medium">No transactions found in the records.</p>
                    <p className="text-slate-600 text-xs mt-1">Payments will appear here once students start purchasing courses.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminPayments;