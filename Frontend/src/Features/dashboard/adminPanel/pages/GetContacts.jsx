import React, { useEffect, useState } from "react";
import { useContact } from "../../../auth/hooks/useContact";
import { GlassCard } from "../Shared/GlassCard";
import { Mail, Phone, Trash2, Search, Calendar, Clock, Inbox, Hash, MessageSquare, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const GetContacts = () => {
  const { fetchContacts, handleDeleteContact } = useContact();

  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchContacts();
        if (res?.data) setContacts(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = contacts?.filter((c) =>
    [c.name, c.email, c.phone, c.inquiryReason].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if(!window.confirm("Permanent removal of this lead?")) return;
    try {
      const res = await handleDeleteContact(id);
      if (res.success) {
        toast.success("Lead removed from ledger");
        setContacts((prev) => prev.filter((c) => c._id !== id));
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Process interrupted");
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-32 px-4 md:px-0">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white leading-none">
            Inbound Leads
          </h1>
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-accent mt-2">
            {contacts?.length || 0} callback deployments pending
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
              placeholder="Search via lead identity, contact channel or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </GlassCard>
      </motion.div>

      {/* DATA AREA */}
      {loading ? (
        <div className="py-20 text-center animate-pulse">
            <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Syncing Communication Ledger...</p>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW: CARDS */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filtered?.map((c, idx) => (
              <motion.div 
                key={c._id} 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard className="p-5 border-white/5 relative overflow-hidden group">
                   {/* Card Header */}
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-1 flex items-center gap-1">
                          <Hash size={10} /> Lead Registry
                        </p>
                        <h3 className="text-white font-bold text-sm tracking-tight">{c.name}</h3>
                      </div>
                      <button 
                        onClick={() => handleDelete(c._id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/10"
                      >
                        <Trash2 size={14} />
                      </button>
                   </div>

                   {/* Card Body */}
                   <div className="space-y-4 pt-3 border-t border-white/5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Phone</span>
                           <p className="text-[11px] text-zinc-300 flex items-center gap-2"><Phone size={10} className="text-accent"/> {c.phone}</p>
                        </div>
                        <div className="space-y-1">
                           <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Schedule</span>
                           <p className="text-[11px] text-zinc-300 flex items-center gap-2"><Clock size={10} className="text-accent"/> {c.preferredTime}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                         <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Inquiry Intent</span>
                         <p className="text-[11px] text-zinc-400 italic line-clamp-2 leading-relaxed">"{c.inquiryReason}"</p>
                      </div>
                   </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* DESKTOP VIEW: TABLE */}
          <div className="hidden md:block">
            <GlassCard className="overflow-hidden border-white/5 shadow-2xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-white/5 bg-white/[0.02]">
                    <th className="p-6 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Lead Profile</th>
                    <th className="p-6 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Contact Vector</th>
                    <th className="p-6 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Preferred Slot</th>
                    <th className="p-6 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Inquiry Notes</th>
                    <th className="p-6 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black text-right">Control</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered?.map((c) => (
                    <tr key={c._id} className="border-b border-white/5 hover:bg-white/[0.015] transition-all group">
                      
                      <td className="p-6">
                        <p className="text-sm font-black italic text-white tracking-tight uppercase group-hover:text-accent transition-colors">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight mt-0.5">
                          New Request
                        </p>
                      </td>

                      <td className="p-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2.5 text-[11px] font-medium text-zinc-400">
                            <Mail className="w-3.5 h-3.5 text-accent opacity-60" />
                            {c.email}
                          </div>
                          <div className="flex items-center gap-2.5 text-[11px] font-medium text-zinc-400">
                            <Phone className="w-3.5 h-3.5 text-accent opacity-60" />
                            {c.phone}
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2.5 text-[11px] font-bold text-zinc-300 uppercase tracking-tighter">
                            <Calendar className="w-3.5 h-3.5 text-accent opacity-60" />
                            {c.preferredDate}
                          </div>
                          <div className="flex items-center gap-2.5 text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">
                            <Clock className="w-3.5 h-3.5 text-zinc-600" />
                            {c.preferredTime}
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex items-start gap-2 max-w-[240px]">
                           <MessageSquare size={14} className="text-zinc-700 mt-1 flex-shrink-0" />
                           <p className="text-xs text-zinc-500 italic leading-relaxed line-clamp-2">
                             {c.inquiryReason}
                           </p>
                        </div>
                      </td>

                      <td className="p-6 text-right">
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="p-3 bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 rounded-xl transition-all hover:scale-110 border border-white/5"
                          title="Purge Record"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* EMPTY STATE */}
      {!loading && filtered?.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
          <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Inbox className="text-zinc-700" size={32} />
          </div>
          <h3 className="text-white font-black italic uppercase text-lg">Queue Exhausted</h3>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 max-w-xs mx-auto">No inbound lead deployments detected in the current filter.</p>
        </motion.div>
      )}
    </div>
  );
};

export default GetContacts;