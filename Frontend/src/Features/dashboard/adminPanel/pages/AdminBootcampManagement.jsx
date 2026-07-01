import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GlassCard } from '../Shared/GlassCard';
import { useBootcamp } from '../../Courses/hooks/useBootcamp';
import {
  PlusCircle,
  Search,
  Trash2,
  PencilLine,
  Sparkles,
  Upload,
  CalendarDays,
  BadgeCheck,
  Loader2,
} from 'lucide-react';

const emptyForm = {
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  thumbnail: '',
  heroBanner: '',
  introVideo: '',
  demoVideo: '',
  duration: '',
  startDate: '',
  endDate: '',
  batchSize: '',
  language: 'English',
  level: 'beginner',
  category: 'General',
  enrollmentDeadline: '',
  status: 'draft',
  certificateEnabled: false,
  price: '',
  discountPrice: '',
  syllabusModules: [{ title: '', topics: [''] }],
  learningOutcomes: [''],
  prerequisites: [''],
  features: [''],
  technologies: [''],
  faqs: [{ question: '', answer: '' }],
  mentors: [{ name: '', role: '', bio: '', image: '' }],
  projects: [{ title: '', description: '', link: '' }],
  careerSupport: [''],
  testimonials: [{ name: '', role: '', quote: '' }],
  pricingPlans: [{ name: '', price: '', description: '', features: [''], popular: false }],
  seo: { metaTitle: '', metaDescription: '', keywords: [''] },
};

