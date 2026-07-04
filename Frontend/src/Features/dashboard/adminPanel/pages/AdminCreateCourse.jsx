import React, { useState, useRef } from 'react';
import { GlassCard } from '../Shared/GlassCard';
import { Save, Plus, Trash2, Video, Image as ImageIcon, Loader2, ArrowLeft, Sparkles, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCourse } from '../../Courses/hooks/useCourse';

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const TYPES = ['recorded', 'live'];

const AdminCreateCourse = () => {
  const navigate = useNavigate();
  const { handleCreateCourse } = useCourse();
  
  const { loading: isSaving } = useSelector((state) => state.course);

  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  
  const thumbnailRef = useRef(null);
  const videoRef = useRef(null);
  
  const [course, setCourse] = useState({
    title: '',
    slug: '',
    description: '',
    thumbnail: '',
    video: '',
    type: 'recorded',
    price: '',
    oldPrice: '',
    level: 'beginner',
    category: '',
    accessDuration: 'Lifetime Access',
    heroQuote: '',
    heroHighlight: '',
    syllabus: [],
  });

  const set = (key) => (e) => setCourse((prev) => ({ ...prev, [key]: e.target.value }));

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setCourse((prev) => ({
      ...prev,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  };

  const addSyllabus = () =>
    setCourse((prev) => ({
      ...prev,
      syllabus: [
        ...prev.syllabus,
        { phase: String(prev.syllabus.length + 1), title: '', duration: '', topics: [], tools: [] },
      ],
    }));

  const removeSyllabus = (idx) =>
    setCourse((prev) => ({
      ...prev,
      syllabus: prev.syllabus.filter((_, i) => i !== idx),
    }));

  const updateSyllabus = (idx, key, value) =>
    setCourse((prev) => ({
      ...prev,
      syllabus: prev.syllabus.map((s, i) =>
        i === idx ? { ...s, [key]: value } : s
      ),
    }));

  const handleThumbnailUploadPlaceholder = async (e) => {
    toast.error("Image upload service not found in course hook. Please paste a URL.");
  };

  const handleSave = async () => {
    if (!course.title || !course.slug || !course.description || !course.price || !course.thumbnail) {
      toast.error('Please fill in all required fields (title, description, price, thumbnail)');
      return;
    }

    const payload = {
      ...course,
      price: Number(course.price),
      oldPrice: Number(course.oldPrice) || 0,
      category: typeof course.category === 'string' 
        ? course.category.split(',').map((c) => c.trim()).filter(Boolean) 
        : course.category,
      syllabus: course.syllabus.map((s) => ({
        ...s,
        topics: typeof s.topics === 'string' ? s.topics.split(',').map((t) => t.trim()).filter(Boolean) : s.topics,
        tools:  typeof s.tools  === 'string' ? s.tools.split(',').map((t) => t.trim()).filter(Boolean)  : s.tools,
      })),
    };

    const result = await handleCreateCourse(payload);
    
    if (result.success) {
      toast.success('Course created successfully!');
      navigate('/admin/courses');
    } else {
      toast.error(result.message || 'Failed to create course');
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-text font-sans pb-32">
      {/* --- REFINED NAV --- */}
      {/* Lowered z-index to 11 to avoid overlapping global sidebars, adjusted mobile padding */}
      <nav className="sticky top-0 z-[11] h-20 bg-[#050508]/60 backdrop-blur-3xl border-b border-white/5 px-4 md:px-12 flex items-center justify-between mb-8 md:mb-12">
        <div className="flex items-center gap-3 md:gap-6 max-w-[60%]">
          <button onClick={() => navigate(-1)} className="p-2.5 md:p-3 bg-white/5 rounded-xl md:rounded-2xl transition-all hover:bg-accent/20 border border-white/10 group shrink-0">
            <ArrowLeft size={18} className="text-text-secondary group-hover:text-accent transition-colors" />
          </button>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-lg md:text-2xl tracking-tight text-white flex items-center gap-2 truncate">
              Create Course
              <Sparkles size={14} className="text-accent shrink-0 hidden xs:block" />
            </h1>
            <p className="text-[8px] md:text-[10px] text-accent/60 uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold truncate">New Deployment</p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="group relative bg-accent text-white px-4 md:px-10 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[11px] tracking-widest overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(var(--color-accent-rgb),0.3)] active:scale-95 disabled:opacity-50 shrink-0"
        >
          <span className="relative flex items-center gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 md:w-5 h-5 animate-spin" /> : <Save className="w-4 h-4 md:w-5 h-5" />}
            <span className="hidden xs:inline">{isSaving ? 'Publishing...' : 'Publish Cohort'}</span>
            <span className="xs:hidden">{isSaving ? '...' : 'Publish'}</span>
          </span>
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 relative z-[1]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* General Info */}
            <div className="bg-white/[0.02] p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-3xl space-y-8">
              <h3 className="text-[10px] md:text-sm font-black text-accent uppercase tracking-widest flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                General Information
              </h3>
              
              <Field label="Course Title" important>
                <input value={course.title} onChange={handleTitleChange} placeholder="e.g. Full-Stack Web Development" className="admin-input" />
              </Field>

              <Field label="Slug (URL Path)" important>
                <input value={course.slug} onChange={set('slug')} placeholder="full-stack-web-development" className="admin-input font-mono text-accent/80" />
              </Field>

              <Field label="Narrative Description" important>
                <textarea
                  value={course.description}
                  onChange={set('description')}
                  maxLength={250}
                  rows={4}
                  placeholder="Describe the learning journey in 250 characters..."
                  className="admin-input min-h-[120px] resize-none py-4"
                />
                <p className="text-[9px] text-text-secondary mt-2 text-right font-black uppercase tracking-widest opacity-50">{course.description.length}/250</p>
              </Field>

              <Field label="Categories (comma-separated)">
                <input value={course.category} onChange={set('category')} placeholder="Frontend, React, JavaScript" className="admin-input" />
              </Field>
            </div>

            {/* Hero Section */}
            <div className="bg-white/[0.02] p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-3xl space-y-8">
              <h3 className="text-[10px] md:text-sm font-black text-accent uppercase tracking-widest">Hero Configuration</h3>
              <Field label="Hero Quote">
                <input value={course.heroQuote} onChange={set('heroQuote')} placeholder="Build Enterprise Software Like The Top 1%" className="admin-input" />
              </Field>
              <Field label="Hero Highlight text">
                <input value={course.heroHighlight} onChange={set('heroHighlight')} placeholder="Become Industry Ready" className="admin-input" />
              </Field>
            </div>

            {/* Syllabus */}
            <div className="bg-white/[0.02] p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-3xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <h3 className="text-[10px] md:text-sm font-black text-accent uppercase tracking-widest">Curriculum Blueprint</h3>
                <button
                  onClick={addSyllabus}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-xl text-[10px] font-black transition-all border border-accent/20"
                >
                  <Plus className="w-4 h-4" /> ADD PHASE
                </button>
              </div>

              <div className="space-y-6">
                {course.syllabus.length === 0 && (
                  <div className="text-text-secondary text-[10px] font-black uppercase tracking-[0.3em] text-center py-16 border border-dashed border-white/10 rounded-[2rem] opacity-40">
                    Blueprint empty. Add a phase to start.
                  </div>
                )}
                {course.syllabus.map((s, idx) => (
                  <div key={idx} className="p-6 md:p-8 bg-black/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] relative group/item hover:border-accent/30 transition-all">
                    <div className="flex justify-between items-center mb-6">
                      <span className="px-3 py-1 rounded-md bg-accent/10 text-accent text-[10px] font-black tracking-widest uppercase border border-accent/20">Phase 0{idx + 1}</span>
                      <button onClick={() => removeSyllabus(idx)} className="text-text-secondary hover:text-red-400 transition-colors opacity-100 sm:opacity-0 group-hover/item:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      value={s.title}
                      onChange={(e) => updateSyllabus(idx, 'title', e.target.value)}
                      placeholder="Phase Title (e.g. Mastering React)"
                      className="admin-input !bg-transparent border-none p-0 text-base md:text-lg font-bold mb-6 focus:!ring-0 placeholder:opacity-20"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Duration">
                        <input value={s.duration} onChange={(e) => updateSyllabus(idx, 'duration', e.target.value)} placeholder="e.g. 2 Weeks" className="admin-input !bg-white/5" />
                      </Field>
                      <Field label="Tools Involved">
                        <input value={typeof s.tools === 'string' ? s.tools : s.tools?.join(', ')} onChange={(e) => updateSyllabus(idx, 'tools', e.target.value)} placeholder="React, Node, Docker" className="admin-input !bg-white/5" />
                      </Field>
                      <Field label="Learning Topics" className="md:col-span-2">
                        <input value={typeof s.topics === 'string' ? s.topics : s.topics?.join(', ')} onChange={(e) => updateSyllabus(idx, 'topics', e.target.value)} placeholder="State Management, Hooks, API Integration" className="admin-input !bg-white/5" />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {/* Pricing */}
            <div className="bg-white/[0.02] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-3xl space-y-8">
              <h3 className="text-[10px] md:text-sm font-black text-accent uppercase tracking-widest">Logistics</h3>
              <Field label="Regular Price (INR)">
                <input type="number" value={course.price} onChange={set('price')} className="admin-input !text-accent font-black text-lg" placeholder="0" />
              </Field>
              <Field label="Old Price (INR)">
                <input type="number" value={course.oldPrice} onChange={set('oldPrice')} className="admin-input opacity-60" placeholder="0" />
              </Field>
              
              <Field label="Experience Level">
                <div className="relative group custom-select-wrapper">
                  <select value={course.level} onChange={set('level')} className="admin-input appearance-none cursor-pointer pr-12 uppercase font-black text-[10px] tracking-widest">
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                </div>
              </Field>

              <Field label="Cohort Type">
                <div className="relative group custom-select-wrapper">
                  <select value={course.type} onChange={set('type')} className="admin-input appearance-none cursor-pointer pr-12 uppercase font-black text-[10px] tracking-widest">
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                </div>
              </Field>

              <Field label="Access Duration">
                <input value={course.accessDuration} onChange={set('accessDuration')} className="admin-input" />
              </Field>
            </div>

            {/* Media */}
            <div className="bg-white/[0.02] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-3xl space-y-8">
              <h3 className="text-[10px] md:text-sm font-black text-accent uppercase tracking-widest">Media Assets</h3>
              
              <Field label="Thumbnail Preview">
                <div 
                  onClick={() => thumbnailRef.current?.click()}
                  className="mt-2 aspect-video bg-black/40 border-2 border-dashed border-white/10 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center text-text-secondary cursor-pointer hover:border-accent/50 transition-all relative overflow-hidden group"
                >
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <ImageIcon className="w-8 h-8 opacity-20" />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Upload Image</span>
                    </div>
                  )}
                  <input type="file" ref={thumbnailRef} onChange={handleThumbnailUploadPlaceholder} accept="image/*" className="hidden" />
                </div>
                <input value={course.thumbnail} onChange={set('thumbnail')} placeholder="Paste image URL here" className="admin-input mt-4 !text-[11px] font-mono" />
              </Field>

              <Field label="Intro Video URL">
                <div 
                  className="mt-2 aspect-video bg-black/40 border-2 border-dashed border-white/10 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center text-text-secondary relative overflow-hidden"
                >
                  {course.video ? (
                    <video src={course.video} className="w-full h-full object-cover" controls />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Video className="w-8 h-8 opacity-20" />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-20 text-center px-4">Video URL Required For Preview</span>
                    </div>
                  )}
                </div>
                <input value={course.video} onChange={set('video')} placeholder="Paste video URL here" className="admin-input mt-4 !text-[11px] font-mono" />
              </Field>
            </div>
          </div>
        </div>
      </div>

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
          padding: 16px 22px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
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
  <div className={`space-y-3 ${className}`}>
    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-text-secondary/50 ml-1 flex items-center gap-2">
      {label} {important && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
    </label>
    {children}
  </div>
);

export default AdminCreateCourse;