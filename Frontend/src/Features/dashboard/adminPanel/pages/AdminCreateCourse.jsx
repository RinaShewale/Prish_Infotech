import React, { useState, useRef } from 'react';
import { GlassCard } from '../Shared/GlassCard';
import { Save, Plus, Trash2, Video, Image as ImageIcon, Loader2 } from 'lucide-react';
import { createCourse, uploadImage, uploadVideo } from '../services/admin.api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const TYPES = ['recorded', 'live'];

const AdminCreateCourse = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
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

  // Auto-generate slug from title
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

  const handleUploadThumbnail = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await uploadImage(formData);
      setCourse((prev) => ({ ...prev, thumbnail: data.url }));
      toast.success('Thumbnail uploaded!');
    } catch (err) {
      toast.error('Thumbnail upload failed');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('video', file);
      const { data } = await uploadVideo(formData);
      setCourse((prev) => ({ ...prev, video: data.url }));
      toast.success('Video uploaded!');
    } catch (err) {
      toast.error('Video upload failed');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSave = async () => {
    if (!course.title || !course.slug || !course.description || !course.price || !course.thumbnail) {
      toast.error('Please fill in all required fields (title, description, price, thumbnail)');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...course,
        price: Number(course.price),
        oldPrice: Number(course.oldPrice) || 0,
        category: course.category.split(',').map((c) => c.trim()).filter(Boolean),
        syllabus: course.syllabus.map((s) => ({
          ...s,
          topics: typeof s.topics === 'string' ? s.topics.split(',').map((t) => t.trim()).filter(Boolean) : s.topics,
          tools:  typeof s.tools  === 'string' ? s.tools.split(',').map((t) => t.trim()).filter(Boolean)  : s.tools,
        })),
      };
      await createCourse(payload);
      toast.success('Course created successfully!');
      navigate('/admin/courses');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create course');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-accent outline-none transition-colors text-sm';
  const labelCls = 'text-[10px] text-text-secondary uppercase font-bold block mb-2 tracking-widest';

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold italic">Create Course</h1>
          <p className="text-text-secondary">Deploy a new cohort to the platform.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-accent text-bg rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Publishing...' : 'Publish Cohort'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">

          {/* General Info */}
          <GlassCard className="p-8 space-y-5">
            <h3 className="text-lg font-bold text-accent">General Information</h3>
            <div>
              <label className={labelCls}>Course Title *</label>
              <input value={course.title} onChange={handleTitleChange} placeholder="e.g. Full-Stack Web Development" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug (auto-generated) *</label>
              <input value={course.slug} onChange={set('slug')} placeholder="full-stack-web-development" className={`${inputCls} font-mono`} />
            </div>
            <div>
              <label className={labelCls}>Description * (max 250 chars)</label>
              <textarea
                value={course.description}
                onChange={set('description')}
                maxLength={250}
                rows={4}
                placeholder="A compelling one-paragraph description..."
                className={inputCls}
              />
              <p className="text-[10px] text-text-secondary mt-1 text-right">{course.description.length}/250</p>
            </div>
            <div>
              <label className={labelCls}>Categories (comma-separated)</label>
              <input value={course.category} onChange={set('category')} placeholder="Frontend, React, JavaScript" className={inputCls} />
            </div>
          </GlassCard>

          {/* Hero Section */}
          <GlassCard className="p-8 space-y-5">
            <h3 className="text-lg font-bold text-accent">Hero Section</h3>
            <div>
              <label className={labelCls}>Hero Quote</label>
              <input value={course.heroQuote} onChange={set('heroQuote')} placeholder="Build Enterprise Software Like The Top 1%" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Hero Highlight Text</label>
              <input value={course.heroHighlight} onChange={set('heroHighlight')} placeholder="Become Industry Ready" className={inputCls} />
            </div>
          </GlassCard>

          {/* Syllabus */}
          <GlassCard className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-accent">Curriculum Blueprint</h3>
              <button
                onClick={addSyllabus}
                className="text-xs bg-white/10 px-3 py-1.5 rounded-full hover:bg-accent hover:text-bg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Phase
              </button>
            </div>
            <div className="space-y-4">
              {course.syllabus.length === 0 && (
                <p className="text-text-secondary text-sm text-center py-8 border border-dashed border-white/10 rounded-2xl">
                  No phases yet. Click "Add Phase" to build your curriculum.
                </p>
              )}
              {course.syllabus.map((s, idx) => (
                <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl relative group">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Phase 0{idx + 1}</span>
                    <button onClick={() => removeSyllabus(idx)} className="text-text-secondary hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    value={s.title}
                    onChange={(e) => updateSyllabus(idx, 'title', e.target.value)}
                    placeholder="Phase Title (e.g. Mastering React)"
                    className="block w-full bg-transparent border-b border-white/10 py-2 mb-4 outline-none font-bold text-sm"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Duration</label>
                      <input
                        value={s.duration}
                        onChange={(e) => updateSyllabus(idx, 'duration', e.target.value)}
                        placeholder="e.g. 2 Weeks"
                        className="w-full bg-white/5 p-2 rounded-lg text-xs outline-none border border-white/10 focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Tools (comma-separated)</label>
                      <input
                        value={typeof s.tools === 'string' ? s.tools : s.tools?.join(', ')}
                        onChange={(e) => updateSyllabus(idx, 'tools', e.target.value)}
                        placeholder="React, Node, Docker"
                        className="w-full bg-white/5 p-2 rounded-lg text-xs outline-none border border-white/10 focus:border-accent"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls}>Topics (comma-separated)</label>
                      <input
                        value={typeof s.topics === 'string' ? s.topics : s.topics?.join(', ')}
                        onChange={(e) => updateSyllabus(idx, 'topics', e.target.value)}
                        placeholder="State Management, Hooks, API Integration"
                        className="w-full bg-white/5 p-2 rounded-lg text-xs outline-none border border-white/10 focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* Pricing */}
          <GlassCard className="p-8 space-y-5">
            <h3 className="text-lg font-bold text-accent">Pricing & Logistics</h3>
            <div>
              <label className={labelCls}>Price (INR) *</label>
              <input type="number" value={course.price} onChange={set('price')} className={inputCls} placeholder="0" />
            </div>
            <div>
              <label className={labelCls}>Old Price (INR)</label>
              <input type="number" value={course.oldPrice} onChange={set('oldPrice')} className={inputCls} placeholder="0" />
            </div>
            <div>
              <label className={labelCls}>Level</label>
              <select value={course.level} onChange={set('level')} className={inputCls}>
                {LEVELS.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Course Type</label>
              <select value={course.type} onChange={set('type')} className={inputCls}>
                {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Access Duration</label>
              <input value={course.accessDuration} onChange={set('accessDuration')} className={inputCls} />
            </div>
          </GlassCard>

          {/* Media */}
          <GlassCard className="p-8 space-y-5">
            <h3 className="text-lg font-bold text-accent">Media Assets</h3>
            
            {/* Thumbnail Upload */}
            <div>
              <label className={labelCls}>Thumbnail *</label>
              <div 
                onClick={() => !uploadingThumbnail && thumbnailRef.current?.click()}
                className="mt-2 aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-text-secondary cursor-pointer hover:border-accent/50 transition-colors relative overflow-hidden group"
              >
                {course.thumbnail ? (
                  <>
                    <img src={course.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-sm font-bold">
                      Click to Change
                    </div>
                  </>
                ) : uploadingThumbnail ? (
                  <div className="flex flex-col items-center text-accent">
                    <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                    <span className="text-xs">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span className="text-xs font-medium">Click to Upload Thumbnail</span>
                    <span className="text-[10px] mt-1 opacity-50">JPG, PNG, WEBP</span>
                  </>
                )}
                <input 
                  type="file" 
                  ref={thumbnailRef} 
                  onChange={handleUploadThumbnail} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              {course.thumbnail && (
                <input value={course.thumbnail} onChange={set('thumbnail')} placeholder="https://..." className={`${inputCls} mt-2 text-xs`} />
              )}
            </div>

            {/* Video Upload */}
            <div>
              <label className={labelCls}>Intro Video</label>
              <div 
                onClick={() => !uploadingVideo && videoRef.current?.click()}
                className="mt-2 aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-text-secondary cursor-pointer hover:border-accent/50 transition-colors relative overflow-hidden group"
              >
                {course.video ? (
                  <>
                    <video src={course.video} className="w-full h-full object-cover" controls />
                    <div className="absolute top-2 right-2 bg-black/70 px-3 py-1 rounded text-[10px] text-white">
                      Click anywhere to change
                    </div>
                  </>
                ) : uploadingVideo ? (
                  <div className="flex flex-col items-center text-accent">
                    <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                    <span className="text-xs">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Video className="w-8 h-8 mb-2" />
                    <span className="text-xs font-medium">Click to Upload Intro Video</span>
                    <span className="text-[10px] mt-1 opacity-50">MP4, MOV, AVI</span>
                  </>
                )}
                <input 
                  type="file" 
                  ref={videoRef} 
                  onChange={handleUploadVideo} 
                  accept="video/*" 
                  className="hidden" 
                />
              </div>
              {course.video && (
                <input value={course.video} onChange={set('video')} placeholder="https://..." className={`${inputCls} mt-2 text-xs`} />
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateCourse;