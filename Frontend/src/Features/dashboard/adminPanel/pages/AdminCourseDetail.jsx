import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourse } from "../../Courses/hooks/useCourse";
import { useLesson } from "../../Courses/Classroom/hook/useLesson";
import { useSelector } from "react-redux";
import {
    ArrowLeft, BookOpen, PlayCircle, PlusCircle, 
    Clock, Pencil, FileText, Trash2, RefreshCw, Video
} from "lucide-react";

import { GlassCard } from "../Shared/GlassCard";
import { deleteLessonAPI } from "../../Courses/Classroom/service/lesson.api";

// Create a local Div-based Skeleton to avoid the <tr> error
const ListSkeleton = () => (
    <div className="space-y-3 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 w-full bg-white/5 rounded-2xl border border-white/5" />
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
    }, [singleCourse?._id]);

    const handleRefresh = () => {
        if (singleCourse?._id) getLessons(singleCourse._id);
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!window.confirm("Are you sure you want to delete this lesson?")) return;
        
        setIsDeleting(lessonId);
        try {
            await deleteLessonAPI(lessonId);
            handleRefresh();
        } catch (error) {
            alert("Failed to delete lesson");
        } finally {
            setIsDeleting(null);
        }
    };

    // Use ListSkeleton instead of TableSkeleton here
    if (courseLoading) return (
        <div className="p-10">
            <div className="h-20 w-1/2 bg-white/5 rounded-xl mb-10 animate-pulse" />
            <ListSkeleton />
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
                    >
                        <ArrowLeft size={18}/>
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-bold italic text-white uppercase tracking-tight">
                                {singleCourse?.title}
                            </h1>
                            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black border border-accent/20 uppercase">
                                {singleCourse?.type}
                            </span>
                        </div>
                        <p className="text-text-secondary mt-1 max-w-2xl line-clamp-1 text-sm">
                            {singleCourse?.description}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleRefresh}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-text-secondary transition border border-white/5"
                        title="Refresh Data"
                    >
                        <RefreshCw size={18} className={lessonLoading ? "animate-spin text-accent" : ""} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition text-sm">
                        <Pencil size={16}/> Edit Course
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <StatItem 
                    icon={<BookOpen size={20}/>} 
                    label="Total Lessons" 
                    value={lessons.length} 
                />
                <StatItem 
                    icon={<Clock size={20}/>} 
                    label="Access Duration" 
                    value={singleCourse?.accessDuration || "Lifetime"} 
                />
                <StatItem 
                    icon={<PlayCircle size={20}/>} 
                    label="Status" 
                    value="Published" 
                    color="text-green-400" 
                />
            </div>

            {/* Curriculum Management */}
            <GlassCard className="overflow-hidden border border-white/10">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                    <div>
                        <h2 className="text-xl font-bold">Curriculum</h2>
                        <p className="text-sm text-text-secondary">Click "Add Lesson" to expand this course modules.</p>
                    </div>
                    <button 
                        onClick={() => navigate(`/admin/courses/${slug}/add-lesson`)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-bg font-bold hover:scale-105 transition-all shadow-lg shadow-accent/20 text-sm"
                    >
                        <PlusCircle size={18}/> Add Lesson
                    </button>
                </div>

                <div className="p-6">
                    {/* CHANGED: Use ListSkeleton here instead of TableSkeleton */}
                    {lessonLoading ? (
                        <ListSkeleton />
                    ) : lessons.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                                <BookOpen className="opacity-20" size={30}/>
                            </div>
                            <h3 className="text-lg font-medium">Empty Curriculum</h3>
                            <p className="text-text-secondary mt-1 text-sm">No lessons have been uploaded to this course yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {lessons.map((lesson, index) => (
                                <div 
                                    key={lesson._id} 
                                    className="group p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/10 transition-all flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-text-secondary group-hover:text-accent group-hover:bg-accent/5 transition-all border border-white/5">
                                            {String(index + 1).padStart(2, '0')}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white group-hover:text-accent transition">
                                                {lesson.title}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                {lesson.videoUrl && (
                                                    <span className="flex items-center gap-1 text-[9px] uppercase font-black text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">
                                                        <Video size={10}/> Video
                                                    </span>
                                                )}
                                                {lesson.resourceUrL && (
                                                    <span className="flex items-center gap-1 text-[9px] uppercase font-black text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20">
                                                        <FileText size={10}/> Notes
                                                    </span>
                                                )}
                                                <span className="text-xs text-text-secondary line-clamp-1 italic">
                                                    {lesson.description}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            className="p-2.5 rounded-xl hover:bg-white/10 text-text-secondary hover:text-white transition"
                                            title="Edit Lesson"
                                        >
                                            <Pencil size={16}/>
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteLesson(lesson._id)}
                                            disabled={isDeleting === lesson._id}
                                            className="p-2.5 rounded-xl hover:bg-red-500/20 text-text-secondary hover:text-red-500 transition"
                                            title="Delete Lesson"
                                        >
                                            {isDeleting === lesson._id ? (
                                                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <Trash2 size={16}/>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
};

// Sub-component for Stats
const StatItem = ({ icon, label, value, color = "text-accent" }) => (
    <GlassCard className="p-5 flex items-start gap-4 hover:bg-white/5 transition border border-white/5">
        <div className={`p-3.5 rounded-2xl bg-white/5 border border-white/5 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">{label}</p>
            <p className="text-xl font-bold mt-1 text-white">{value}</p>
        </div>
    </GlassCard>
);

export default AdminCourseDetail;