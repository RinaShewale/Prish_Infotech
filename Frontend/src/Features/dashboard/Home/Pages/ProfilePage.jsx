import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { 
  User, Mail, BookOpen, Award, Calendar, 
  Settings, ChevronRight, ShieldCheck, 
  Star, MessageSquareHeart, Zap 
} from "lucide-react";
import { ReviewModal } from "../../Home/components/ReviewModal"; 

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userData = {
    name: user?.name || "User name",
    email: user?.email || "user@example.com",
    joinedDate: "January 2024",
    role: "Student",
    courses: [
      { id: "fs-101", name: "Full Stack Web Development", progress: 75 },
      { id: "ux-202", name: "UI/UX Design Masterclass", progress: 40 },
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center gap-8 mb-16 pb-12 border-b border-white/5"
        >
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center text-accent text-5xl font-bold shadow-[0_0_50px_rgba(212,163,149,0.1)] group-hover:border-accent transition-all duration-500">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-[#0a0a0a] rounded-full shadow-lg"></div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-medium mb-3 tracking-tight">{userData.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/40 text-sm">
              <span className="flex items-center gap-2"><Mail size={16} className="text-accent" /> {userData.email}</span>
              <span className="flex items-center gap-2"><Calendar size={16} className="text-accent" /> {userData.joinedDate}</span>
              <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] text-accent uppercase tracking-widest font-bold">{userData.role}</span>
            </div>
          </div>

          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2">
            <Settings size={16} /> Edit Profile
          </button>
        </motion.div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR (Stats & Actions) */}
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            className="lg:col-span-4 space-y-6"
          >
            {/* PROGRESS CARD */}
            <motion.div variants={cardVariants} className="p-8 rounded-[2.5rem] bg-[#111111] border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="text-[11px] font-bold tracking-[0.2em] text-accent uppercase mb-8 flex items-center gap-2">
                <Zap size={14} /> Learning Statistics
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-white/40 text-sm">Courses Enrolled</span>
                  <span className="text-2xl font-light leading-none">{userData.courses.length}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-white/40 text-sm">Certificates</span>
                  <span className="text-2xl font-light leading-none">02</span>
                </div>
              </div>
            </motion.div>

            {/* NEW FEEDBACK HUB CARD (Better Placement) */}
            <motion.div 
              variants={cardVariants} 
              className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#1a1311] to-[#111111] border border-accent/20 relative overflow-hidden group shadow-2xl"
            >
              <div className="relative z-10">
                <MessageSquareHeart size={32} className="text-accent mb-4 opacity-80" />
                <h3 className="text-lg font-medium mb-2">Share Your Journey</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-6">
                  Your feedback helps us evolve. Tell us about your learning experience.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 bg-accent text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_20px_rgba(212,163,149,0.2)]"
                >
                  Write a Review
                </button>
              </div>
              {/* Decorative background element */}
              <div className="absolute -right-4 -bottom-4 text-accent/5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <Star size={120} fill="currentColor" />
              </div>
            </motion.div>

            {/* SECURITY CARD */}
            <motion.div variants={cardVariants} className="p-8 rounded-[2.5rem] bg-[#111111] border border-white/5">
              <h3 className="text-[11px] font-bold tracking-[0.2em] text-accent uppercase mb-4 flex items-center gap-2">
                <ShieldCheck size={14} /> Account Security
              </h3>
              <button className="text-white/60 text-[10px] font-bold uppercase tracking-widest border-b border-white/10 pb-1 hover:text-accent hover:border-accent transition-all">
                Update Security Credentials
              </button>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE (Course Activity) */}
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            className="lg:col-span-8 space-y-6"
          >
            <div className="p-10 rounded-[3rem] bg-[#111111] border border-white/5 h-full">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-medium flex items-center gap-4">
                  <BookOpen size={28} className="text-accent" /> 
                  Active Courses
                </h3>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
                  {userData.courses.length} Total
                </span>
              </div>

              <div className="grid gap-6">
                {userData.courses.map((course) => (
                  <motion.div 
                    key={course.id}
                    variants={cardVariants}
                    whileHover={{ x: 10 }}
                    className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-accent/30 hover:bg-white/[0.04] transition-all duration-500"
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                      <div className="flex-1">
                        <h4 className="text-xl font-medium mb-1 group-hover:text-accent transition-colors">
                          {course.name}
                        </h4>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest font-semibold">
                          Managed by PrishInfotech
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-1">Progress</p>
                          <p className="text-xl font-light text-accent">{course.progress}%</p>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Minimalist Progress Line */}
                    <div className="mt-8 w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-accent shadow-[0_0_15px_rgba(212,163,149,0.5)]"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* MODAL */}
      <ReviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        // Pass a default ID or handle selection if needed
        courseId={userData.courses[0].id} 
      />
    </div>
  );
};

export default ProfilePage;