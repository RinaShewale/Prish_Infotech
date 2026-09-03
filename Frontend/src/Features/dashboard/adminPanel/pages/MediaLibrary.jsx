import { useRef, useState, useEffect } from 'react';
import { useMedia } from '../hooks/useMedia';
import { GlassCard } from '../Shared/GlassCard';
import { 
  Upload, Video, Image as ImageIcon, 
  Loader2, Trash2, Layout, Users, PlayCircle, X, 
  Plus, FilePlus, ChevronDown, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// --- CUSTOM THEMED SELECT ---
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
    <div className="space-y-2 relative w-full" ref={containerRef}>
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 ml-1 font-black">{label}</span>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={`w-full flex items-center justify-between bg-white/[0.03] border ${isOpen ? 'border-accent/50 shadow-[0_0_15px_rgba(var(--accent-rgb),0.1)]' : 'border-white/10'} rounded-xl px-4 py-3 text-xs text-white transition-all`}>
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

const MediaLibrary = () => {
  const { media, fetchMedia, saveMedia, handleUploadImage, handleUploadVideo, loading } = useMedia();
  const [uploading, setUploading] = useState({});
  const fileInputRefs = useRef({});
  const [customForm, setCustomForm] = useState({ key: '', label: '', type: 'image' });

  useEffect(() => { fetchMedia(); }, []);

  const onFileChange = async (key, type, file) => {
    if (!file) return;
    setUploading(prev => ({ ...prev, [key]: true }));
    try {
      const res = type === 'video' ? await handleUploadVideo(file) : await handleUploadImage(file);
      await saveMedia({ [key]: res.url });
      toast.success(`${key} synchronized`);
    } catch (err) { toast.error(err.response?.data?.message || "Deployment failed"); }
    finally { setUploading(prev => ({ ...prev, [key]: false })); }
  };

  const onDrop = (event, key, type) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    if ((type === 'video') !== isVideo) {
      toast.error(`Please drop a ${type} file here`);
      return;
    }

    onFileChange(key, type, file);
  };

  const onAddCustomAsset = async (file) => {
    if (!customForm.key || !customForm.label || !file) return toast.error("Incomplete parameters");
    setUploading(prev => ({ ...prev, custom: true }));
    try {
      const res = customForm.type === 'video' ? await handleUploadVideo(file) : await handleUploadImage(file);
      const updatedList = [...(media?.customAssets || []), { ...customForm, url: res.url }];
      await saveMedia({ customAssets: updatedList });
      setCustomForm({ key: '', label: '', type: 'image' });
      toast.success("Asset integrated");
    } catch (err) { toast.error(err.response?.data?.message || "Integration failed"); }
    finally { setUploading(prev => ({ ...prev, custom: false })); }
  };

  const onGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(prev => ({ ...prev, gallery: true }));
    try {
      const res = await handleUploadImage(file);
      await saveMedia({ images: [...(media?.images || []), res.url] });
      toast.success("Pool updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Image upload failed");
    } finally {
      e.target.value = '';
      setUploading(prev => ({ ...prev, gallery: false }));
    }
  };

  const sections = [
    { title: "Visual Banners", icon: <Layout size={18} className="text-accent" />, items: [{ key: 'img1', label: 'Primary Hero', type: 'image' }, { key: 'img2', label: 'Secondary Hero', type: 'image' }] },
    { title: "Motion Content", icon: <PlayCircle size={18} className="text-blue-400" />, items: [{ key: 'reelVideo', label: 'Short Reel', type: 'video' }, { key: 'courseInfoVideo', label: 'Curriculum Intro', type: 'video' }] },
    { title: "Student Roster", icon: <Users size={18} className="text-purple-400" />, items: [{ key: 'studentImg1', label: 'Student A', type: 'image' }, { key: 'studentImg2', label: 'Student B', type: 'image' }, { key: 'studentImg3', label: 'Student C', type: 'image' }, { key: 'studentImg4', label: 'Student D', type: 'image' }] }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-32 space-y-12 px-4 md:px-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white leading-none">Media Registry</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mt-2">Core Platform Assets</p>
        </div>
        {loading && <Loader2 className="animate-spin text-accent" size={24} />}
      </div>

      {/* CORE SECTIONS */}
      {sections.map((sec, idx) => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
             <div className="p-2 bg-white/5 rounded-lg">{sec.icon}</div>
             <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">{sec.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sec.items.map(item => (
              <GlassCard key={item.key} className="p-4 group border-white/5 hover:border-accent/30 transition-all overflow-hidden relative">
                <div
                  onDragOver={event => event.preventDefault()}
                  onDrop={event => onDrop(event, item.key, item.type)}
                  className="aspect-square bg-black/40 rounded-2xl overflow-hidden flex items-center justify-center relative border border-white/5"
                >
                  {media?.[item.key] ? (
                    item.type === 'video' ? 
                    <video src={media[item.key]} className="w-full h-full object-cover" /> : 
                    <img src={media[item.key]} className="w-full h-full object-cover" alt="" />
                  ) : <div className="opacity-10 text-zinc-500">{item.type === 'video' ? <Video size={60}/> : <ImageIcon size={60}/>}</div>}
                  
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all backdrop-blur-sm">
                    <button onClick={() => fileInputRefs.current[item.key].click()} className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      {uploading[item.key] ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                    </button>
                    <span className="text-[8px] font-black uppercase tracking-widest text-white mt-3">Drop or Upload</span>
                  </div>
                  <input type="file" accept={item.type === 'video' ? 'video/mp4,video/quicktime,video/x-msvideo' : 'image/jpeg,image/png,image/webp'} className="hidden" ref={el => fileInputRefs.current[item.key] = el} onChange={e => onFileChange(item.key, item.type, e.target.files[0])} />
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{item.label}</p>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-white/5 text-zinc-600 font-bold uppercase">{item.type}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      ))}


     

      <style>{`
        :root { --accent-rgb: 124, 58, 237; }
        .input-modern {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.75rem;
          color: white;
          outline: none;
          transition: all 0.3s ease;
        }
        .input-modern:focus { border-color: rgba(var(--accent-rgb), 0.5); box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.1); }
      `}</style>
    </div>
  );
};

const Field = ({ label, children }) => (
  <label className="space-y-2 flex flex-col w-full">
    <span className="text-[10px] uppercase tracking-widest text-zinc-500 ml-1 font-black">{label}</span>
    {children}
  </label>
);

export default MediaLibrary;