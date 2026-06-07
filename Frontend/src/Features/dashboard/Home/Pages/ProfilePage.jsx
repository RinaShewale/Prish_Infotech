import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, BookOpen, Calendar, 
  Settings, ChevronRight, ShieldCheck, 
  MessageSquareHeart, Zap, X, Phone, 
  MapPin, Briefcase, Pencil, Star
} from "lucide-react";

import { ReviewModal } from "../../Home/components/ReviewModal"; 
import { getMyEnrollments } from "../../Courses/enrollment.slice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector((state) => state.auth.user);
  const { enrollments = [] } = useSelector((state) => state.enrollment);

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (user) { dispatch(getMyEnrollments()); }
  }, [user, dispatch]);

  const courses = useMemo(() => {
    return enrollments.map((e) => ({
      id: e.course?._id,
      name: e.course?.title || "Untitled Course",
      progress: e.progress ?? e.courseProgress?.progress ?? 0,
    }));
  }, [enrollments]);

  const stats = useMemo(() => ({
    total: courses.length,
    certificates: courses.filter(c => c.progress >= 100).length,
    avgProgress: courses.length ? Math.round(courses.reduce((a, c) => a + c.progress, 0) / courses.length) : 0
  }), [courses]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row items-center gap-8 mb-16 pb-12 border-b border-white/5">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center text-accent text-5xl font-bold overflow-hidden shadow-[0_0_50px_rgba(212,163,149,0.1)]">
              {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-2">{user?.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/40 text-sm">
              <span className="flex items-center gap-2"><Mail size={16} className="text-accent" /> {user?.email}</span>
              <span className="flex items-center gap-2"><Calendar size={16} className="text-accent" /> Joined 2024</span>
            </div>
          </div>

          <button 
            onClick={() => setIsEditOpen(true)}
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3"
          >
            <Settings size={16} /> Edit Profile
          </button>
        </motion.div>

        {/* --- CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-[#111] border border-white/5">
              <h3 className="text-accent text-[10px] font-bold uppercase tracking-widest mb-8 flex items-center gap-2"><Zap size={14} /> Stats</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-end pb-4 border-b border-white/5">
                    <span className="text-white/40 text-sm">Enrolled</span>
                    <span className="text-2xl font-light">{stats.total}</span>
                </div>
                <div className="flex justify-between items-end">
                    <span className="text-white/40 text-sm">Progress</span>
                    <span className="text-2xl font-light text-accent">{stats.avgProgress}%</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#1a1311] to-[#111] border border-accent/20 relative overflow-hidden group">
              <MessageSquareHeart className="text-accent mb-4" size={32} />
              <h4 className="text-lg font-medium mb-2">Student Voice</h4>
              <button onClick={() => setIsReviewOpen(true)} className="w-full py-4 bg-accent text-black rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4">Write Review</button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="p-8 md:p-12 rounded-[3rem] bg-[#111] border border-white/5 min-h-full">
              <h3 className="text-2xl font-medium flex items-center gap-4 mb-12"><BookOpen size={24} className="text-accent" /> Active Pipeline</h3>
              <div className="space-y-4">
                {courses.map((course) => (
                  <motion.div 
                    key={course.id} 
                    whileHover={{ x: 10 }}
                    onClick={() => navigate(`/classroom/course/${course.id}`)}
                    className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-accent/30 cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xl font-medium">{course.name}</h4>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1 font-semibold">Managed by PrishInfotech</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-light text-accent">{course.progress}%</p>
                        <ChevronRight className="ml-auto mt-2 text-white/20" size={20}/>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- EDIT MODAL (WITH HIDDEN SCROLLBAR) --- */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditOpen(false)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            
            {/* The Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              /* Logic to hide scrollbar while allowing scroll */
              className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-4xl rounded-[2.5rem] p-8 md:p-12 
                         overflow-y-auto max-h-[90vh] shadow-2xl 
                         [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:display-none"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent"><User size={20} /></div>
                  <h2 className="text-2xl font-medium tracking-tight">Personal Information</h2>
                </div>
                <button onClick={() => setIsEditOpen(false)} className="text-white/20 hover:text-white transition-colors"><X size={24} /></button>
              </div>

              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput label="First Name" placeholder="Rina" icon={<User size={14}/>}/>
                  <FormInput label="Last Name" placeholder="Shewale" icon={<User size={14}/>}/>
                  <FormInput label="Email" placeholder="user@gmail.com" icon={<Mail size={14}/>}/>
                  <FormInput label="Contact" placeholder="90497xxxxx" icon={<Phone size={14}/>}/>
                </div>

                <div className="space-y-8">
                  <FormInput label="Date of Birth" type="date" icon={<Calendar size={14}/>}/>
                  <div className="space-y-3">
                    <label className="text-[11px] uppercase tracking-widest text-white/30 flex items-center gap-2"><Pencil size={14}/> Bio</label>
                    <textarea placeholder="Tell us a little about yourself..." className="w-full bg-[#111] border border-white/5 rounded-2xl p-6 h-32 outline-none focus:border-accent/40 text-sm" />
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-[#e67e22]/20 rounded-xl flex items-center justify-center text-[#e67e22]"><MapPin size={20} /></div>
                    <h2 className="text-2xl font-medium tracking-tight">Location & Professional</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormInput label="City" placeholder="City" icon={<MapPin size={14}/>}/>
                    <FormInput label="State" placeholder="State" icon={<MapPin size={14}/>}/>
                    <FormInput label="Pincode" placeholder="Pincode" icon={<MapPin size={14}/>}/>
                    <FormInput label="Country" placeholder="India" icon={<Briefcase size={14}/>}/>
                  </div>
                </div>

                <button className="w-full py-5 bg-accent text-black rounded-2xl text-xs font-black uppercase tracking-widest mt-6">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} courseId={courses[0]?.id} />
    </div>
  );
};

const FormInput = ({ label, placeholder, type = "text", icon }) => (
  <div className="space-y-3">
    <label className="text-[11px] uppercase tracking-widest text-white/30 flex items-center gap-2 ml-1">{icon} {label}</label>
    <input type={type} placeholder={placeholder} className="w-full bg-[#111] border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent/40 text-sm placeholder:text-white/10" />
  </div>
);

export default ProfilePage;