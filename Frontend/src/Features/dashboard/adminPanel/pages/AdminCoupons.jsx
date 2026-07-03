import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GlassCard } from '../Shared/GlassCard';
import { 
  Search, PlusCircle, Edit2, Trash2, CheckCircle2, 
  XCircle, Sparkles, Loader2, ChevronDown, Check, 
  Ticket, Calendar, Percent, IndianRupee, Layers, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../../auth/services/api';

// --- CUSTOM THEMED DROPDOWN ---
const ThemedSelect = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    const handleClick = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const selected = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 ml-1 font-black">{label}</span>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={`w-full flex items-center justify-between bg-white/[0.03] border ${isOpen ? 'border-accent/50' : 'border-white/10'} rounded-xl px-4 py-3 text-xs text-white transition-all`}>
        <span className="font-bold">{selected.label}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180 text-accent' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 2 }} exit={{ opacity: 0, y: 5 }} className="absolute z-[100] w-full bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl p-1">
            {options.map((opt) => (
              <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setIsOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg text-xs flex justify-between items-center ${value === opt.value ? 'bg-accent/10 text-accent font-bold' : 'text-zinc-400 hover:bg-white/5'}`}>
                {opt.label} {value === opt.value && <Check size={12} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const emptyForm = {
  code: '', name: '', description: '', discountType: 'percent', discountValue: '', maxDiscount: '', minAmount: '',
  applicableTo: 'all', usageLimit: '', perUserLimit: '1', startsAt: '', expiresAt: '', active: true,
  isPublic: true, firstTimeUserOnly: false, stackable: false, adminNotes: '',
};

const AdminCoupons = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/coupon/admin');
      setCoupons(data.coupons || []);
    } catch (error) { toast.error('Failed to load coupons'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const filtered = useMemo(() => coupons.filter(c => [c.code, c.name].join(' ').toLowerCase().includes(search.toLowerCase())), [coupons, search]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, discountValue: Number(form.discountValue), usageLimit: Number(form.usageLimit) };
      if (editingId) await API.put(`/coupon/${editingId}`, payload);
      else await API.post('/coupon/create', payload);
      toast.success(editingId ? 'Updated!' : 'Created!');
      setForm(emptyForm); setEditingId(null); fetchCoupons();
    } catch (error) { toast.error(error?.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-8 pb-20 px-4 md:px-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold italic">Coupons</h1>
          <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest text-[10px] font-black">Growth & Retention Engine</p>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="w-full md:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all uppercase tracking-widest">Dashboard</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT: FORM SECTION */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6 md:p-8 border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
               <div className="p-2 bg-accent/10 rounded-lg text-accent"><Sparkles size={20}/></div>
               <h2 className="text-xl font-bold">{editingId ? 'Edit Campaign' : 'New Coupon Campaign'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Identity */}
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Campaign Name"><input name="name" value={form.name} onChange={handleChange} placeholder="Summer Sale 2024" className="input-modern" /></Field>
                <Field label="Coupon Code"><input name="code" value={form.code} onChange={handleChange} placeholder="SUMMER50" className="input-modern uppercase font-mono tracking-widest" /></Field>
              </div>

              {/* Section 2: Values */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ThemedSelect label="Type" value={form.discountType} options={[{label:'Percent %', value:'percent'}, {label:'Fixed ₹', value:'fixed'}]} onChange={(v) => setForm(p => ({...p, discountType: v}))} />
                <Field label="Value"><input type="number" name="discountValue" value={form.discountValue} onChange={handleChange} className="input-modern" /></Field>
                <Field label="Min Spend"><input type="number" name="minAmount" value={form.minAmount} onChange={handleChange} className="input-modern" /></Field>
                <Field label="Max Cap"><input type="number" name="maxDiscount" value={form.maxDiscount} onChange={handleChange} className="input-modern" /></Field>
              </div>

              {/* Section 3: Restrictions & Limits */}
              <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                <Field label="Total Usage Limit"><input type="number" name="usageLimit" value={form.usageLimit} onChange={handleChange} className="input-modern" /></Field>
                <Field label="Starts On"><input type="date" name="startsAt" value={form.startsAt} onChange={handleChange} className="input-modern" /></Field>
                <Field label="Expires On"><input type="date" name="expiresAt" value={form.expiresAt} onChange={handleChange} className="input-modern" /></Field>
              </div>

              {/* PREVIEW WIDGET */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/20 to-transparent border border-accent/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform"><Ticket size={80}/></div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">Live Preview</p>
                    <h3 className="text-2xl font-black italic">{form.code || 'CODE'}</h3>
                    <p className="text-xs text-zinc-400 mt-1">{form.discountType === 'percent' ? `${form.discountValue || 0}% OFF` : `₹${form.discountValue || 0} FLAT OFF`} • Min spend ₹{form.minAmount || 0}</p>
                    
                    <div className="flex gap-4 mt-4">
                       <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-tighter text-zinc-300 cursor-pointer">
                         <input type="checkbox" name="firstTimeUserOnly" checked={form.firstTimeUserOnly} onChange={handleChange} className="accent-accent w-3 h-3" /> 1st Time Only
                       </label>
                       <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-tighter text-zinc-300 cursor-pointer">
                         <input type="checkbox" name="stackable" checked={form.stackable} onChange={handleChange} className="accent-accent w-3 h-3" /> Stackable
                       </label>
                    </div>
                  </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-accent text-white font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)] transition-all">
                  {saving ? <Loader2 className="animate-spin" size={18}/> : editingId ? <Edit2 size={18}/> : <PlusCircle size={18}/>}
                  {editingId ? 'Update Campaign' : 'Launch Campaign'}
                </button>
                {editingId && <button type="button" onClick={() => {setEditingId(null); setForm(emptyForm);}} className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 font-bold uppercase text-[10px]">Cancel</button>}
              </div>
            </form>
          </GlassCard>
        </div>

        {/* RIGHT: LIST SECTION */}
        <div className="space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-accent transition-colors" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search coupons..." className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-accent/50 transition-all outline-none" />
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Active Offers ({filtered.length})</h3>
            {loading ? (
               <div className="p-12 text-center text-zinc-600 font-bold animate-pulse">Fetching records...</div>
            ) : filtered.length === 0 ? (
               <div className="p-12 text-center text-zinc-600 italic border border-dashed border-white/5 rounded-2xl">No campaigns found.</div>
            ) : (
              filtered.map((coupon) => (
                <GlassCard key={coupon._id} className="p-4 border-white/5 hover:border-accent/30 transition-all group overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black italic tracking-wider">{coupon.code}</span>
                        {coupon.active ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> : <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1 font-bold">{coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} OFF • {coupon.usageCount || 0}/{coupon.usageLimit || '∞'} Used</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                       <button onClick={() => { setEditingId(coupon._id); setForm({...coupon, startsAt: coupon.startsAt?.slice(0,10), expiresAt: coupon.expiresAt?.slice(0,10)}) }} className="p-2 rounded-lg bg-white/5 hover:bg-accent/20 text-zinc-400 hover:text-accent transition-colors"><Edit2 size={14}/></button>
                       <button onClick={async () => { if(window.confirm('Delete?')) { await API.delete(`/coupon/${coupon._id}`); fetchCoupons(); } }} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        :root { --accent-rgb: 124, 58, 237; }
        .input-modern {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
          transition: all 0.3s ease;
        }
        .input-modern:focus { border-color: rgba(var(--accent-rgb), 0.5); box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.1); }
      `}</style>
    </div>
  );
};

const Field = ({ label, children, className = '' }) => (
  <label className={`space-y-2 flex flex-col ${className}`}>
    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 ml-1 font-black">{label}</span>
    {children}
  </label>
);

export default AdminCoupons;