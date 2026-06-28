import React, { useRef, useState, useEffect } from 'react';
import { useMedia } from '../hooks/useMedia';
import { GlassCard } from '../Shared/GlassCard';
import { 
  Upload, Video, Image as ImageIcon, Check, 
  Loader2, Trash2, Copy, Layout, Users, PlayCircle, Plus, X 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage, uploadVideo } from '../services/admin.api';

const MediaLibrary = () => {
  const { media, fetchMedia, saveMedia } = useMedia();
  const [uploading, setUploading] = useState({});
  const fileInputRefs = useRef({});

  // Form State for "Custom Assets"
  const [customForm, setCustomForm] = useState({ key: '', label: '', type: 'image' });

  useEffect(() => { fetchMedia(); }, []);

  /**
   * HANDLER: Upload to Specific Schema Keys
   * Matches: reelVideo, courseInfoVideo, img1, img2, studentImg1-4
   */
  const handleSingleUpload = async (key, type, file) => {
    if (!file) return;
    setUploading(prev => ({ ...prev, [key]: true }));

    try {
      const formData = new FormData();
      let res;
      
      if (type === 'video') {
        formData.append('video', file);
        res = await uploadVideo(formData);
      } else {
        formData.append('image', file);
        res = await uploadImage(formData);
      }

      // Update the specific schema field
      const updatedData = { ...media, [key]: res.data.url };
      await saveMedia(updatedData);
      
      toast.success(`${key} updated!`);
    } catch (err) {
      toast.error(`Upload failed for ${key}`);
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  /**
   * HANDLER: Custom Assets Array
   * Matches: customAssets: [{ key, label, type, url }]
   */
  const handleAddCustomAsset = async (file) => {
    if (!customForm.key || !customForm.label || !file) {
      return toast.error("Fill key, label and select file");
    }

    setUploading(prev => ({ ...prev, custom: true }));
    try {
      const formData = new FormData();
      const res = customForm.type === 'video' ? await uploadVideo(formData.append('video', file)) : await uploadImage(formData.append('image', file));
      
      const newItem = { ...customForm, url: res.data.url };
      const updatedCustom = [...(media.customAssets || []), newItem];
      
      await saveMedia({ ...media, customAssets: updatedCustom });
      setCustomForm({ key: '', label: '', type: 'image' });
      toast.success("Custom asset added");
    } catch (err) {
      toast.error("Custom asset failed");
    } finally {
      setUploading(prev => ({ ...prev, custom: false }));
    }
  };

  const removeCustomAsset = async (key) => {
    const filtered = media.customAssets.filter(item => item.key !== key);
    await saveMedia({ ...media, customAssets: filtered });
  };

  /**
   * HANDLER: Gallery Pool
   * Matches: images: [String]
   */
  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    setUploading(prev => ({ ...prev, gallery: true }));
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await uploadImage(formData);
      await saveMedia({ ...media, images: [...(media.images || []), data.url] });
      toast.success("Added to gallery pool");
    } finally {
      setUploading(prev => ({ ...prev, gallery: false }));
    }
  };

  // Sections config mapping exactly to your Schema
  const sections = [
    {
      title: "Hero Banner (Static)",
      icon: <Layout className="text-accent" />,
      items: [
        { key: 'img1', label: 'Primary Hero Image', type: 'image' },
        { key: 'img2', label: 'Secondary Hero Image', type: 'image' },
      ]
    },
    {
      title: "Marketing Reels",
      icon: <PlayCircle className="text-blue-400" />,
      items: [
        { key: 'reelVideo', label: 'Marketing Reel (Short)', type: 'video' },
        { key: 'courseInfoVideo', label: 'Course Info (Full)', type: 'video' },
      ]
    },
    {
      title: "Student Showcase",
      icon: <Users className="text-purple-400" />,
      items: [
        { key: 'studentImg1', label: 'Graduate Profile 1', type: 'image' },
        { key: 'studentImg2', label: 'Graduate Profile 2', type: 'image' },
        { key: 'studentImg3', label: 'Graduate Profile 3', type: 'image' },
        { key: 'studentImg4', label: 'Graduate Profile 4', type: 'image' },
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-12">
      <div>
        <h1 className="text-4xl font-bold italic">Website Asset Manager</h1>
        <p className="text-text-secondary">Direct mapping to MongoDB Schema: <code>Media</code></p>
      </div>

      {/* 1. Mapped Sections (img1, studentImg1, etc) */}
      {sections.map((section, idx) => (
        <div key={idx} className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/10 pb-2 uppercase tracking-widest text-white/70">
            {section.icon} {section.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {section.items.map(item => (
              <GlassCard key={item.key} className="p-4 group">
                <div className="aspect-square rounded-xl bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center relative">
                  {media?.[item.key] ? (
                    item.type === 'video' ? 
                    <video src={media[item.key]} className="w-full h-full object-cover" muted /> : 
                    <img src={media[item.key]} className="w-full h-full object-cover" />
                  ) : (
                    <div className="opacity-20 text-center">
                       {item.type === 'video' ? <Video size={32}/> : <ImageIcon size={32}/>}
                       <p className="text-[10px] mt-2">EMPTY</p>
                    </div>
                  )}
                  {/* Hover Upload Trigger */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => fileInputRefs.current[item.key].click()}
                      className="bg-accent text-bg p-3 rounded-full hover:scale-110 transition-transform"
                    >
                      {uploading[item.key] ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                    </button>
                  </div>
                  <input type="file" className="hidden" ref={el => fileInputRefs.current[item.key] = el} onChange={(e) => handleSingleUpload(item.key, item.type, e.target.files[0])} />
                </div>
                <div className="mt-3">
                  <p className="text-[10px] text-accent font-mono uppercase tracking-tighter">{item.key}</p>
                  <p className="text-sm font-semibold">{item.label}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      ))}

      {/* 2. Custom Assets (Dynamic Array) */}
      <div className="space-y-4 pt-8 border-t border-white/10">
        <h2 className="text-xl font-bold uppercase tracking-widest text-white/70">Dynamic Custom Assets</h2>
        <GlassCard className="p-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-text-secondary block mb-1">Asset Key (Unique)</label>
              <input value={customForm.key} onChange={e => setCustomForm({...customForm, key: e.target.value})} className="w-full bg-white/5 border border-white/10 p-2 rounded" placeholder="e.g. promoBanner" />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-text-secondary block mb-1">Display Label</label>
              <input value={customForm.label} onChange={e => setCustomForm({...customForm, label: e.target.value})} className="w-full bg-white/5 border border-white/10 p-2 rounded" placeholder="e.g. Summer Promo" />
            </div>
            <select value={customForm.type} onChange={e => setCustomForm({...customForm, type: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded h-[42px]">
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <label className="bg-white text-bg px-4 py-2 rounded font-bold cursor-pointer hover:bg-accent transition-colors">
              {uploading.custom ? <Loader2 className="animate-spin"/> : "Create & Upload"}
              <input type="file" className="hidden" onChange={e => handleAddCustomAsset(e.target.files[0])} />
            </label>
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            {media?.customAssets?.map(asset => (
              <div key={asset.key} className="bg-white/5 rounded-lg p-2 relative group border border-white/10">
                <div className="aspect-video bg-black/20 rounded overflow-hidden">
                   {asset.type === 'video' ? <video src={asset.url} className="w-full h-full object-cover" /> : <img src={asset.url} className="w-full h-full object-cover" />}
                </div>
                <p className="text-[10px] font-bold mt-2 truncate">{asset.label}</p>
                <button onClick={() => removeCustomAsset(asset.key)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* 3. General Image Pool (Gallery) */}
      <div className="space-y-4 pt-8 border-t border-white/10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold uppercase tracking-widest text-white/70">Gallery Pool</h2>
          <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-all">
            {uploading.gallery ? "Uploading..." : "+ Add to Gallery"}
            <input type="file" className="hidden" onChange={handleGalleryUpload} />
          </label>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {media?.images?.map((url, i) => (
            <div key={i} className="aspect-square bg-white/5 rounded-lg border border-white/5 relative group overflow-hidden">
               <img src={url} className="w-full h-full object-cover" />
               <button onClick={() => saveMedia({...media, images: media.images.filter(u => u !== url)})} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                 <Trash2 size={16} />
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;