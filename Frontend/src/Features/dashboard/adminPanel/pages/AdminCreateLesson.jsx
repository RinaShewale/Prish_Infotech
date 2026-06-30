import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
    ArrowLeft, Save, PlayCircle, FileText, Type, AlignLeft, 
    Globe, Plus, Trash2, Link as LinkIcon 
} from "lucide-react";
import { GlassCard } from "../Shared/GlassCard";

// IMPORT YOUR API
import { createLessonAPI } from "../../Courses/Classroom/service/lesson.api"; 
import { useCourse } from "../../Courses/hooks/useCourse";

const AdminCreateLesson = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { handleGetSingleCourse } = useCourse();
    const { singleCourse } = useSelector(state => state.course);
    
    const [loading, setLoading] = useState(false);

    // 1. Initial structure for a single lesson
    const emptyLesson = {
        title: "",
        description: "",
        content: "", 
        videoUrl: "", 
        resourceUrL: "", // Back to URL string to avoid 500 error
    };

    const [lessons, setLessons] = useState([{ ...emptyLesson }]);

    useEffect(() => {
        if (!singleCourse || singleCourse.slug !== slug) {
            handleGetSingleCourse(slug);
        }
    }, [slug, handleGetSingleCourse, singleCourse]);

    // 2. Handle input changes
    const handleLessonChange = (index, e) => {
        const { name, value } = e.target;
        const newLessons = [...lessons];
        newLessons[index][name] = value;
        setLessons(newLessons);
    };

    const addLessonRow = () => {
        setLessons([...lessons, { ...emptyLesson }]);
    };

    const removeLessonRow = (index) => {
        if (lessons.length === 1) return;
        setLessons(lessons.filter((_, i) => i !== index));
    };

    // 3. Submit Logic (JSON Based)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!singleCourse?._id) return alert("Course not loaded.");
        
        setLoading(true);

        try {
            // Map through lessons and create separate JSON requests
            const requests = lessons.map(lesson => {
                const payload = {
                    title: lesson.title,
                    description: lesson.description,
                    content: lesson.content,
                    videoUrl: lesson.videoUrl,
                    resourceUrL: lesson.resourceUrL,
                    course: singleCourse._id // Matching your backend field 'course'
                };
                return createLessonAPI(payload);
            });

            // Send all requests
            await Promise.all(requests);

            alert(`${lessons.length} lessons added successfully!`);
            navigate(`/admin/courses/${slug}`);
        } catch (error) {
            console.error("Bulk Creation Error:", error);
            alert(error?.response?.data?.message || "Internal Server Error (500). Please check your data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-text-secondary transition hover:bg-white/10">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold italic">Bulk Add Modules</h1>
                        <p className="text-text-secondary text-sm font-medium uppercase tracking-widest">
                            Course: <span className="text-accent">{singleCourse?.title}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        type="button" 
                        onClick={addLessonRow} 
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition"
                    >
                        <Plus size={16}/> Add Lesson
                    </button>
                    <button 
                        form="bulk-form" 
                        type="submit" 
                        disabled={loading} 
                        className="flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-bg font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition shadow-lg shadow-accent/20"
                    >
                        {loading ? "Processing..." : <><Save size={18}/> Publish All</>}
                    </button>
                </div>
            </div>

            {/* Forms List */}
            <form id="bulk-form" onSubmit={handleSubmit} className="space-y-8">
                {lessons.map((lesson, index) => (
                    <div key={index} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {lessons.length > 1 && (
                            <button 
                                type="button" 
                                onClick={() => removeLessonRow(index)} 
                                className="absolute -right-3 -top-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg"
                            >
                                <Trash2 size={14}/>
                            </button>
                        )}

                        <GlassCard className="p-8 border border-white/10 bg-white/[0.01]">
                            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                                <span className="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center font-black text-xs">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 italic">New Module</h2>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-10">
                                {/* Left Side: Text Data */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2">
                                            <Type size={14} className="text-accent"/> Title
                                        </label>
                                        <input 
                                            required 
                                            name="title" 
                                            value={lesson.title} 
                                            onChange={(e) => handleLessonChange(index, e)} 
                                            placeholder="Enter lesson title..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none transition" 
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2">
                                            <FileText size={14} className="text-accent"/> Detailed Notes
                                        </label>
                                        <textarea 
                                            name="content" 
                                            value={lesson.content} 
                                            onChange={(e) => handleLessonChange(index, e)} 
                                            rows="5" 
                                            placeholder="Write lesson notes or paste text..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none font-mono text-xs" 
                                        />
                                    </div>
                                </div>

                                {/* Right Side: Media Links */}
                                <div className="space-y-6 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2">
                                            <Globe size={14} className="text-accent"/> Video URL
                                        </label>
                                        <input 
                                            type="url" 
                                            name="videoUrl" 
                                            value={lesson.videoUrl} 
                                            onChange={(e) => handleLessonChange(index, e)} 
                                            placeholder="YouTube / Vimeo Link"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none" 
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2">
                                            <LinkIcon size={14} className="text-accent"/> PDF / Note Link
                                        </label>
                                        <input 
                                            type="url" 
                                            name="resourceUrL" 
                                            value={lesson.resourceUrL} 
                                            onChange={(e) => handleLessonChange(index, e)} 
                                            placeholder="Google Drive / PDF URL"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none" 
                                        />
                                    </div>
                                    <p className="text-[10px] italic text-text-secondary/50 pt-2">
                                        Note: To allow students to open a PDF, please upload it to Google Drive and paste the public link here.
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                ))}
            </form>
        </div>
    );
};

export default AdminCreateLesson;