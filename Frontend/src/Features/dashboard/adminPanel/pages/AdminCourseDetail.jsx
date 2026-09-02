import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourse } from "../../Courses/hooks/useCourse";
import { useLesson } from "../../Courses/Classroom/hook/useLesson";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, BookOpen, PlusCircle, 
    Clock, Pencil, FileText, Trash2, RefreshCw, Video,
    ExternalLink, Layers, CheckCircle2,
    Loader2
} from "lucide-react";

import { GlassCard } from "../Shared/GlassCard";
import {
    deleteLessonAPI,
    updateLessonAPI,
} from "../../Courses/Classroom/service/lesson.api";

// --- SKELETON LOADER ---
const ListSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 w-full bg-white/[0.03] rounded-3xl border border-white/5" />
        ))}
    </div>
);

const AdminCourseDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(null);

    const { handleGetSingleCourse } = useCourse();
    const { getLessons } = useLesson();

    const { singleCourse, loading: courseLoading } = useSelector(state => state.course);
    const { lessons, loading: lessonLoading } = useSelector(state => state.lesson);

    useEffect(() => {
        handleGetSingleCourse(slug);
    }, [slug, handleGetSingleCourse]);

    useEffect(() => {
        if (singleCourse?._id) {
            getLessons(singleCourse._id);
        }
    }, [singleCourse?._id, getLessons]);

    const handleRefresh = () => {
        if (singleCourse?._id) getLessons(singleCourse._id);
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!window.confirm("Are you sure you want to delete this module?")) return;
        setIsDeleting(lessonId);
        try {
            await deleteLessonAPI(lessonId);
            handleRefresh();
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(null);
        }
    };

    const handlePreviewLesson = (lesson) => {
        const videoUrl = lesson.subModules?.[0]?.videoUrl || lesson.videoUrl;
        if (!videoUrl) return;
        window.open(videoUrl, "_blank", "noopener,noreferrer");
    };

    const handleEditLesson = async (lesson) => {
        const title = window.prompt("Module title", lesson.title || "");
        if (title === null) return;

        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;

        const videoUrl = window.prompt(
            "Video URL",
            lesson.subModules?.[0]?.videoUrl || lesson.videoUrl || ""
        );
        if (videoUrl === null) return;

        try {
            const lessonData = { ...lesson };
            delete lessonData._id;
            delete lessonData.__v;
            delete lessonData.createdAt;
            delete lessonData.updatedAt;
            delete lessonData.course;

            await updateLessonAPI(lesson._id, {
                ...lessonData,
                title: trimmedTitle,
                videoUrl: videoUrl.trim(),
            });
            handleRefresh();
        } catch (error) {
            console.error(error);
            window.alert("Lesson update failed");
        }
    };

    if (courseLoading) return (
        <div className="p-6 lg:p-12 space-y-10">
            <div className="h-12 w-1/3 bg-white/5 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse" />)}
            </div>
            <ListSkeleton />
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-32 px-4 md:px-0"
        >
            {/* --- TOP NAVIGATION & HEADER --- */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4 lg:gap-6">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-3 lg:p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
                    </button>
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl md:text-5xl font-black italic text-white tracking-tighter uppercase">
                                {singleCourse?.title}
                            </h1>
                            <span className="px-3 py-1 rounded-lg bg-accent/10 text-accent text-[9px] font-black border border-accent/20 uppercase tracking-[0.2em]">
                                {singleCourse?.type}
                            </span>
                        </div>
                        <p className="text-zinc-500 max-w-2xl text-xs md:text-sm leading-relaxed font-medium">
                            {singleCourse?.description}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button 
                        onClick={handleRefresh}
                        className="flex-1 lg:flex-none p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-center"
                    >
                        <RefreshCw size={18} className={lessonLoading ? "animate-spin text-accent" : "text-zinc-400"} />
                    </button>
                    <button className="flex-[3] lg:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">
                        <Pencil size={16} className="text-accent"/> Edit Course
                    </button>
                </div>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <StatItem 
                    icon={<Layers size={22}/>} 
                    label="Modules Published" 
                    value={lessons.length} 
                />
                <StatItem 
                    icon={<Clock size={22}/>} 
                    label="Access Validity" 
                    value={singleCourse?.accessDuration || "Lifetime"} 
                />
                <StatItem 
                    icon={<CheckCircle2 size={22}/>} 
                    label="Enrollment Status" 
                    value="Active" 
                    color="text-emerald-500" 
                />
            </div>

            {/* --- CURRICULUM MANAGEMENT --- */}
            <GlassCard className="border-white/5 overflow-hidden shadow-2xl">
                {/* Curriculum Header */}
                <div className="p-6 lg:p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-white/[0.02] to-transparent">
                    <div className="text-center md:text-left">
                        <h2 className="text-xl lg:text-2xl font-black italic tracking-tight uppercase">Course Curriculum</h2>
                        <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-accent mt-1">Management Console</p>
                    </div>
                    <button 
                        onClick={() => navigate(`/admin/courses/${slug}/add-lesson`)}
                        className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[10px] hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] active:scale-95 transition-all"
                    >
                        <PlusCircle size={18}/> New Module
                    </button>
                </div>

                <div className="p-6 lg:p-8">
                    {lessonLoading ? (
                        <ListSkeleton />
                    ) : lessons.length === 0 ? (
                        <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/5">
                                <BookOpen className="text-zinc-700" size={40}/>
                            </div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">Empty Curriculum</h3>
                            <p className="text-zinc-500 mt-2 text-xs uppercase tracking-widest font-bold">Awaiting content deployment...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {lessons.map((lesson, index) => (
                                    <motion.div 
                                        key={lesson._id} 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group p-5 lg:p-6 rounded-[2rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-accent/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                                    >
                                        <div className="flex items-center gap-5 lg:gap-8">
                                            <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center font-black text-xs text-accent group-hover:scale-110 transition-transform border border-accent/10 flex-shrink-0">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-black italic text-sm md:text-lg text-white group-hover:text-accent transition uppercase tracking-tight truncate">
                                                    {lesson.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    {lesson.videoUrl && (
                                                        <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-lg border border-blue-400/20">
                                                            <Video size={12}/> Video Session
                                                        </div>
                                                    )}
                                                    {lesson.resourceUrL && (
                                                        <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-orange-400 bg-orange-400/10 px-2.5 py-1 rounded-lg border border-orange-400/20">
                                                            <FileText size={12}/> Study Guide
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-3 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                                            <button 
                                                onClick={() => handlePreviewLesson(lesson)}
                                                disabled={!lesson.videoUrl && !lesson.subModules?.[0]?.videoUrl}
                                                className="p-3 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                                                title="Preview Lesson"
                                            >
                                                <ExternalLink size={18}/>
                                            </button>
                                            <button 
                                                onClick={() => handleEditLesson(lesson)}
                                                className="p-3 rounded-xl bg-white/5 text-zinc-400 hover:text-accent hover:bg-accent/10 transition-all"
                                                title="Edit Lesson"
                                            >
                                                <Pencil size={18}/>
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteLesson(lesson._id)}
                                                disabled={isDeleting === lesson._id}
                                                className="p-3 rounded-xl bg-white/5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                            >
                                                {isDeleting === lesson._id ? (
                                                    <Loader2 size={18} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={18}/>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </GlassCard>

            <style>{`
                :root { --accent-rgb: 124, 58, 237; }
            `}</style>
        </motion.div>
    );
};

// --- STAT ITEM HELPER ---
const StatItem = ({ icon, label, value, color = "text-accent" }) => (
    <GlassCard className="p-6 flex items-center gap-6 border-white/5 hover:border-white/10 transition-all group">
        <div className={`p-4 rounded-3xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black">{label}</p>
            <p className="text-2xl font-black italic mt-1 text-white uppercase tracking-tighter">{value}</p>
        </div>
    </GlassCard>
);

export default AdminCourseDetail;