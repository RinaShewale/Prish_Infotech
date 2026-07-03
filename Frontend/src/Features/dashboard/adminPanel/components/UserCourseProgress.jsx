import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCourseProgress } from "../../Courses/Classroom/hook/useCourseProgress";
import { GlassCard } from "../Shared/GlassCard";
import { 
  Loader2, Trophy, BookOpen, Activity, 
  Calendar, CheckCircle2, ChevronRight, Zap 
} from "lucide-react";
import { motion } from "framer-motion";

const UserCourseProgress = () => {
  const { courseId } = useParams();
  const { progress, loading, fetchProgress } = useCourseProgress();

  useEffect(() => {
    if (courseId) fetchProgress(courseId);
  }, [courseId]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Calculating Progress...</p>
      </div>
    );
  }

  const isCompleted = progress.progress === 100;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div variants={item}>
          <p className="text-accent text-[9px] font-black uppercase tracking-[0.4em] mb-2">Learning Analytics</p>
          <h1 className="text-3xl md:text-5xl font-black italic text-white tracking-tighter uppercase leading-none">
            Course Journey
          </h1>
        </motion.div>
        
        <motion.div variants={item} className="flex items-center gap-2">
           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
             isCompleted 
             ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
             : 'bg-accent/10 text-accent border-accent/20 shadow-[0_0_15px_rgba(var(--accent-rgb),0.15)]'
           }`}>
             {isCompleted ? 'Certification Earned' : 'Curriculum in Progress'}
           </span>
        </motion.div>
      </div>

      {/* MAIN PROGRESS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: VISUAL PROGRESS */}
        <motion.div variants={item} className="lg:col-span-5 h-full">
          <GlassCard className="p-8 h-full flex flex-col items-center justify-center text-center relative overflow-hidden group border-white/5">
            {/* Visual background flare */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-[100px] group-hover:bg-accent/30 transition-all duration-700" />
            
            <div className="relative mb-6">
               {/* Circular Progress (SVG) */}
               <svg className="w-40 h-40 transform -rotate-90 md:w-48 md:h-48">
                  <circle
                    cx="50%" cy="50%" r="45%"
                    className="stroke-white/5 fill-none"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="50%" cy="50%" r="45%"
                    className="stroke-accent fill-none"
                    strokeWidth="8"
                    strokeDasharray="100 100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 100 - (progress.progress || 0) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl md:text-5xl font-black italic text-white leading-none">
                    {progress.progress || 0}<span className="text-xl md:text-2xl not-italic text-accent">%</span>
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mt-1">Mastery</span>
               </div>
            </div>

            <div className="space-y-1 relative z-10">
              <h3 className="text-white font-bold text-lg">
                {isCompleted ? "You've crushed it!" : "Keep the momentum!"}
              </h3>
              <p className="text-zinc-500 text-xs px-8 leading-relaxed italic">
                {isCompleted 
                  ? "You have successfully completed all modules in this curriculum." 
                  : `Just ${progress.totalLessons - progress.completedLessons} more modules to reach 100% mastery.`}
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* RIGHT: STATS & DETAILS */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
          
          <motion.div variants={item}>
            <StatCard 
              icon={<BookOpen size={20}/>} 
              label="Completed" 
              value={`${progress.completedLessons || 0} / ${progress.totalLessons || 0}`}
              sub="Module Units"
            />
          </motion.div>

          <motion.div variants={item}>
            <StatCard 
              icon={<Activity size={20}/>} 
              label="Learning Status" 
              value={isCompleted ? "Finished" : "Active"}
              sub="Current State"
              color={isCompleted ? "text-emerald-400" : "text-blue-400"}
            />
          </motion.div>

          {progress.courseCompletedAt && (
            <motion.div variants={item} className="md:col-span-2">
              <GlassCard className="p-6 border-emerald-500/10 flex items-center gap-5 bg-emerald-500/[0.02]">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Trophy size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">Milestone Reached</p>
                  <p className="text-white font-bold text-sm">Graduated on {new Date(progress.courseCompletedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* NEXT STEP CTA */}
          {!isCompleted && (
            <motion.div variants={item} className="md:col-span-2">
               <button className="w-full group p-6 rounded-3xl bg-accent hover:shadow-[0_0_40px_rgba(var(--accent-rgb),0.3)] transition-all duration-500 flex items-center justify-between text-white overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="p-2 rounded-lg bg-white/20">
                      <Zap size={18} fill="currentColor" />
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-70">Up Next</p>
                      <p className="text-sm font-black uppercase italic tracking-tight">Continue Learning</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" />
               </button>
            </motion.div>
          )}
        </div>
      </div>

      <style>{`
        :root { --accent-rgb: 124, 58, 237; }
      `}</style>
    </motion.div>
  );
};

// Reusable Stat Component
const StatCard = ({ icon, label, value, sub, color = "text-white" }) => (
  <GlassCard className="p-6 border-white/5 hover:border-white/10 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2.5 rounded-xl bg-white/5 text-zinc-500">{icon}</div>
      <div className="w-8 h-1 bg-white/5 rounded-full" />
    </div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{label}</p>
      <h4 className={`text-2xl font-black italic tracking-tighter mt-0.5 ${color}`}>{value}</h4>
      <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">{sub}</p>
    </div>
  </GlassCard>
);

export default UserCourseProgress;