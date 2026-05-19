import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  BookOpen, 
  Award, 
  Calendar, 
  Settings, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);

  // Fallback data if user isn't fully populated yet
  const userData = {
    name: user?.name || "User Name",
    email: user?.email || "user@example.com",
    joinedDate: "January 2024",
    role: "Bootcamp Student",
    courses: [
      { id: 1, name: "Full Stack Web Development", progress: 75 },
      { id: 2, name: "UI/UX Design Masterclass", progress: 40 },
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-bg text-white pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER SECTION */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row items-center gap-8 mb-12 pb-12 border-b border-white/5"
        >
          {/* Large Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center text-accent text-5xl font-display font-bold shadow-2xl shadow-accent/20">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-500 border-4 border-bg rounded-full"></div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-display font-medium mb-2">{userData.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-text-secondary text-sm">
              <span className="flex items-center gap-1.5"><Mail size={16} className="text-accent" /> {userData.email}</span>
              <span className="flex items-center gap-1.5"><Calendar size={16} className="text-accent" /> Joined {userData.joinedDate}</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-accent uppercase tracking-widest">{userData.role}</span>
            </div>
          </div>

          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-accent hover:text-bg transition-all duration-300 flex items-center gap-2">
            <Settings size={18} /> Edit Profile
          </button>
        </motion.div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: STATS & INFO */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#111111] border border-white/5">
              <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
                <Award size={20} className="text-accent" /> Learning Progress
              </h3>
              <div className="space-y-4 text-sm text-text-secondary">
                <div className="flex justify-between">
                  <span>Courses Enrolled</span>
                  <span className="text-white font-medium">02</span>
                </div>
                <div className="flex justify-between">
                  <span>Certificates Earned</span>
                  <span className="text-white font-medium">00</span>
                </div>
                <div className="flex justify-between">
                  <span>Bootcamp Days</span>
                  <span className="text-white font-medium">12/90</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#111111] border border-white/5">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-accent" /> Account Security
              </h3>
              <p className="text-sm text-text-secondary mb-4">Your account is secured with standard encryption.</p>
              <button className="text-accent text-sm font-medium hover:underline">Change Password</button>
            </div>
          </motion.div>

          {/* RIGHT SIDE: COURSE ACTIVITY */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-2 space-y-6">
            <div className="p-8 rounded-3xl bg-[#111111] border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-medium flex items-center gap-2">
                  <BookOpen size={22} className="text-accent" /> Active Courses
                </h3>
                <button className="text-sm text-text-secondary hover:text-accent">View All</button>
              </div>

              <div className="space-y-6">
                {userData.courses.map((course) => (
                  <motion.div 
                    key={course.id}
                    variants={itemVariants}
                    className="group p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium text-lg group-hover:text-accent transition-colors">{course.name}</h4>
                        <p className="text-xs text-text-secondary mt-1">Instructor: PrishInfotech Team</p>
                      </div>
                      <ChevronRight size={20} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] uppercase tracking-widest text-text-secondary">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* UPGRADE / CTA SECTION */}
            <div className="p-8 rounded-3xl bg-accent flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-bg text-2xl font-bold mb-2">Join the Elite Bootcamp</h3>
                <p className="text-bg/70 text-sm max-w-xs">Accelerate your career with our 1-on-1 mentorship program.</p>
              </div>
              <button className="relative z-10 px-8 py-3 bg-bg text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                Apply Now
              </button>
              {/* Decorative circle */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-bg/10 rounded-full blur-3xl group-hover:bg-bg/20 transition-all"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;