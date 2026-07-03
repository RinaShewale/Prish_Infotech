import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, PlusCircle, Trash2, Edit2, X, Save, 
  Layers, MapPin, ExternalLink, Loader2, Filter, ChevronDown
} from 'lucide-react';

import { useBootcamp } from '../../Courses/hooks/useBootcamp';
import { GlassCard } from '../Shared/GlassCard';
import { TableSkeleton } from '../Shared/TableSkeleton';

const AdminBootcamp = () => {
  const navigate = useNavigate();
  
  // autoFetch = false because we want to call loadAdminBootcamps specifically
  const { bootcamps, loading, loadAdminBootcamps, deleteBootcamp, error } = useBootcamp(false);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Load Admin Data on Mount
  useEffect(() => {
    loadAdminBootcamps();
  }, [loadAdminBootcamps]);

  // Filtering Logic
  const filtered = useMemo(() => {
    if (!Array.isArray(bootcamps)) return [];
    return bootcamps.filter((b) => {
      const matchSearch = b.title?.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || b.type === filterType;
      return matchSearch && matchType;
    });
  }, [bootcamps, search, filterType]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete ${title}?`)) return;
    const res = await deleteBootcamp(id);
    if (res.success) {
      toast.success("Program removed successfully");
      loadAdminBootcamps(); // Refresh the list
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-[1400px] mx-auto px-4 pt-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white italic tracking-tight">
            Bootcamp <span className="text-accent">Registry</span>
          </h1>
          <p className="text-text-secondary mt-2 font-medium">
            Currently managing {bootcamps?.length || 0} deployed cohorts.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/admin/bootcamps/manage')}
          className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-2xl font-black hover:brightness-110 transition-all shadow-lg shadow-accent/20 active:scale-95"
        >
          <PlusCircle size={20} />
          <span className="text-xs uppercase tracking-widest">Create New Program</span>
        </button>
      </div>

      {/* --- SEARCH & FILTERS --- */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-accent transition-colors" />
          <input
            className="w-full bg-card border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-accent transition-all"
            placeholder="Search by bootcamp title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative md:w-64">
            <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full h-full px-6 py-4 bg-card border border-border/50 rounded-2xl outline-none text-xs font-bold text-white appearance-none cursor-pointer hover:border-accent/50 transition-colors"
            >
                <option value="all">All Delivery Modes</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={14} />
        </div>
      </div>

      {/* --- TABLE --- */}
      <GlassCard className="overflow-hidden !rounded-[2.5rem] border-border/40 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-border/50 bg-white/[0.02]">
                <th className="p-6 text-[10px] uppercase tracking-[0.25em] text-text-secondary font-black">Program Detail</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.25em] text-text-secondary font-black">Mode</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.25em] text-text-secondary font-black">Level</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.25em] text-text-secondary font-black">Investment</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.25em] text-text-secondary font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                <TableSkeleton rows={5} cols={5} />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                        <Layers size={48} />
                        <p className="font-bold uppercase tracking-widest text-xs">No records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id} className="group hover:bg-white/[0.03] transition-all">
                    <td className="p-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-bg border border-border flex items-center justify-center text-accent shadow-inner">
                            <Layers size={20} />
                        </div>
                        <div>
                          <p className="text-base font-display font-bold text-white group-hover:text-accent transition-colors">{item.title}</p>
                          <p className="text-[10px] text-text-secondary font-medium uppercase tracking-tighter mt-1">
                             {item.duration || 'Flexible Duration'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`text-[9px] px-3 py-1.5 rounded-lg font-black uppercase tracking-wider border ${
                        item.type === 'online'
                        ? 'border-accent/30 bg-accent/10 text-accent'
                        : 'border-orange-500/30 bg-orange-500/10 text-orange-400'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="text-[10px] font-bold uppercase text-text-secondary">
                        {item.level}
                      </span>
                    </td>
                    <td className="p-6">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white font-mono">₹{item.discountedPrice?.toLocaleString()}</span>
                            <span className="text-[10px] text-text-secondary line-through opacity-40 font-mono">₹{item.price?.toLocaleString()}</span>
                        </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3">
                        {/* DEEP EDITOR LINK */}
                        <button
                           onClick={() => navigate(`/admin/bootcamps/manage/${item._id}`)}
                          className="p-3 bg-white/5 hover:bg-accent/20 rounded-xl text-text-secondary hover:text-accent transition-all active:scale-90"
                          title="Full Curriculum Editor"
                        >
                          <Edit2 size={18} />
                        </button>
                        
                        
                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => handleDelete(item._id, item.title)}
                          className="p-3 bg-white/5 hover:bg-red-500/20 rounded-xl text-text-secondary hover:text-red-500 transition-all active:scale-90"
                          title="Erase Record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* --- ERROR FOOTER --- */}
      {error && (
         <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center">
            System Error: {error}
         </div>
      )}
    </div>
  );
};

export default AdminBootcamp;