const AdminBootcampManagement = () => {
  const navigate = useNavigate();
  const {
    bootcamps,
    loading,
    error,
    loadAdminBootcamps,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
  } = useBootcamp(false);

  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAdminBootcamps();
  }, [loadAdminBootcamps]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return bootcamps.filter((item) => [item.title, item.slug, item.category, item.status].join(' ').toLowerCase().includes(q));
  }, [bootcamps, search]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'certificateEnabled') {
      setForm((prev) => ({ ...prev, certificateEnabled: checked }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setForm((prev) => {
      const next = [...prev[section]];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, [section]: next };
    });
  };

  const updateListItem = (section, index, value) => {
    setForm((prev) => {
      const next = [...prev[section]];
      next[index] = value;
      return { ...prev, [section]: next };
    });
  };

  const addArrayItem = (section, template) => {
    setForm((prev) => ({ ...prev, [section]: [...prev[section], template] }));
  };

  const removeArrayItem = (section, index) => {
    setForm((prev) => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
  };

  const uploadFiles = async (file) => {
    if (!file) return '';
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const { data } = await API.post('/upload/file', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return data.url;
    } catch (error) {
      toast.error('Upload failed');
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (event, field) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadFiles(file);
    if (url) setForm((prev) => ({ ...prev, [field]: url }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price || 0),
        discountPrice: Number(form.discountPrice || 0),
        batchSize: Number(form.batchSize || 0),
        slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      };

      if (editingId) {
        const result = await updateBootcamp(editingId, payload);
        if (!result.success) {
          throw new Error(result.message);
        }
        toast.success('Bootcamp updated');
      } else {
        const result = await createBootcamp(payload);
        if (!result.success) {
          throw new Error(result.message);
        }
        toast.success('Bootcamp created');
      }
      resetForm();
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      ...emptyForm,
      ...item,
      startDate: item.startDate ? item.startDate.slice(0, 10) : '',
      endDate: item.endDate ? item.endDate.slice(0, 10) : '',
      enrollmentDeadline: item.enrollmentDeadline ? item.enrollmentDeadline.slice(0, 10) : '',
      seo: item.seo || emptyForm.seo,
      syllabusModules: item.syllabusModules?.length ? item.syllabusModules : [{ title: '', topics: [''] }],
      learningOutcomes: item.learningOutcomes?.length ? item.learningOutcomes : [''],
      prerequisites: item.prerequisites?.length ? item.prerequisites : [''],
      features: item.features?.length ? item.features : [''],
      technologies: item.technologies?.length ? item.technologies : [''],
      faqs: item.faqs?.length ? item.faqs : [{ question: '', answer: '' }],
      mentors: item.mentors?.length ? item.mentors : [{ name: '', role: '', bio: '', image: '' }],
      projects: item.projects?.length ? item.projects : [{ title: '', description: '', link: '' }],
      careerSupport: item.careerSupport?.length ? item.careerSupport : [''],
      testimonials: item.testimonials?.length ? item.testimonials : [{ name: '', role: '', quote: '' }],
      pricingPlans: item.pricingPlans?.length ? item.pricingPlans : [{ name: '', price: '', description: '', features: [''], popular: false }],
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bootcamp?')) return;
    try {
      const result = await deleteBootcamp(id);
      if (!result.success) {
        throw new Error(result.message);
      }
      toast.success('Bootcamp deleted');
    } catch (error) {
      toast.error(error?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold italic">Bootcamp Management</h1>
          <p className="text-text-secondary text-sm">Create and publish dynamic bootcamp programs with rich resources and SEO.</p>
        </div>
        <button onClick={() => navigate('/admin/courses')} className="flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-bg font-bold">Back to Courses</button>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4 text-accent"><Sparkles size={18}/> New Bootcamp Builder</div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Title"><input required name="title" value={form.title} onChange={handleChange} className="input" /></Field>
            <Field label="Slug"><input required name="slug" value={form.slug} onChange={handleChange} className="input" /></Field>
            <Field label="Short Description" className="md:col-span-2"><textarea rows={2} name="shortDescription" value={form.shortDescription} onChange={handleChange} className="input" /></Field>
            <Field label="Full Description" className="md:col-span-2"><textarea rows={4} name="fullDescription" value={form.fullDescription} onChange={handleChange} className="input" /></Field>
            <Field label="Thumbnail URL"><input name="thumbnail" value={form.thumbnail} onChange={handleChange} className="input" /></Field>
            <Field label="Hero Banner URL"><input name="heroBanner" value={form.heroBanner} onChange={handleChange} className="input" /></Field>
            <Field label="Intro Video URL"><input name="introVideo" value={form.introVideo} onChange={handleChange} className="input" /></Field>
            <Field label="Demo Video URL"><input name="demoVideo" value={form.demoVideo} onChange={handleChange} className="input" /></Field>
            <Field label="Duration"><input name="duration" value={form.duration} onChange={handleChange} className="input" /></Field>
            <Field label="Start Date"><input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="input" /></Field>
            <Field label="End Date"><input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="input" /></Field>
            <Field label="Batch Size"><input type="number" name="batchSize" value={form.batchSize} onChange={handleChange} className="input" /></Field>
            <Field label="Language"><input name="language" value={form.language} onChange={handleChange} className="input" /></Field>
            <Field label="Level"><select name="level" value={form.level} onChange={handleChange} className="input"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></Field>
            <Field label="Category"><input name="category" value={form.category} onChange={handleChange} className="input" /></Field>
            <Field label="Enrollment Deadline"><input type="date" name="enrollmentDeadline" value={form.enrollmentDeadline} onChange={handleChange} className="input" /></Field>
            <Field label="Status"><select name="status" value={form.status} onChange={handleChange} className="input"><option value="draft">Draft</option><option value="published">Published</option></select></Field>
            <Field label="Price"><input type="number" name="price" value={form.price} onChange={handleChange} className="input" /></Field>
            <Field label="Discount Price"><input type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange} className="input" /></Field>
            <Field label="Certificate Toggle" className="md:col-span-2"><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="certificateEnabled" checked={form.certificateEnabled} onChange={handleChange} /> Enable certificate</label></Field>
          </div>

          <Section title="Program Content">
            <DynamicList title="Syllabus Modules" section="syllabusModules" template={{ title: '', topics: [''] }} form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => (
              <div className="space-y-3 rounded-xl border border-white/10 p-4" key={idx}>
                <input placeholder="Module title" value={item.title} onChange={(e) => updateArrayItem('syllabusModules', idx, 'title', e.target.value)} className="input" />
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-widest text-text-secondary">Topics</div>
                  {(item.topics || []).map((topic, topicIndex) => (
                    <div className="flex gap-2" key={topicIndex}>
                      <input value={topic} onChange={(e) => {
                        const next = [...(item.topics || [])];
                        next[topicIndex] = e.target.value;
                        updateArrayItem('syllabusModules', idx, 'topics', next);
                      }} className="input" />
                      <button type="button" onClick={() => {
                        const next = [...(item.topics || [])];
                        next.splice(topicIndex, 1);
                        updateArrayItem('syllabusModules', idx, 'topics', next);
                      }} className="rounded-lg border border-white/10 px-3 text-text-secondary">×</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => {
                    const next = [...(item.topics || []), ''];
                    updateArrayItem('syllabusModules', idx, 'topics', next);
                  }} className="text-[11px] text-accent">+ Add Topic</button>
                </div>
              </div>
            )} />

            <DynamicList title="Learning Outcomes" section="learningOutcomes" template="" form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => <input key={idx} value={item} onChange={(e) => updateListItem('learningOutcomes', idx, e.target.value)} className="input" />} />
            <DynamicList title="Prerequisites" section="prerequisites" template="" form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => <input key={idx} value={item} onChange={(e) => updateListItem('prerequisites', idx, e.target.value)} className="input" />} />
            <DynamicList title="Features" section="features" template="" form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => <input key={idx} value={item} onChange={(e) => updateListItem('features', idx, e.target.value)} className="input" />} />
            <DynamicList title="Technologies" section="technologies" template="" form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => <input key={idx} value={item} onChange={(e) => updateListItem('technologies', idx, e.target.value)} className="input" />} />
            <DynamicList title="FAQs" section="faqs" template={{ question: '', answer: '' }} form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => (
              <div className="grid md:grid-cols-2 gap-3" key={idx}>
                <input placeholder="Question" value={item.question} onChange={(e) => updateArrayItem('faqs', idx, 'question', e.target.value)} className="input" />
                <input placeholder="Answer" value={item.answer} onChange={(e) => updateArrayItem('faqs', idx, 'answer', e.target.value)} className="input" />
              </div>
            )} />
            <DynamicList title="Mentors" section="mentors" template={{ name: '', role: '', bio: '', image: '' }} form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => (
              <div className="grid md:grid-cols-2 gap-3" key={idx}>
                <input placeholder="Name" value={item.name} onChange={(e) => updateArrayItem('mentors', idx, 'name', e.target.value)} className="input" />
                <input placeholder="Role" value={item.role} onChange={(e) => updateArrayItem('mentors', idx, 'role', e.target.value)} className="input" />
                <input placeholder="Bio" value={item.bio} onChange={(e) => updateArrayItem('mentors', idx, 'bio', e.target.value)} className="input" />
                <input placeholder="Image URL" value={item.image} onChange={(e) => updateArrayItem('mentors', idx, 'image', e.target.value)} className="input" />
              </div>
            )} />
            <DynamicList title="Projects" section="projects" template={{ title: '', description: '', link: '' }} form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => (
              <div className="grid md:grid-cols-2 gap-3" key={idx}>
                <input placeholder="Project title" value={item.title} onChange={(e) => updateArrayItem('projects', idx, 'title', e.target.value)} className="input" />
                <input placeholder="Description" value={item.description} onChange={(e) => updateArrayItem('projects', idx, 'description', e.target.value)} className="input" />
                <input placeholder="Link" value={item.link} onChange={(e) => updateArrayItem('projects', idx, 'link', e.target.value)} className="input" />
              </div>
            )} />
            <DynamicList title="Career Support" section="careerSupport" template="" form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => <input key={idx} value={item} onChange={(e) => updateListItem('careerSupport', idx, e.target.value)} className="input" />} />
            <DynamicList title="Testimonials" section="testimonials" template={{ name: '', role: '', quote: '' }} form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => (
              <div className="grid md:grid-cols-2 gap-3" key={idx}>
                <input placeholder="Name" value={item.name} onChange={(e) => updateArrayItem('testimonials', idx, 'name', e.target.value)} className="input" />
                <input placeholder="Role" value={item.role} onChange={(e) => updateArrayItem('testimonials', idx, 'role', e.target.value)} className="input" />
                <input placeholder="Quote" value={item.quote} onChange={(e) => updateArrayItem('testimonials', idx, 'quote', e.target.value)} className="input" />
              </div>
            )} />
            <DynamicList title="Pricing Plans" section="pricingPlans" template={{ name: '', price: '', description: '', features: [''], popular: false }} form={form} addItem={addArrayItem} removeItem={removeArrayItem} render={(item, idx) => (
              <div className="space-y-3 rounded-xl border border-white/10 p-4" key={idx}>
                <input placeholder="Plan name" value={item.name} onChange={(e) => updateArrayItem('pricingPlans', idx, 'name', e.target.value)} className="input" />
                <input type="number" placeholder="Price" value={item.price} onChange={(e) => updateArrayItem('pricingPlans', idx, 'price', e.target.value)} className="input" />
                <input placeholder="Description" value={item.description} onChange={(e) => updateArrayItem('pricingPlans', idx, 'description', e.target.value)} className="input" />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(item.popular)} onChange={(e) => updateArrayItem('pricingPlans', idx, 'popular', e.target.checked)} /> Popular</label>
              </div>
            )} />
          </Section>

          <Section title="Upload & SEO">
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Media Upload"><input type="file" accept=".pdf,.zip,.rar,.png,.jpg,.jpeg" onChange={(e) => handleFileSelect(e, 'thumbnail')} className="input" /></Field>
              <Field label="Hero Banner Upload"><input type="file" accept=".pdf,.zip,.rar,.png,.jpg,.jpeg" onChange={(e) => handleFileSelect(e, 'heroBanner')} className="input" /></Field>
              <Field label="Meta Title"><input name="seo.metaTitle" value={form.seo.metaTitle} onChange={(e) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, metaTitle: e.target.value } }))} className="input" /></Field>
              <Field label="Meta Description"><input name="seo.metaDescription" value={form.seo.metaDescription} onChange={(e) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, metaDescription: e.target.value } }))} className="input" /></Field>
              <Field label="Keywords" className="md:col-span-2"><input value={form.seo.keywords.join(', ')} onChange={(e) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, keywords: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) } }))} className="input" /></Field>
            </div>
          </Section>

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={saving || uploading} className="flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-bg font-bold">{saving ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>} {editingId ? 'Update Bootcamp' : 'Create Bootcamp'}</button>
            <button type="button" onClick={resetForm} className="px-6 py-3 rounded-full bg-white/5 border border-white/10">Reset</button>
          </div>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-semibold">Bootcamp Directory</h3>
            <p className="text-text-secondary text-sm">View, edit, and remove published or draft bootcamps.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bootcamps" className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-3" />
          </div>
        </div>
        {loading ? <div className="py-10 text-center text-text-secondary">Loading bootcamps...</div> : filtered.length === 0 ? <div className="py-12 text-center text-text-secondary">No bootcamps yet.</div> : <div className="space-y-3">{filtered.map((item) => <div key={item._id} className="flex flex-col md:flex-row md:items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 gap-3"><div><div className="flex items-center gap-2"><h4 className="font-semibold">{item.title}</h4><span className="text-[10px] uppercase rounded-full border border-white/10 px-2 py-0.5">{item.status}</span></div><p className="text-sm text-text-secondary">{item.shortDescription || item.fullDescription}</p><div className="flex flex-wrap gap-2 mt-2 text-[11px] text-text-secondary"><span className="flex items-center gap-1"><CalendarDays size={12}/> {item.duration || 'N/A'}</span><span className="flex items-center gap-1"><BadgeCheck size={12}/> ₹{item.price || 0}</span></div></div><div className="flex gap-2"><button onClick={() => handleEdit(item)} className="p-2 rounded-lg hover:bg-white/10"><PencilLine size={16}/></button><button onClick={() => handleDelete(item._id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"><Trash2 size={16}/></button></div></div>)}</div>}
      </GlassCard>
    </div>
  );
};

const Field = ({ label, children, className = '' }) => (
  <label className={`space-y-2 ${className}`}>
    <span className="text-[10px] uppercase tracking-widest text-text-secondary">{label}</span>
    {children}
  </label>
);

const Section = ({ title, children }) => (
  <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
    <h3 className="text-sm font-semibold uppercase tracking-widest text-accent">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const DynamicList = ({ title, section, template, form, render, addItem, removeItem }) => {
  const items = form?.[section] || [];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-text-secondary">{title}</h4>
        <button type="button" onClick={() => addItem(section, template)} className="text-[11px] text-accent">+ Add</button>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-2">
            {render(item, idx)}
            <div className="flex justify-end">
              <button type="button" onClick={() => removeItem(section, idx)} className="rounded-lg border border-white/10 px-3 py-1 text-[11px] text-text-secondary">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default AdminBootcampManagement;
