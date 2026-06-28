import React, { useEffect, useRef, useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { GlassCard } from '../Shared/GlassCard';
import { Upload, Copy, Play, Trash2, Image as ImageIcon, Video, Check, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage, uploadVideo } from '../services/admin.api';

const ASSET_CONFIG = [
  { key: 'courseInfoVideo', label: 'Course Info Video', type: 'video' },
  { key: 'reelVideo',       label: 'Marketing Reel',    type: 'video' },
  { key: 'img1',            label: 'Hero Image 1',      type: 'image' },
  { key: 'img2',            label: 'Hero Image 2',      type: 'image' },
  { key: 'studentImg1',     label: 'Home Page Student 1', type: 'image' },
  { key: 'studentImg2',     label: 'Home Page Student 2', type: 'image' },
  { key: 'studentImg3',     label: 'Home Page Student 3', type: 'image' },
  { key: 'studentImg4',     label: 'Home Page Student 4', type: 'image' },
];

const MediaLibrary = () => {
  const { media, fetchMedia, saveMedia } = useAdmin();
  const [uploading, setUploading] = useState({});
  const [copied, setCopied] = useState({});
  const fileRefs = useRef({});
  
  // Custom Asset Form State
  const [newAsset, setNewAsset] = useState({ key: '', label: '', type: 'image', file: null });
  const [isCreatingAsset, setIsCreatingAsset] = useState(false);

  useEffect(() => { 
    fetchMedia(); 
  }, []);

  const handleUpload = async (assetKey, assetType, file) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [assetKey]: true }));
    try {
      const formData = new FormData();
      if (assetType === 'video') {
        formData.append('video', file);
        const { data } = await uploadVideo(formData);
        await saveMedia({ ...media, [assetKey]: data.url });
      } else {
        formData.append('image', file);
        const { data } = await uploadImage(formData);
        await saveMedia({ ...media, [assetKey]: data.url });
      }
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading((prev) => ({ ...prev, [assetKey]: false }));
    }
  };

  const handleCopy = (url, key) => {
    if (!url) { toast.error('No URL to copy yet'); return; }
    navigator.clipboard.writeText(url);
    setCopied((prev) => ({ ...prev, [key]: true }));
    toast.success('URL copied!');
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 2000);
  };

  const handleDelete = async (assetKey) => {
    await saveMedia({ ...media, [assetKey]: '' });
  };

  // Create new custom asset
  const handleCreateCustomAsset = async (e) => {
    e.preventDefault();
    if (!newAsset.key || !newAsset.label || !newAsset.file) {
      toast.error('Please fill all fields and select a file');
      return;
    }
    
    setIsCreatingAsset(true);
    try {
      const formData = new FormData();
      let uploadedUrl = '';
      
      if (newAsset.type === 'video') {
        formData.append('video', newAsset.file);
        const { data } = await uploadVideo(formData);
        uploadedUrl = data.url;
      } else {
        formData.append('image', newAsset.file);
        const { data } = await uploadImage(formData);
        uploadedUrl = data.url;
      }
      
      const newCustomAsset = {
        key: newAsset.key,
        label: newAsset.label,
        type: newAsset.type,
        url: uploadedUrl
      };

      const existingCustomAssets = media?.customAssets || [];
      const updatedCustomAssets = [...existingCustomAssets, newCustomAsset];
      
      await saveMedia({ ...media, customAssets: updatedCustomAssets });
      toast.success('Asset created successfully');
      setNewAsset({ key: '', label: '', type: 'image', file: null });
    } catch (error) {
      toast.error('Failed to create asset');
    } finally {
      setIsCreatingAsset(false);
    }
  };

  const handleDeleteCustomAsset = async (keyToRemove) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    try {
      const existingCustomAssets = media?.customAssets || [];
      const updatedCustomAssets = existingCustomAssets.filter(asset => asset.key !== keyToRemove);
      await saveMedia({ ...media, customAssets: updatedCustomAssets });
      toast.success("Asset deleted");
    } catch (error) {
      toast.error("Failed to delete asset");
    }
  };

  const customAssets = media?.customAssets || [];

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-4xl font-display font-bold italic tracking-tight">Marketing Vault</h1>
        <p className="text-text-secondary mt-1">Upload and manage all public-facing media assets for the Prish Infotech website.</p>
      </div>

      {/* Dynamic Home Page Assets Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-white/10 pb-2">Custom Home Page Assets</h2>
        
        {/* Create Form */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-medium mb-4">Create New Asset</h3>
          <form onSubmit={handleCreateCustomAsset} className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-text-secondary mb-1">Key (Unique ID)</label>
              <input 
                type="text" 
                placeholder="e.g. heroBanner" 
                value={newAsset.key}
                onChange={e => setNewAsset({...newAsset, key: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-text-secondary mb-1">Label</label>
              <input 
                type="text" 
                placeholder="e.g. Hero Banner" 
                value={newAsset.label}
                onChange={e => setNewAsset({...newAsset, label: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Type</label>
              <select 
                value={newAsset.type}
                onChange={e => setNewAsset({...newAsset, type: e.target.value})}
                className="bg-white/5 border border-white/10 rounded-lg p-2 text-white"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">File</label>
              <input 
                type="file" 
                accept={newAsset.type === 'video' ? 'video/*' : 'image/*'}
                onChange={e => setNewAsset({...newAsset, file: e.target.files[0]})}
                className="text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30"
              />
            </div>
            <button 
              type="submit" 
              disabled={isCreatingAsset}
              className="bg-accent text-bg px-6 py-2 rounded-lg font-bold hover:opacity-90 flex items-center gap-2"
            >
              {isCreatingAsset ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              Create
            </button>
          </form>
        </GlassCard>

        {/* Dynamic Assets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {customAssets.map((asset) => {
            const isCopied = copied[asset.key];
            return (
              <GlassCard key={asset.key} className="p-4 group">
                <div className="aspect-square bg-white/[0.03] border border-white/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                  {asset.type === 'video' ? (
                    <video src={asset.url} className="w-full h-full object-cover" muted onMouseEnter={(e) => e.target.play()} onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }} />
                  ) : (
                    <img src={asset.url} alt={asset.label} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button onClick={() => handleCopy(asset.url, asset.key)} className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors" title="Copy URL">
                      {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDeleteCustomAsset(asset.key)} className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/40 transition-colors" title="Remove">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] text-accent font-bold uppercase tracking-widest">{asset.key}</p>
                  <p className="text-sm font-semibold mt-0.5">{asset.label}</p>
                  <p className="text-[10px] text-text-secondary truncate mt-1 font-mono">{asset.url}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 pt-6">
        <h2 className="text-2xl font-semibold border-b border-white/10 pb-2">Static Application Assets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ASSET_CONFIG.map((asset) => {
            const url = media?.[asset.key];
            const isUploading = uploading[asset.key];
            const isCopied = copied[asset.key];

            return (
              <GlassCard key={asset.key} className="p-4 group">
                <div className="aspect-square bg-white/[0.03] border border-white/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                  {url ? (
                    asset.type === 'video' ? (
                      <video src={url} className="w-full h-full object-cover" muted onMouseEnter={(e) => e.target.play()} onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }} />
                    ) : (
                      <img src={url} alt={asset.label} className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-white/20">
                      {asset.type === 'video' ? <Video className="w-10 h-10" /> : <ImageIcon className="w-10 h-10" />}
                      <span className="text-[10px] uppercase tracking-widest">No Asset</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button onClick={() => fileRefs.current[asset.key]?.click()} className="p-2 bg-accent text-bg rounded-full hover:scale-110 transition-transform" title="Upload">
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleCopy(url, asset.key)} className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors" title="Copy URL">
                      {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {url && (
                      <button onClick={() => handleDelete(asset.key)} className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/40 transition-colors" title="Remove">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                  </div>

                  <input ref={(el) => (fileRefs.current[asset.key] = el)} type="file" accept={asset.type === 'video' ? 'video/*' : 'image/*'} className="hidden" onChange={(e) => handleUpload(asset.key, asset.type, e.target.files[0])} />
                </div>

                <div className="mt-4">
                  <p className="text-[10px] text-accent font-bold uppercase tracking-widest">{asset.key}</p>
                  <p className="text-sm font-semibold mt-0.5">{asset.label}</p>
                  {url && (
                    <p className="text-[10px] text-text-secondary truncate mt-1 font-mono">{url}</p>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;