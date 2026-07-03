import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  Trash2, Save, ArrowLeft, Loader2,
  X, Star, ShieldCheck, Plus, Calendar, BookOpen, Settings2,
  ChevronDown, ListPlus, GripVertical, Sparkles
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

const AdminBootcampManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { 
    bootcamp, 
    loading, 
    loadBootcamp, 
    createBootcamp, 
    updateBootcamp 
  } = useBootcamp(false);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (id) loadBootcamp(id);
  }, [id, loadBootcamp]);

  useEffect(() => {
    if (id && bootcamp && bootcamp._id === id) handleEdit(bootcamp);
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
    if (!form.title || !form.price) return toast.error("Title and Price are required!");
    setSaving(true);
    
    const targetId = editingId || id;
    try {
      const payload = {
        ...form,
        highlights: form.highlights.filter(h => h.trim() !== ''),
        features: form.features.filter(f => f.title.trim() !== ''),
        syllabus: form.syllabus.filter(s => s.title.trim() !== '')
      };
      const res = targetId ? await updateBootcamp(targetId, payload) : await createBootcamp(payload);
      if (res.success) {
        toast.success(targetId ? "Program Updated" : "Program Created");
        if (id) navigate('/admin/bootcamps');
        else resetForm();
      }
    } catch (err) { 
        toast.error("Error saving bootcamp"); 
    } finally { 
        setSaving(false); 
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setActiveTab('general');
    if (id) navigate('/admin/bootcamps/manage');
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      ...item,
      batch: {
        ...item.batch,
        startDate: item.batch?.startDate ? item.batch.startDate.split('T')[0] : '',
        endDate: item.batch?.endDate ? item.batch.endDate.split('T')[0] : '',
      }
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings2 size={16}/> },
    { id: 'batch', label: 'Batch', icon: <Calendar size={16}/> },
    { id: 'syllabus', label: 'Syllabus', icon: <BookOpen size={16}/> },
    { id: 'extras', label: 'Extras', icon: <Star size={16}/> },
  ];

  return (
    <div className="min-h-screen bg-bg text-text font-sans pb-32 selection:bg-accent/30 selection:text-text">
      <div className="noise-bg" />
      <FluidBackground />

      {/* --- REFINED NAV --- */}
      <nav className="sticky top-0 z-[100] h-20 bg-bg/40 backdrop-blur-3xl border-b border-white/5 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate(-1)} className="p-2.5 glass rounded-xl transition-all hover:bg-accent/10 group active:scale-95 border border-white/5">
            <ArrowLeft size={18} className="text-text-secondary group-hover:text-accent transition-colors" />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight text-gradient flex items-center gap-2">
              {(editingId || id) ? 'Edit Experience' : 'New Program'}
              <Sparkles size={14} className="text-accent animate-pulse" />
            </h1>
            <p className="text-[9px] text-accent uppercase tracking-[0.3em] font-black opacity-80">Admin Control Panel</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          {(editingId || id) && (
            <button onClick={resetForm} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-white transition-colors hidden sm:block">
              Discard Changes
            </button>
          )}
          <button 
            form="bootcamp-form" 
            disabled={saving} 
            className="group relative bg-accent text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(var(--color-accent-rgb),0.4)] active:scale-95 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center gap-2">
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {(editingId || id) ? 'Update' : 'Deploy'}
            </span>
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-12 md:py-16 px-4 relative z-10">
        
        {/* --- IMPROVED TABS --- */}
        <div className="flex glass p-1.5 rounded-2xl w-full md:w-fit mx-auto mb-12 shadow-2xl border border-white/5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 md:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-3 z-10 ${activeTab === tab.id ? 'text-white' : 'text-text-secondary hover:text-text'}`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-accent rounded-xl -z-10 shadow-lg shadow-accent/20" transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }} />
              )}
            </button>
          ))}
        </div>

        <form id="bootcamp-form" onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            
            {activeTab === 'general' && (
              <motion.div 
                key="general" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 glass p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 blur-[100px] -z-10 rounded-full" />
                
                <Field label="Program Title" important className="md:col-span-2">
                    <input name="title" value={form.title} onChange={handleChange} className="admin-input text-xl font-display font-bold !bg-white/[0.02]" placeholder="e.g. Advanced UI/UX Studio" />
                </Field>

                <Field label="Narrative Description" className="md:col-span-2">
                    <textarea name="description" value={form.description} onChange={handleChange} className="admin-input min-h-[140px] py-5 leading-relaxed resize-none !bg-white/[0.02]" placeholder="Describe the journey..." />
                </Field>

                <Field label="Delivery Format">
                  <div className="relative group">
                    <select name="type" value={form.type} onChange={handleChange} className="admin-input appearance-none cursor-pointer pr-10 font-bold text-accent !bg-white/[0.02]">
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary group-hover:text-accent transition-colors pointer-events-none" size={18} />
                  </div>
                </Field>

                <Field label="Experience Level">
                  <div className="relative group">
                    <select name="level" value={form.level} onChange={handleChange} className="admin-input appearance-none cursor-pointer pr-10 !bg-white/[0.02]">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                  </div>
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:col-span-2 pt-10 mt-6 border-t border-white/5">
                  <Field label="Tuition Fee (INR)"><input type="number" name="price" value={form.price} onChange={handleChange} className="admin-input !text-accent font-black tracking-tighter !bg-white/[0.02]" /></Field>
                  <Field label="Scholarship Price"><input type="number" name="discountedPrice" value={form.discountedPrice} onChange={handleChange} className="admin-input text-text-secondary !bg-white/[0.02]" /></Field>
                  <Field label="Duration"><input name="duration" value={form.duration} onChange={handleChange} className="admin-input !bg-white/[0.02]" placeholder="e.g. 12 Weeks" /></Field>
                  <Field label="Base Location"><input name="location" value={form.location} onChange={handleChange} className="admin-input !bg-white/[0.02]" placeholder="e.g. Remote" /></Field>
                </div>
              </motion.div>
            )}

            {activeTab === 'batch' && (
              <motion.div key="batch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 glass p-8 md:p-12 rounded-[2.5rem] border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Field label="Year"><input type="number" value={form.batch.year} onChange={(e) => handleBatchChange('year', e.target.value)} className="admin-input !bg-white/[0.02]" /></Field>
                  <Field label="Batch Label"><input value={form.batch.label} onChange={(e) => handleBatchChange('label', e.target.value)} className="admin-input !bg-white/[0.02]" placeholder="COHORT_X" /></Field>
                  <Field label="Status">
                    <div className="relative group">
                        <select value={form.batch.isActive} onChange={(e) => handleBatchChange('isActive', e.target.value === 'true')} className="admin-input appearance-none pr-10 !bg-white/[0.02]">
                            <option value="true">Open Admissions</option>
                            <option value="false">Closed / Waitlist</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                    </div>
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-black/40 rounded-[2rem] border border-white/5">
                  <Field label="Starts On"><input type="date" value={form.batch.startDate} onChange={(e) => handleBatchChange('startDate', e.target.value)} className="admin-input" /></Field>
                  <Field label="Ends On"><input type="date" value={form.batch.endDate} onChange={(e) => handleBatchChange('endDate', e.target.value)} className="admin-input" /></Field>
                </div>
              </motion.div>
            )}

            {activeTab === 'syllabus' && (
              <motion.div key="syllabus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="flex justify-between items-center px-4">
                  <div>
                    <h3 className="text-2xl font-display font-bold">Curriculum</h3>
                    <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.3em]">Structured Learning Path</p>
                  </div>
                  <button type="button" onClick={() => setForm(prev => ({ ...prev, syllabus: [...prev.syllabus, { title: '', content: [{ subtitle: '', items: [''] }] }] }))} 
                    className="flex items-center gap-2 px-6 py-3 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-xl text-[10px] font-black transition-all border border-accent/20">
                    <Plus size={16} /> ADD MODULE
                  </button>
                </div>

                <div className="space-y-8">
                {form.syllabus.map((mod, mIdx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={mIdx} 
                    className="glass rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-accent/20 transition-all shadow-xl group/mod"
                  >
                    <div className="p-6 md:p-8 bg-white/[0.03] border-b border-white/5 flex items-center gap-6">
                       <span className="w-12 h-12 rounded-2xl bg-bg flex items-center justify-center text-xs font-black text-accent border border-white/5 group-hover/mod:border-accent/50 transition-colors shadow-inner">
                         {mIdx + 1 < 10 ? `0${mIdx + 1}` : mIdx + 1}
                       </span>
                       <input value={mod.title} onChange={(e) => updateSyllabusModule(mIdx, 'title', e.target.value)} className="bg-transparent border-none text-lg font-display font-bold text-text outline-none flex-1 placeholder:opacity-20" placeholder="Module Title" />
                       <button type="button" onClick={() => setForm({ ...form, syllabus: form.syllabus.filter((_, i) => i !== mIdx) })} className="p-2 text-text-secondary hover:text-red-500 transition-colors opacity-0 group-hover/mod:opacity-100"><Trash2 size={18} /></button>
                    </div>
                    
                    <div className="p-8 md:p-12 space-y-12">
                      {mod.content.map((cont, cIdx) => (
                        <div key={cIdx} className="relative pl-10 border-l border-white/10 space-y-6 group/topic">
                          <div className="absolute top-0 left-[-4.5px] w-[8px] h-[8px] rounded-full bg-accent ring-4 ring-accent/10" />
                          
                          <input placeholder="Topic Subtitle" value={cont.subtitle} onChange={(e) => {
                            const newC = [...mod.content]; newC[cIdx].subtitle = e.target.value; updateSyllabusModule(mIdx, 'content', newC);
                          }} className="bg-transparent border-none text-accent font-display font-black text-xs md:text-sm w-full outline-none tracking-widest uppercase" />
                          
                          <div className="grid gap-3">
                            <LayoutGroup>
                            {cont.items.map((item, iIdx) => (
                              <motion.div layout key={iIdx} className="flex gap-3 group/item">
                                <div className="flex-1 relative">
                                    <input value={item} onChange={(e) => {
                                      const newC = [...mod.content]; newC[cIdx].items[iIdx] = e.target.value; updateSyllabusModule(mIdx, 'content', newC);
                                    }} className="admin-input !py-3 !text-xs !bg-black/20 border-white/5 focus:!bg-black/40" placeholder="Detailed point..." />
                                </div>
                                {cont.items.length > 1 && (
                                    <button type="button" onClick={() => {
                                        const newC = [...mod.content]; newC[cIdx].items.splice(iIdx, 1); updateSyllabusModule(mIdx, 'content', newC);
                                    }} className="p-2 text-text-secondary hover:text-red-400 transition-all opacity-0 group-hover/item:opacity-100"><X size={14}/></button>
                                )}
                              </motion.div>
                            ))}
                            </LayoutGroup>
                          </div>
                          <button type="button" onClick={() => {
                            const newC = [...mod.content]; newC[cIdx].items.push(''); updateSyllabusModule(mIdx, 'content', newC);
                          }} className="flex items-center gap-2 text-[9px] uppercase font-black text-text-secondary hover:text-accent tracking-widest transition-colors pl-1">
                            <Plus size={14}/> Add Learning Point
                          </button>
                        </div>
                      ))}
                      
                      <button type="button" onClick={() => {
                        const newC = [...mod.content, { subtitle: '', items: [''] }];
                        updateSyllabusModule(mIdx, 'content', newC);
                      }} className="w-full py-4 rounded-2xl border border-dashed border-white/5 hover:border-accent/30 hover:bg-accent/5 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-accent transition-all">
                        + Add Sub-Topic
                      </button>
                    </div>
                  </motion.div>
                ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'extras' && (
              <motion.div key="extras" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                  <h3 className="text-[11px] font-black uppercase text-accent mb-10 flex items-center gap-4">
                    <div className="p-3 glass rounded-2xl text-accent shadow-xl border border-white/5"><Star size={20} /></div> Key Highlights
                  </h3>
                  <div className="grid gap-4">
                    {form.highlights.map((h, i) => (
                      <motion.div layout key={i} className="flex gap-4 group">
                        <div className="flex-1 relative">
                             <input value={h} onChange={(e) => {
                               const nh = [...form.highlights]; nh[i] = e.target.value; setForm({...form, highlights: nh});
                             }} className="admin-input !bg-white/[0.02]" placeholder="e.g. Industry Certification" />
                             <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-0 group-focus-within:h-6 bg-accent transition-all duration-300 rounded-full" />
                        </div>
                        <button type="button" onClick={() => setForm({ ...form, highlights: form.highlights.filter((_, idx) => idx !== i) })} className="p-3 text-text-secondary hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                      </motion.div>
                    ))}
                    <button type="button" onClick={() => setForm({...form, highlights: [...form.highlights, '']})} className="w-fit flex items-center gap-2 px-8 py-3 rounded-xl border border-dashed border-white/10 hover:border-accent hover:bg-accent/5 hover:text-accent text-[10px] font-black uppercase transition-all mt-4">
                        <Plus size={16}/> ADD HIGHLIGHT
                    </button>
                  </div>
                </div>

                <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                  <h3 className="text-[11px] font-black uppercase text-accent mb-10 flex items-center gap-4">
                    <div className="p-3 glass rounded-2xl text-accent shadow-xl border border-white/5"><ShieldCheck size={20} /></div> Inclusions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {form.features.map((feat, i) => (
                      <motion.div layout key={i} className="flex items-center gap-5 bg-white/[0.02] p-5 rounded-2xl border border-white/5 group hover:border-accent/30 transition-all">
                        <input value={feat.title} onChange={(e) => {
                           const nf = [...form.features]; nf[i].title = e.target.value; setForm({...form, features: nf});
                        }} className="bg-transparent border-none outline-none flex-1 text-sm font-bold text-text placeholder:opacity-20" placeholder="Feature Title" />
                        
                        <div className="flex items-center gap-4">
                            <label className="relative flex items-center cursor-pointer">
                            <input type="checkbox" checked={feat.enabled} onChange={(e) => {
                                const nf = [...form.features]; nf[i].enabled = e.target.checked; setForm({...form, features: nf});
                            }} className="sr-only peer" />
                            <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-accent after:content-[''] after:absolute after:top-[2.5px] after:left-[2px] after:bg-text-secondary after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:bg-white" />
                            </label>
                            <button type="button" onClick={() => setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) })} className="text-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><X size={18} /></button>
                        </div>
                      </motion.div>
                    ))}
                    <button type="button" onClick={() => setForm({...form, features: [...form.features, { title: '', enabled: true }]})} className="flex items-center justify-center gap-3 p-5 rounded-2xl border border-dashed border-white/10 hover:border-accent hover:bg-accent/5 hover:text-accent text-[10px] font-black uppercase transition-all">
                        <Plus size={18}/> New Inclusions
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </form>
      </main>

      <style>{`
        .admin-input {
          width: 100%;
          background: rgba(10, 10, 15, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 16px 20px;
          color: var(--color-text);
          font-size: 14px;
          outline: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .admin-input:focus { 
          border-color: var(--color-accent); 
          background: rgba(var(--color-accent-rgb), 0.03);
          box-shadow: 0 0 0 4px rgba(var(--color-accent-rgb), 0.1), 0 10px 20px -10px rgba(0,0,0,0.5);
          transform: translateY(-1px);
        }
        .admin-input::placeholder { color: white; opacity: 0.15; }

        select.admin-input {
          background-image: none;
        }
        select.admin-input option {
          background: #0f0f14;
          color: white;
          padding: 15px;
        }

        .glass {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
        }

        ::-webkit-calendar-picker-indicator { 
          filter: invert(1) hue-rotate(180deg) brightness(1.5); 
          cursor: pointer; 
          opacity: 0.5;
        }

        .text-gradient {
          background: linear-gradient(to right, #fff, var(--color-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

const Field = ({ label, children, className = '', important = false }) => (
  <div className={`space-y-3 ${className}`}>
    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-text-secondary/60 ml-1 flex items-center gap-1.5">
      {label} {important && <span className="text-accent animate-pulse">*</span>}
    </label>
    {children}
  </div>
);

export default AdminBootcampManagement;