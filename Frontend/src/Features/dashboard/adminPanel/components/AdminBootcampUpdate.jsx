import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, ArrowLeft, Loader2, X, Star, ShieldCheck, Plus, 
  Calendar, BookOpen, Settings2, ChevronDown, ListPlus, Trash, Trash2
} from 'lucide-react';

import { useBootcamp } from '../../Courses/hooks/useBootcamp';
import { FluidBackground } from "../../Home/components/FluidBackground";

const emptyForm = {
  title: '',
  description: '',
  type: 'online',
  level: 'beginner',
  duration: '',
  price: 0,
  discountedPrice: 0,
  location: '',
  batch: { year: new Date().getFullYear(), startDate: '', endDate: '', isActive: true, label: '' },
  syllabus: [{ title: '', content: [{ subtitle: '', items: [''] }] }],
  highlights: [''],
  features: [{ title: '', enabled: true }],
  isActive: true
};

const AdminBootcampUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Extract ID from URL

  const { bootcamp, loading, loadBootcamp, updateBootcamp } = useBootcamp(false);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState('general');

  // 1. Fetch data on mount
  useEffect(() => {
    if (id) loadBootcamp(id);
  }, [id, loadBootcamp]);

  // 2. Sync fetched data to local form state
  useEffect(() => {
    if (bootcamp && bootcamp._id === id) {
      setForm({
        ...bootcamp,
        batch: {
          ...bootcamp.batch,
          startDate: bootcamp.batch?.startDate ? bootcamp.batch.startDate.split('T')[0] : '',
          endDate: bootcamp.batch?.endDate ? bootcamp.batch.endDate.split('T')[0] : '',
        }
      });
    }
  }, [bootcamp, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value) }));
  };

  const handleBatchChange = (field, value) => {
    setForm(prev => ({ ...prev, batch: { ...prev.batch, [field]: field === 'year' ? Number(value) : value } }));
  };

  const updateSyllabusModule = (mIdx, field, value) => {
    const newSyllabus = [...form.syllabus];
    newSyllabus[mIdx] = { ...newSyllabus[mIdx], [field]: value };
    setForm(prev => ({ ...prev, syllabus: newSyllabus }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        highlights: form.highlights.filter(h => h.trim() !== ''),
        features: form.features.filter(f => f.title.trim() !== ''),
        syllabus: form.syllabus.filter(s => s.title.trim() !== '')
      };

      const res = await updateBootcamp(id, payload);
      if (res.success) {
        toast.success("Program Updated Successfully");
        navigate('/admin/bootcamps');
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("System Error: Could not update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-accent" size={40} />
        <p className="text-text-secondary text-xs font-black uppercase tracking-widest">Retrieving Record...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text font-sans pb-20">
      <FluidBackground />
      
      {/* HEADER */}
      <nav className="sticky top-0 z-[100] h-20 bg-bg/80 backdrop-blur-2xl border-b border-border/50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate('/admin/bootcamps')} className="p-2.5 glass hover:bg-card-hover rounded-xl transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl text-gradient">Edit: {bootcamp?.title}</h1>
            <p className="text-[9px] text-accent uppercase tracking-widest font-black">Curriculum Editor</p>
          </div>
        </div>
        <button 
          form="edit-form" 
          disabled={saving} 
          className="bg-accent text-white px-8 py-3 rounded-xl font-bold uppercase text-[10px] flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save Changes
        </button>
      </nav>

      <main className="max-w-6xl mx-auto py-12 px-4 relative z-10">
        {/* TABS */}
        <div className="flex glass p-1 rounded-2xl w-fit mx-auto mb-16 shadow-xl">
          {['general', 'batch', 'syllabus', 'extras'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'text-white' : 'text-text-secondary hover:text-text'}`}
            >
              {tab}
              {activeTab === tab && <motion.div layoutId="activeTab" className="absolute inset-0 bg-accent rounded-xl -z-10" />}
            </button>
          ))}
        </div>

        <form id="edit-form" onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
             {/* Use the same Field components and UI blocks from your create page here */}
             {activeTab === 'general' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-8 glass p-10 rounded-[2.5rem]">
                <Field label="Program Title" className="col-span-2">
                    <input name="title" value={form.title} onChange={handleChange} className="admin-input" />
                </Field>
                <Field label="Description" className="col-span-2">
                    <textarea name="description" value={form.description} onChange={handleChange} className="admin-input min-h-[100px]" />
                </Field>
                <Field label="Standard Price"><input type="number" name="price" value={form.price} onChange={handleChange} className="admin-input" /></Field>
                <Field label="Sale Price"><input type="number" name="discountedPrice" value={form.discountedPrice} onChange={handleChange} className="admin-input" /></Field>
              </motion.div>
            )}

            {activeTab === 'syllabus' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {form.syllabus.map((mod, mIdx) => (
                  <div key={mIdx} className="glass rounded-[2rem] overflow-hidden">
                    <div className="p-6 bg-white/[0.03] border-b border-border/50 flex items-center gap-4">
                       <input value={mod.title} onChange={(e) => updateSyllabusModule(mIdx, 'title', e.target.value)} className="bg-transparent border-none text-lg font-bold text-white outline-none flex-1" />
                       <button type="button" onClick={() => setForm({ ...form, syllabus: form.syllabus.filter((_, i) => i !== mIdx) })} className="text-red-400"><Trash2 size={18} /></button>
                    </div>
                    {/* Nested items logic remains same as your original code */}
                  </div>
                ))}
                <button type="button" onClick={() => setForm(prev => ({ ...prev, syllabus: [...prev.syllabus, { title: 'New Module', content: [{ subtitle: '', items: [''] }] }] }))} className="bg-accent/10 text-accent p-4 rounded-xl w-full font-bold text-xs uppercase">+ Add Module</button>
              </motion.div>
            )}

            {/* Batch and Extras tabs follow same structure as your Create page... */}
          </AnimatePresence>
        </form>
      </main>

      <style>{`.admin-input { width: 100%; background: rgba(15, 15, 20, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 18px; padding: 14px 20px; color: white; outline: none; transition: 0.3s; } .admin-input:focus { border-color: #3b82f6; }`}</style>
    </div>
  );
};

const Field = ({ label, children, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-text-secondary/80 ml-1">{label}</label>
    {children}
  </div>
);

export default AdminBootcampUpdate;