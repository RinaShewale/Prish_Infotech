import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../Shared/GlassCard';
import { useBootcamp } from '../../Courses/hooks/useBootcamp';
import {
  PlusCircle, Search, Trash2, PencilLine, Sparkles, Upload,
  CalendarDays, BadgeCheck, Loader2, Info, BookOpen, Users,
  Settings, DollarSign, ChevronRight, X
} from 'lucide-react';

const emptyForm = {
  title: '', slug: '', shortDescription: '', fullDescription: '',
  thumbnail: '', heroBanner: '', introVideo: '', demoVideo: '',
  duration: '', startDate: '', endDate: '', batchSize: '',
  language: 'English', level: 'beginner', category: 'General',
  enrollmentDeadline: '', status: 'draft', certificateEnabled: false,
  price: '', discountPrice: '',
  syllabusModules: [{ title: '', topics: [''] }],
  learningOutcomes: [''], prerequisites: [''], features: [''],
  technologies: [''], faqs: [{ question: '', answer: '' }],
  mentors: [{ name: '', role: '', bio: '', image: '' }],
  projects: [{ title: '', description: '', link: '' }],
  careerSupport: [''], testimonials: [{ name: '', role: '', quote: '' }],
  pricingPlans: [{ name: '', price: '', description: '', features: [''], popular: false }],
  seo: { metaTitle: '', metaDescription: '', keywords: [''] },
};

const AdminBootcampManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const { bootcamps, loading, loadAdminBootcamps, createBootcamp, updateBootcamp, deleteBootcamp } = useBootcamp(false);

  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadAdminBootcamps(); }, [loadAdminBootcamps]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return bootcamps.filter((item) => 
      [item.title, item.slug, item.category].some(f => f?.toLowerCase().includes(q))
    );
  }, [bootcamps, search]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value) 
    }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setForm(prev => {
      const next = [...prev[section]];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, [section]: next };
    });
  };

  const updateListItem = (section, index, value) => {
    setForm(prev => {
      const next = [...prev[section]];
      next[index] = value;
      return { ...prev, [section]: next };
    });
  };

  const addArrayItem = (section, template) => {
    setForm(prev => ({ ...prev, [section]: [...prev[section], template] }));
  };

  const removeArrayItem = (section, index) => {
    setForm(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setActiveTab('general');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      };
      const result = editingId ? await updateBootcamp(editingId, payload) : await createBootcamp(payload);
      if (!result.success) throw new Error(result.message);
      toast.success(editingId ? 'Bootcamp updated' : 'Bootcamp created');
      resetForm();
    } catch (error) {
      toast.error(error?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      ...emptyForm,
      ...item,
      startDate: item.startDate?.split('T')[0] || '',
      endDate: item.endDate?.split('T')[0] || '',
      enrollmentDeadline: item.enrollmentDeadline?.split('T')[0] || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: Info },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'faculty', label: 'Faculty & Reviews', icon: Users },
    { id: 'pricing', label: 'SEO & Pricing', icon: DollarSign },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent mb-2">
            <Sparkles size={20} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Admin Portal</span>
          </div>
          <h1 className="text-4xl font-display font-bold italic">Bootcamp Studio</h1>
        </div>
        <button onClick={() => navigate('/admin/courses')} className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium">
          Back to Courses
        </button>
      </div>

      {/* Main Creator Card */}
      <GlassCard className="overflow-hidden border-accent/20">
        <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-accent text-bg' : 'text-text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div key="general" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Field label="Program Title" important><input required name="title" value={form.title} onChange={handleChange} className="admin-input" placeholder="e.g. Full Stack Web Development" /></Field>
                  <Field label="URL Slug" important><input required name="slug" value={form.slug} onChange={handleChange} className="admin-input" placeholder="full-stack-dev" /></Field>
                  <Field label="Short Catchy Description" className="md:col-span-2">
                    <textarea rows={2} name="shortDescription" value={form.shortDescription} onChange={handleChange} className="admin-input" placeholder="Brief summary for cards..." />
                  </Field>
                  <Field label="Full Detailed Description" className="md:col-span-2">
                    <textarea rows={5} name="fullDescription" value={form.fullDescription} onChange={handleChange} className="admin-input" placeholder="Describe the journey..." />
                  </Field>
                </div>
                <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                  <Field label="Duration"><input name="duration" value={form.duration} onChange={handleChange} className="admin-input" placeholder="12 Weeks" /></Field>
                  <Field label="Start Date"><input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="admin-input" /></Field>
                  <Field label="End Date"><input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="admin-input" /></Field>
                  <Field label="Level">
                    <select name="level" value={form.level} onChange={handleChange} className="admin-input">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </Field>
                  <Field label="Status">
                    <select name="status" value={form.status} onChange={handleChange} className="admin-input">
                      <option value="draft">Draft (Private)</option>
                      <option value="published">Published (Live)</option>
                    </select>
                  </Field>
                  <Field label="Batch Size"><input type="number" name="batchSize" value={form.batchSize} onChange={handleChange} className="admin-input" /></Field>
                </div>
              </motion.div>
            )}

            {activeTab === 'curriculum' && (
              <motion.div key="curriculum" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <DynamicSection title="Syllabus Modules" section="syllabusModules" template={{ title: '', topics: [''] }} form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => (
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                    <input placeholder="Module Title" value={item.title} onChange={(e) => updateArrayItem('syllabusModules', idx, 'title', e.target.value)} className="admin-input bg-white/5 font-bold" />
                    <div className="pl-4 border-l-2 border-accent/30 space-y-2">
                      {item.topics.map((topic, tIdx) => (
                        <div key={tIdx} className="flex gap-2">
                          <input placeholder="Topic Name" value={topic} onChange={(e) => {
                            const next = [...item.topics]; next[tIdx] = e.target.value;
                            updateArrayItem('syllabusModules', idx, 'topics', next);
                          }} className="admin-input text-sm py-1" />
                          <button type="button" onClick={() => {
                            const next = [...item.topics]; next.splice(tIdx, 1);
                            updateArrayItem('syllabusModules', idx, 'topics', next);
                          }} className="p-2 text-text-secondary hover:text-red-400 transition-colors"><X size={14}/></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => updateArrayItem('syllabusModules', idx, 'topics', [...item.topics, ''])} className="text-[11px] text-accent font-bold hover:underline">+ ADD TOPIC</button>
                    </div>
                  </div>
                )} />

                <div className="grid md:grid-cols-2 gap-8">
                  <DynamicSection title="Learning Outcomes" section="learningOutcomes" template="" form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => <input value={item} onChange={(e) => updateListItem('learningOutcomes', idx, e.target.value)} className="admin-input" />} />
                  <DynamicSection title="Prerequisites" section="prerequisites" template="" form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => <input value={item} onChange={(e) => updateListItem('prerequisites', idx, e.target.value)} className="admin-input" />} />
                  <DynamicSection title="Technologies" section="technologies" template="" form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => <input value={item} onChange={(e) => updateListItem('technologies', idx, e.target.value)} className="admin-input" />} />
                  <DynamicSection title="Career Support" section="careerSupport" template="" form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => <input value={item} onChange={(e) => updateListItem('careerSupport', idx, e.target.value)} className="admin-input" />} />
                </div>
              </motion.div>
            )}

            {activeTab === 'faculty' && (
              <motion.div key="faculty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <DynamicSection title="Mentors" section="mentors" template={{ name: '', role: '', bio: '', image: '' }} form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => (
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <input placeholder="Mentor Name" value={item.name} onChange={(e) => updateArrayItem('mentors', idx, 'name', e.target.value)} className="admin-input" />
                    <input placeholder="Role" value={item.role} onChange={(e) => updateArrayItem('mentors', idx, 'role', e.target.value)} className="admin-input" />
                    <textarea placeholder="Bio" value={item.bio} onChange={(e) => updateArrayItem('mentors', idx, 'bio', e.target.value)} className="admin-input md:col-span-2" rows={2} />
                  </div>
                )} />
                <DynamicSection title="Testimonials" section="testimonials" template={{ name: '', role: '', quote: '' }} form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => (
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <input placeholder="Student Name" value={item.name} onChange={(e) => updateArrayItem('testimonials', idx, 'name', e.target.value)} className="admin-input" />
                    <input placeholder="Batch" value={item.role} onChange={(e) => updateArrayItem('testimonials', idx, 'role', e.target.value)} className="admin-input" />
                    <textarea placeholder="Quote" value={item.quote} onChange={(e) => updateArrayItem('testimonials', idx, 'quote', e.target.value)} className="admin-input md:col-span-2" />
                  </div>
                )} />
              </motion.div>
            )}

            {activeTab === 'pricing' && (
              <motion.div key="pricing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <Field label="Standard Price (₹)"><input type="number" name="price" value={form.price} onChange={handleChange} className="admin-input" /></Field>
                  <Field label="Discounted Price (₹)"><input type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange} className="admin-input" /></Field>
                  <div className="md:col-span-2 flex items-center gap-3 p-4 bg-accent/10 rounded-2xl border border-accent/20">
                    <input type="checkbox" id="cert" name="certificateEnabled" checked={form.certificateEnabled} onChange={handleChange} className="w-5 h-5 accent-accent" />
                    <label htmlFor="cert" className="text-sm font-bold">Issue certificates upon completion</label>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-bold text-accent uppercase tracking-widest">SEO Meta Data</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Meta Title"><input value={form.seo.metaTitle} onChange={(e) => setForm(p => ({ ...p, seo: { ...p.seo, metaTitle: e.target.value } }))} className="admin-input" /></Field>
                    <Field label="Meta Description"><input value={form.seo.metaDescription} onChange={(e) => setForm(p => ({ ...p, seo: { ...p.seo, metaDescription: e.target.value } }))} className="admin-input" /></Field>
                    <Field label="Keywords" className="md:col-span-2"><input value={form.seo.keywords.join(', ')} onChange={(e) => setForm(p => ({ ...p, seo: { ...p.seo, keywords: e.target.value.split(',').map(x => x.trim()) } }))} className="admin-input" /></Field>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
            <p className="text-xs text-text-secondary px-2">Editing: {form.title || 'Untitled'}</p>
            <div className="flex gap-3">
              <button type="button" onClick={resetForm} className="px-6 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold">Cancel</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-accent text-bg font-bold hover:scale-105 transition-all">
                {saving ? <Loader2 className="animate-spin" size={18}/> : <Upload size={18}/>}
                {editingId ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>
        </form>
      </GlassCard>

      {/* Directory Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold italic">Active Directory</h2>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter bootcamps..." className="admin-input pl-12 bg-white/5" />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center opacity-50"><Loader2 className="animate-spin text-accent" size={40} /></div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((item) => (
              <div key={item._id} className="group flex flex-col md:flex-row items-center justify-between p-4 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex-shrink-0 flex items-center justify-center text-accent">
                    {item.thumbnail ? <img src={item.thumbnail} alt="" className="w-full h-full object-cover rounded-2xl" /> : <BookOpen size={24}/>}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-bold">{item.title}</h4>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase ${item.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-text-secondary">
                      <span>{item.duration}</span> • <span>₹{item.price}</span> • <span>{item.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="p-3 rounded-2xl bg-white/5 hover:bg-white/20 transition-all"><PencilLine size={18}/></button>
                  <button onClick={() => { if(window.confirm('Delete?')) deleteBootcamp(item._id) }} className="p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/30 text-red-400 transition-all"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, children, className = '', important = false }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary ml-1">
      {label} {important && <span className="text-accent">*</span>}
    </label>
    {children}
  </div>
);

const DynamicSection = ({ title, section, template, form, render, addItem, removeItem }) => {
  const items = form?.[section] || [];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <h4 className="text-xs font-black uppercase tracking-widest text-text-secondary">{title}</h4>
        <button type="button" onClick={() => addItem(section, template)} className="px-3 py-1 rounded-lg bg-accent/10 text-accent text-[11px] font-bold">+ ADD</button>
      </div>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="relative group">
            {render(item, idx)}
            <button type="button" onClick={() => removeItem(section, idx)} className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all">
              <X size={10}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBootcampManagement;