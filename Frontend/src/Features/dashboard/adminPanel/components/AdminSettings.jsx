import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  User, Bell, Lock, Globe, Save, 
  Smartphone, Layout, Key, Check, Loader2,
  Mail, ShieldCheck, Database, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../auth/hooks/useAuth'; 
import toast from 'react-hot-toast';

// --- INTERNAL GLASS CARD COMPONENT (Matches your Shared component style) ---
const LocalGlassCard = ({ children, className = "" }) => (
  <div className={`bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] ${className}`}>
    {children}
  </div>
);

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const { user } = useSelector((state) => state.auth);
  const { handleUpdateProfile, handleUpdatePassword } = useAuth();
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "Profile", icon: User },
    { id: "Platform", icon: Globe },
    { id: "Security", icon: Lock },
    { id: "Notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 pb-32 font-sans">
      
      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto mb-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
            Settings
          </h1>
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-accent mt-2">
            System Parameters & User Identity
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDE NAVIGATION (Responsive Tabs) */}
        <div className="lg:col-span-3">
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar">
            {tabs.map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${
                  activeTab === tab.id 
                    ? 'bg-accent text-white border-accent/50 shadow-[0_0_30px_rgba(var(--accent-rgb),0.2)]' 
                    : 'bg-white/[0.02] text-zinc-500 border-white/5 hover:bg-white/5 hover:text-zinc-300'
                }`}
              >
                <tab.icon size={18} />
                {tab.id}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "Profile" && (
                <ProfileView user={user} onUpdate={handleUpdateProfile} />
              )}
              {activeTab === "Security" && (
                <SecurityView onUpdatePassword={handleUpdatePassword} />
              )}
              {activeTab === "Platform" && <PlaceholderTab icon={<Globe/>} title="Platform SEO" color="text-blue-400" />}
              {activeTab === "Notifications" && <NotificationView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        :root { --accent-rgb: 124, 58, 237; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .input-modern {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.25rem;
          padding: 1rem 1.25rem;
          font-size: 0.85rem;
          color: white;
          outline: none;
          transition: all 0.4s ease;
        }
        .input-modern:focus { 
           border-color: rgba(var(--accent-rgb), 0.5); 
           background: rgba(255, 255, 255, 0.05);
           box-shadow: 0 0 30px rgba(var(--accent-rgb), 0.15); 
        }
      `}</style>
    </div>
  );
};

// --- PROFILE VIEW (Integrated with handleUpdateProfile) ---
const ProfileView = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const res = await onUpdate(formData);
    if (res.success) toast.success("Identity profile updated");
    else toast.error(res.message);
    setLoading(false);
  };

  return (
    <LocalGlassCard className="p-8 md:p-12 space-y-10">
      <div className="flex items-center gap-5 border-b border-white/5 pb-8">
         <div className="p-4 bg-accent/10 rounded-2xl text-accent"><User size={28}/></div>
         <div>
            <h3 className="text-2xl font-black italic tracking-tight uppercase">Admin Identity</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Master Account Metadata</p>
         </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Field label="Full Name">
          <input className="input-modern" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </Field>
        <Field label="Contact Email">
          <input className="input-modern" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
        </Field>
        <Field label="Platform Role">
          <input className="input-modern bg-white/[0.01] text-zinc-600 border-dashed cursor-not-allowed" readOnly value={user?.role?.toUpperCase() || 'ADMINISTRATOR'} />
        </Field>
        <Field label="Integrity Status">
          <div className="h-[52px] flex items-center px-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-emerald-500 text-[10px] font-black uppercase tracking-widest italic">
            Verified Account
          </div>
        </Field>
      </div>

      <div className="pt-8 border-t border-white/5 flex justify-end">
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-accent text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 hover:shadow-[0_0_40px_rgba(var(--accent-rgb),0.3)] transition-all active:scale-95"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18}/>}
          Sync Profile
        </button>
      </div>
    </LocalGlassCard>
  );
};

// --- SECURITY VIEW (Integrated with handleUpdatePassword) ---
const SecurityView = ({ onUpdatePassword }) => {
  const [passData, setPassData] = useState({ current: '', next: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if(!passData.current || !passData.next) return toast.error("Missing credentials");
    setLoading(true);
    const res = await onUpdatePassword(passData.current, passData.next);
    if(res.success) {
      toast.success("Security Vault Updated");
      setPassData({ current: '', next: '' });
    } else toast.error(res.message);
    setLoading(false);
  };

  return (
    <LocalGlassCard className="p-8 md:p-12 space-y-10 border-white/5 shadow-2xl">
      <div className="flex items-center gap-5 border-b border-white/5 pb-8">
         <div className="p-4 bg-red-500/10 rounded-2xl text-red-500"><Lock size={28}/></div>
         <div>
            <h3 className="text-2xl font-black italic tracking-tight uppercase">Credential Vault</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Secret Rotation Protocol</p>
         </div>
      </div>
      
      <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-8">
        <Field label="Current Secret">
          <input type="password" placeholder="••••••••" className="input-modern" value={passData.current} onChange={(e) => setPassData({...passData, current: e.target.value})} />
        </Field>
        <Field label="Next Secret">
          <input type="password" placeholder="••••••••" className="input-modern" value={passData.next} onChange={(e) => setPassData({...passData, next: e.target.value})} />
        </Field>
        <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={loading} className="bg-white/5 border border-white/10 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Rotate Keys"}
            </button>
        </div>
      </form>
    </LocalGlassCard>
  );
};

const NotificationView = () => (
    <LocalGlassCard className="p-8 md:p-12 space-y-10 border-white/5">
      <div className="flex items-center gap-5 border-b border-white/5 pb-8">
         <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400"><Bell size={28}/></div>
         <div>
            <h3 className="text-2xl font-black italic tracking-tight uppercase">Signals</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Communication Logic</p>
         </div>
      </div>
      <div className="space-y-4">
         <ToggleItem label="Deployment Alerts" desc="Email notification for new student enrollments." defaultChecked />
         <ToggleItem label="Security Pings" desc="Alert for new login attempts from unknown devices." defaultChecked />
      </div>
    </LocalGlassCard>
);

const PlaceholderTab = ({ icon, title, color }) => (
    <LocalGlassCard className="p-8 md:p-24 border-white/5 text-center">
        <div className={`w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6 ${color}`}>
            {React.cloneElement(icon, { size: 40 })}
        </div>
        <h3 className="text-2xl font-black italic uppercase tracking-tighter">{title}</h3>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-2">Modules coming in v2.0 deployment</p>
    </LocalGlassCard>
);

// --- SHARED UI HELPERS ---
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-2">{label}</label>
    {children}
  </div>
);

const ToggleItem = ({ label, desc, defaultChecked }) => (
  <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] hover:bg-white/[0.04] transition-all">
    <div>
      <p className="text-white font-bold text-sm tracking-tight">{label}</p>
      <p className="text-[10px] text-zinc-500 font-medium italic mt-1">{desc}</p>
    </div>
    <input type="checkbox" defaultChecked={defaultChecked} className="w-6 h-6 accent-accent cursor-pointer" />
  </div>
);

export default AdminSettings;