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
    let finalValue = type === 'checkbox' ? checked : value;
    
    if (type === 'number') {
      finalValue = Math.max(0, Number(value));
    }
    
    setForm(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleBatchChange = (field, value) => {
    const finalValue = field === 'year' ? Math.max(0, Number(value)) : value;
    setForm(prev => ({ ...prev, batch: { ...prev.batch, [field]: finalValue } }));
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
        navigate('/admin/bootcamps');
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
    <div className="min-h-screen bg-[#050508] text-text font-sans pb-32 selection:bg-accent/30">
      <div className="noise-bg fixed inset-0 opacity-[0.03] pointer-events-none" />
      <FluidBackground opacity={0.4} />

      {/* --- STICKY NAV --- */}
      {/* Lowered z-index to 11 and added responsive mobile padding/flex */}
      <nav className="sticky top-0 z-[11] h-20 bg-[#050508]/60 backdrop-blur-3xl border-b border-white/5 px-4 md:px-12 flex items-center justify-between mb-8 md:mb-12">
        <div className="flex items-center gap-3 md:gap-6 max-w-[60%]">
          <button onClick={() => navigate(-1)} className="p-2.5 md:p-3 bg-white/5 rounded-xl md:rounded-2xl transition-all hover:bg-accent/20 border border-white/10 group shrink-0">
            <ArrowLeft size={18} className="text-text-secondary group-hover:text-accent transition-colors" />
          </button>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-lg md:text-2xl tracking-tight text-white flex items-center gap-2 truncate">
              {(editingId || id) ? 'Edit Experience' : 'New Program'}
              <Sparkles size={14} className="text-accent shrink-0 hidden xs:block" />
            </h1>
            <p className="text-[8px] md:text-[10px] text-accent/60 uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold truncate">Experience Architect</p>
          </div>
        </div>
        
        <div className="flex gap-2 md:gap-4 shrink-0">
          {(editingId || id) && (
            <button onClick={resetForm} className="px-3 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-white transition-colors hidden sm:block">
              Discard
            </button>
          )}
          <button 
            form="bootcamp-form" 
            disabled={saving} 
            className="group relative bg-accent text-white px-4 md:px-10 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[11px] tracking-widest overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(var(--color-accent-rgb),0.3)] active:scale-95 disabled:opacity-50"
          >
            <span className="relative flex items-center gap-2">
              {saving ? <Loader2 className="animate-spin w-4 h-4 md:w-5 h-5" /> : <Save className="w-4 h-4 md:w-5 h-5" />}
              <span className="hidden xs:inline">{(editingId || id) ? 'Update' : 'Deploy'}</span>
              <span className="xs:hidden">{(editingId || id) ? 'Save' : 'Post'}</span>
            </span>
          </button>
        </div>
      </nav>

      {/* Main content relative z-[1] for standard stacking */}
      <main className="max-w-6xl mx-auto px-6 relative z-[1]">
        {/* --- TABS --- */}
        <div className="flex bg-white/[0.03] p-1.5 rounded-[2rem] w-full md:w-fit mx-auto mb-12 md:mb-16 border border-white/5 shadow-2xl backdrop-blur-xl overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 md:px-8 py-3 md:py-3.5 rounded-[1.2rem] md:rounded-[1.4rem] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 md:gap-3 z-[1] shrink-0 ${activeTab === tab.id ? 'text-white' : 'text-text-secondary hover:text-white'}`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-accent rounded-[1.2rem] md:rounded-[1.4rem] -z-[1] shadow-lg shadow-accent/25" transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }} />
              )}
            </button>
          ))}
        </div>

        <form id="bootcamp-form" onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div 
                key="general" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 bg-white/[0.02] p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-3xl"
              >
                <Field label="Program Title" important className="md:col-span-2">
                    <input name="title" value={form.title} onChange={handleChange} className="admin-input text-xl md:text-2xl font-display font-bold tracking-tight" placeholder="e.g. Advanced UI/UX Studio" />
                </Field>

                <Field label="Narrative Description" className="md:col-span-2">
                    <textarea name="description" value={form.description} onChange={handleChange} className="admin-input min-h-[140px] md:min-h-[160px] py-4 md:py-6 leading-relaxed resize-none" placeholder="Describe the journey..." />
                </Field>

                <Field label="Delivery Format">
                  <div className="relative group custom-select-wrapper">
                    <select name="type" value={form.type} onChange={handleChange} className="admin-input appearance-none cursor-pointer pr-12 font-bold text-accent">
                      <option value="online">Online Interactive</option>
                      <option value="offline">In-Person Studio</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary group-hover:text-accent transition-colors pointer-events-none" size={18} />
                  </div>
                </Field>

                <Field label="Experience Level">
                  <div className="relative group custom-select-wrapper">
                    <select name="level" value={form.level} onChange={handleChange} className="admin-input appearance-none cursor-pointer pr-12">
                      <option value="beginner">Entry Level</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced / Expert</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                  </div>
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 md:col-span-2 pt-8 md:pt-12 mt-4 border-t border-white/5">
                  <Field label="Regular Price (INR)">
                    <input type="number" min="0" name="price" value={form.price} onChange={handleChange} className="admin-input !text-accent font-black text-lg" />
                  </Field>
                  <Field label="Discounted Price (INR)">
                    <input type="number" min="0" name="discountedPrice" value={form.discountedPrice} onChange={handleChange} className="admin-input text-white/70" />
                  </Field>
                  <Field label="Timeframe">
                    <input name="duration" value={form.duration} onChange={handleChange} className="admin-input" placeholder="e.g. 12 Weeks" />
                  </Field>
                  <Field label="Primary Hub">
                    <input name="location" value={form.location} onChange={handleChange} className="admin-input" placeholder="e.g. Remote Hub" />
                  </Field>
                </div>
              </motion.div>
            )}

            {activeTab === 'batch' && (
              <motion.div key="batch" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 bg-white/[0.02] p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-3xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                  <Field label="Academic Year"><input type="number" min="0" value={form.batch.year} onChange={(e) => handleBatchChange('year', e.target.value)} className="admin-input" /></Field>
                  <Field label="Batch Identity"><input value={form.batch.label} onChange={(e) => handleBatchChange('label', e.target.value)} className="admin-input" placeholder="COHORT_X" /></Field>
                  <Field label="Status">
                    <div className="relative group custom-select-wrapper">
                        <select value={form.batch.isActive} onChange={(e) => handleBatchChange('isActive', e.target.value === 'true')} className="admin-input appearance-none pr-12">
                            <option value="true">Open Admissions</option>
                            <option value="false">Closed / Waitlist</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                    </div>
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 p-8 md:p-12 bg-black/40 rounded-[2rem] md:rounded-[2.5rem] border border-white/5">
                  <Field label="Starts On"><input type="date" value={form.batch.startDate} onChange={(e) => handleBatchChange('startDate', e.target.value)} className="admin-input !bg-transparent border-none p-0" /></Field>
                  <Field label="Ends On"><input type="date" value={form.batch.endDate} onChange={(e) => handleBatchChange('endDate', e.target.value)} className="admin-input !bg-transparent border-none p-0" /></Field>
                </div>
              </motion.div>
            )}

            {activeTab === 'syllabus' && (
              <motion.div key="syllabus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 md:space-y-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end px-4 md:px-6 gap-4">
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-2">Curriculum Flow</p>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white">Learning Roadmap</h3>
                  </div>
                  <button type="button" onClick={() => setForm(prev => ({ ...prev, syllabus: [...prev.syllabus, { title: '', content: [{ subtitle: '', items: [''] }] }] }))} 
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black transition-all border border-accent/20 group">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" /> NEW MODULE
                  </button>
                </div>

                <div className="space-y-8 md:space-y-10 relative">
                {form.syllabus.map((mod, mIdx) => (
                  <motion.div 
                    layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={mIdx} 
                    className="bg-white/[0.02] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/5 hover:border-white/10 transition-all shadow-3xl group/mod"
                  >
                    <div className="p-6 md:p-10 bg-white/[0.03] border-b border-white/5 flex items-center gap-4 md:gap-8">
                       <span className="w-10 h-10 md:w-14 md:h-14 rounded-[1rem] md:rounded-[1.2rem] bg-black flex items-center justify-center text-xs md:text-sm font-black text-accent border border-white/10 shrink-0">
                         {mIdx + 1 < 10 ? `0${mIdx + 1}` : mIdx + 1}
                       </span>
                       <input value={mod.title} onChange={(e) => updateSyllabusModule(mIdx, 'title', e.target.value)} className="bg-transparent border-none text-lg md:text-xl font-display font-bold text-white outline-none flex-1 placeholder:text-white/10 min-w-0" placeholder="Enter Module Title..." />
                       <button type="button" onClick={() => setForm({ ...form, syllabus: form.syllabus.filter((_, i) => i !== mIdx) })} className="p-2.5 md:p-3 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all shrink-0"><Trash2 size={18} /></button>
                    </div>
                    
                    <div className="p-6 md:p-16 space-y-12 md:space-y-16">
                      {mod.content.map((cont, cIdx) => (
                        <div key={cIdx} className="relative pl-8 md:pl-12 border-l-2 border-white/5 space-y-6 md:space-y-8 group/topic">
                          <div className="absolute top-0 left-[-7px] w-[12px] h-[12px] rounded-full bg-accent shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.5)]" />
                          <div className="flex gap-4 items-center">
                            <input placeholder="Sub-topic heading" value={cont.subtitle} onChange={(e) => {
                              const newC = [...mod.content]; newC[cIdx].subtitle = e.target.value; updateSyllabusModule(mIdx, 'content', newC);
                            }} className="bg-transparent border-none text-accent font-display font-black text-xs md:text-sm w-full outline-none tracking-widest uppercase" />
                          </div>
                          
                          <div className="grid gap-3 md:gap-4">
                            <LayoutGroup>
                            {cont.items.map((item, iIdx) => (
                              <motion.div layout key={iIdx} className="flex gap-3 md:gap-4 group/item">
                                <div className="flex-1 relative">
                                    <input value={item} onChange={(e) => {
                                      const newC = [...mod.content]; newC[cIdx].items[iIdx] = e.target.value; updateSyllabusModule(mIdx, 'content', newC);
                                    }} className="admin-input !py-3 md:!py-4 !text-xs md:!text-sm !bg-white/[0.02]" placeholder="Specific learning point..." />
                                </div>
                                {cont.items.length > 1 && (
                                    <button type="button" onClick={() => {
                                        const newC = [...mod.content]; newC[cIdx].items.splice(iIdx, 1); updateSyllabusModule(mIdx, 'content', newC);
                                    }} className="p-2 text-text-secondary hover:text-red-400 transition-all opacity-100 sm:opacity-0 group-hover/item:opacity-100"><X size={16}/></button>
                                )}
                              </motion.div>
                            ))}
                            </LayoutGroup>
                          </div>
                          <button type="button" onClick={() => {
                            const newC = [...mod.content]; newC[cIdx].items.push(''); updateSyllabusModule(mIdx, 'content', newC);
                          }} className="flex items-center gap-2 text-[9px] md:text-[10px] uppercase font-black text-accent/60 hover:text-accent tracking-[0.2em] transition-all pl-1">
                            <Plus size={14}/> Add Learning Objective
                          </button>
                        </div>
                      ))}
                      
                      <button type="button" onClick={() => {
                        const newC = [...mod.content, { subtitle: '', items: [''] }];
                        updateSyllabusModule(mIdx, 'content', newC);
                      }} className="w-full py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.5rem] border border-dashed border-white/10 hover:border-accent/40 hover:bg-accent/5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary hover:text-accent transition-all">
                        + New Section
                      </button>
                    </div>
                  </motion.div>
                ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'extras' && (
              <motion.div key="extras" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 md:space-y-12">
                <div className="bg-white/[0.02] p-8 md:p-16 rounded-[2rem] md:rounded-[3.5rem] border border-white/5 relative shadow-3xl">
                  <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
                    <div className="p-3 md:p-4 bg-accent/10 rounded-[1rem] md:rounded-[1.2rem] text-accent border border-accent/20"><Star size={20} md:size={24} /></div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white">Program Highlights</h3>
                  </div>
                  <div className="grid gap-4 md:gap-5">
                    {form.highlights.map((h, i) => (
                      <motion.div layout key={i} className="flex gap-4 md:gap-5 group items-center">
                        <div className="flex-1 relative">
                             <input value={h} onChange={(e) => {
                               const nh = [...form.highlights]; nh[i] = e.target.value; setForm({...form, highlights: nh});
                             }} className="admin-input !bg-white/[0.01] border-white/10 py-4 md:py-5" placeholder="e.g. Industry Certification" />
                        </div>
                        <button type="button" onClick={() => setForm({ ...form, highlights: form.highlights.filter((_, idx) => idx !== i) })} className="p-2.5 md:p-3 text-text-secondary hover:text-red-500 transition-all opacity-100 sm:opacity-0 group-hover:opacity-100"><Trash2 size={18} md:size={20} /></button>
                      </motion.div>
                    ))}
                    <button type="button" onClick={() => setForm({...form, highlights: [...form.highlights, '']})} className="w-full sm:w-fit flex items-center justify-center gap-3 px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl border border-dashed border-white/20 hover:border-accent hover:bg-accent/5 hover:text-accent text-[10px] md:text-[11px] font-black uppercase transition-all mt-4 md:mt-6">
                        <Plus size={18}/> NEW HIGHLIGHT
                    </button>
                  </div>
                </div>

                <div className="bg-white/[0.02] p-8 md:p-16 rounded-[2rem] md:rounded-[3.5rem] border border-white/5 shadow-3xl">
                  <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
                    <div className="p-3 md:p-4 bg-accent/10 rounded-[1rem] md:rounded-[1.2rem] text-accent border border-accent/20"><ShieldCheck size={20} md:size={24} /></div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white">Inclusions</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {form.features.map((feat, i) => (
                      <motion.div layout key={i} className="flex items-center gap-4 md:gap-6 bg-black/40 p-5 md:p-6 rounded-[1.5rem] md:rounded-[1.8rem] border border-white/5 group hover:border-accent/40 transition-all">
                        <input value={feat.title} onChange={(e) => {
                           const nf = [...form.features]; nf[i].title = e.target.value; setForm({...form, features: nf});
                        }} className="bg-transparent border-none outline-none flex-1 text-xs md:text-sm font-bold text-white placeholder:text-white/10 min-w-0" placeholder="Feature Title" />
                        <div className="flex items-center gap-3 md:gap-5 shrink-0">
                            <label className="relative flex items-center cursor-pointer">
                            <input type="checkbox" checked={feat.enabled} onChange={(e) => {
                                const nf = [...form.features]; nf[i].enabled = e.target.checked; setForm({...form, features: nf});
                            }} className="sr-only peer" />
                            <div className="w-10 h-5 md:w-11 md:h-6 bg-white/5 rounded-full peer peer-checked:bg-accent after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/20 after:rounded-full after:h-3.5 md:after:h-4 after:w-3.5 md:after:w-4 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:bg-white" />
                            </label>
                            <button type="button" onClick={() => setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) })} className="text-text-secondary hover:text-red-400 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all"><X size={18} md:size={20} /></button>
                        </div>
                      </motion.div>
                    ))}
                    <button type="button" onClick={() => setForm({...form, features: [...form.features, { title: '', enabled: true }]})} className="flex items-center justify-center gap-3 p-5 md:p-6 rounded-[1.5rem] md:rounded-[1.8rem] border border-dashed border-white/10 hover:border-accent hover:bg-accent/5 hover:text-accent text-[10px] md:text-[11px] font-black uppercase transition-all">
                        <Plus size={20}/> NEW INCLUSION
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </main>

      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] { -moz-appearance: textfield; }

        .admin-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 14px 20px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        @media (min-width: 768px) {
          .admin-input { padding: 16px 22px; }
        }
        .admin-input:focus { 
          border-color: var(--color-accent); 
          background: rgba(var(--color-accent-rgb), 0.04);
          box-shadow: 0 20px 40px -20px rgba(0,0,0,0.5);
        }
        .admin-input::placeholder { color: rgba(255, 255, 255, 0.1); }

        .custom-select-wrapper select option {
          background: #0d0d12;
          color: #fff;
          padding: 20px;
        }

        .shadow-3xl { box-shadow: 0 40px 100px -30px rgba(0,0,0,0.7); }

        ::-webkit-calendar-picker-indicator { 
          filter: invert(1) hue-rotate(180deg) brightness(1.5); 
          cursor: pointer; 
          opacity: 0.5;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @media (max-width: 480px) {
          .xs\\:hidden { display: block; }
          .xs\\:block { display: none; }
          .xs\\:inline { display: none; }
        }
      `}</style>
    </div>
  );
};

const Field = ({ label, children, className = '', important = false }) => (
  <div className={`space-y-2 md:space-y-3 ${className}`}>
    <label className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-black text-text-secondary/50 ml-1 flex items-center gap-2">
      {label} {important && <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-accent animate-pulse" />}
    </label>
    {children}
  </div>
);

export default AdminBootcampManagement;