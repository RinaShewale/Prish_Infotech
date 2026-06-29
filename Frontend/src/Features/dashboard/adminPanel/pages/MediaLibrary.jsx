import React, { useRef, useState, useEffect } from 'react';
import { useMedia } from '../hooks/useMedia';
import { GlassCard } from '../Shared/GlassCard';
import { 
  Upload, Video, Image as ImageIcon, 
  Loader2, Trash2, Layout, Users, PlayCircle, X 
} from 'lucide-react';
import toast from 'react-hot-toast';

const MediaLibrary = () => {
  const { 
    media, fetchMedia, saveMedia, 
    handleUploadImage, handleUploadVideo, loading 
  } = useMedia();

  const [uploading, setUploading] = useState({});
  const fileInputRefs = useRef({});
  const [customForm, setCustomForm] = useState({ key: '', label: '', type: 'image' });

  useEffect(() => { fetchMedia(); }, []);

  // Handler for fixed fields (img1, reelVideo, etc)
  const onFileChange = async (key, type, file) => {
    if (!file) return;
    setUploading(prev => ({ ...prev, [key]: true }));
    try {
      const res = type === 'video' ? await handleUploadVideo(file) : await handleUploadImage(file);
      await saveMedia({ [key]: res.url });
      toast.success(`${key} updated`);
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  // Handler for dynamic assets
  const onAddCustomAsset = async (file) => {
    if (!customForm.key || !customForm.label || !file) return toast.error("Missing fields");
    setUploading(prev => ({ ...prev, custom: true }));
    try {
      const res = customForm.type === 'video' ? await handleUploadVideo(file) : await handleUploadImage(file);
      const newItem = { ...customForm, url: res.url };
      const updatedList = [...(media?.customAssets || []), newItem];
      await saveMedia({ customAssets: updatedList });
      setCustomForm({ key: '', label: '', type: 'image' });
      toast.success("Asset added");
    } catch (err) {
      toast.error("Asset creation failed");
    } finally {
      setUploading(prev => ({ ...prev, custom: false }));
    }
  };

  // Handler for gallery
  const onGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(prev => ({ ...prev, gallery: true }));
    try {
      const res = await handleUploadImage(file);
      const updatedGallery = [...(media?.images || []), res.url];
      await saveMedia({ images: updatedGallery });
      toast.success("Gallery updated");
    } finally {
      setUploading(prev => ({ ...prev, gallery: false }));
    }
  };

  const sections = [
    {
      title: "Hero Banner",
      icon: <Layout className="text-accent" />,
      items: [
        { key: 'img1', label: 'Primary Hero', type: 'image' },
        { key: 'img2', label: 'Secondary Hero', type: 'image' },
      ]
    },
    {
      title: "Marketing Video",
      icon: <PlayCircle className="text-blue-400" />,
      items: [
        { key: 'reelVideo', label: 'Short Reel', type: 'video' },
        { key: 'courseInfoVideo', label: 'Full Intro', type: 'video' },
      ]
    },
    {
      title: "Students",
      icon: <Users className="text-purple-400" />,
      items: [
        { key: 'studentImg1', label: 'Student 1', type: 'image' },
        { key: 'studentImg2', label: 'Student 2', type: 'image' },
        { key: 'studentImg3', label: 'Student 3', type: 'image' },
        { key: 'studentImg4', label: 'Student 4', type: 'image' },
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-12 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold italic">Media Manager</h1>
          <p className="text-text-secondary">Official assets for the platform.</p>
        </div>
        {loading && <Loader2 className="animate-spin text-accent" />}
      </div>

      {sections.map((sec, idx) => (
        <div key={idx} className="space-y-4">
          <h2 className="text-sm font-bold flex items-center gap-2 border-b border-white/5 pb-2 uppercase tracking-widest text-white/50">
            {sec.icon} {sec.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sec.items.map(item => (
              <GlassCard key={item.key} className="p-3 group">
                <div className="aspect-square bg-black/40 rounded-lg overflow-hidden flex items-center justify-center relative border border-white/5">
                  {media?.[item.key] ? (
                    item.type === 'video' ? 
                    <video src={media[item.key]} className="w-full h-full object-cover" /> : 
                    <img src={media[item.key]} className="w-full h-full object-cover" />
                  ) : <div className="opacity-10">{item.type === 'video' ? <Video size={40}/> : <ImageIcon size={40}/>}</div>}
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <button 
                      onClick={() => fileInputRefs.current[item.key].click()}
                      className="bg-white text-black p-2 rounded-full"
                    >
                      {uploading[item.key] ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                    </button>
                  </div>
                  <input type="file" className="hidden" ref={el => fileInputRefs.current[item.key] = el} onChange={e => onFileChange(item.key, item.type, e.target.files[0])} />
                </div>
                <p className="text-[10px] mt-2 font-bold uppercase text-accent">{item.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      ))}

      {/* Dynamic Assets */}
      <div className="pt-8 border-t border-white/10 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/50">Custom Dynamic Assets</h2>
        <GlassCard className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <input placeholder="Unique Key" value={customForm.key} onChange={e => setCustomForm({...customForm, key: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm" />
            <input placeholder="Label" value={customForm.label} onChange={e => setCustomForm({...customForm, label: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm" />
            <select value={customForm.type} onChange={e => setCustomForm({...customForm, type: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white">
               <option value="image" className='bg-black'>Image</option>
               <option value="video" className='bg-black'>Video</option>
            </select>
            <label className="bg-accent text-bg text-center py-2 rounded font-bold text-sm cursor-pointer hover:opacity-90">
               {uploading.custom ? <Loader2 className="animate-spin mx-auto" size={20}/> : "Upload & Add"}
               <input type="file" className="hidden" onChange={e => onAddCustomAsset(e.target.files[0])} />
            </label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">
            {media?.customAssets?.map(asset => (
              <div key={asset.key} className="relative group border border-white/5 p-2 rounded bg-white/5">
                <div className="aspect-video bg-black rounded overflow-hidden">
                   {asset.type === 'video' ? <video src={asset.url} /> : <img src={asset.url} />}
                </div>
                <p className="text-[10px] mt-1 truncate opacity-50">{asset.label}</p>
                <button onClick={() => saveMedia({ customAssets: media.customAssets.filter(a => a.key !== asset.key)})} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"><X size={10}/></button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Gallery Pool */}
      <div className="pt-8 border-t border-white/10 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/50">Gallery Pool</h2>
          <label className="bg-white/10 px-4 py-2 rounded-lg text-xs cursor-pointer hover:bg-white/20">
            {uploading.gallery ? "Uploading..." : "+ Add to Gallery"}
            <input type="file" className="hidden" onChange={onGalleryUpload} />
          </label>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-10 gap-2">
          {media?.images?.map((url, i) => (
            <div key={i} className="aspect-square relative group rounded overflow-hidden border border-white/5">
               <img src={url} className="w-full h-full object-cover" />
               <button onClick={() => saveMedia({ images: media.images.filter(u => u !== url)})} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Trash2 size={14}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;