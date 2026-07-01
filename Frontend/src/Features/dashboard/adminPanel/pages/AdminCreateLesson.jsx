import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft, Save, FileText, Type, Plus, Trash2,
  Link as LinkIcon, UploadCloud, FileCode2, Terminal,
  Box, Video, X, FileUp, CheckCircle2, FileSearch
} from "lucide-react";
import toast from "react-hot-toast";
import { GlassCard } from "../Shared/GlassCard";
import { createLessonAPI } from "../../Courses/Classroom/service/lesson.api";
import { useCourse } from "../../Courses/hooks/useCourse";
import { uploadLessonFile } from "../services/media.api"; // Ensure this is imported

const resourceTypeOptions = [
  { value: "pdf", label: "Notes PDF", icon: <FileText size={14} /> },
  { value: "zip", label: "ZIP Archive", icon: <Box size={14} /> },
  { value: "code", label: "Source Code", icon: <FileCode2 size={14} /> },
  { value: "github", label: "GitHub Repo", icon: <Terminal size={14} /> },
  { value: "link", label: "External Link", icon: <LinkIcon size={14} /> },
];

const AdminCreateLesson = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { handleGetSingleCourse } = useCourse();
  const { singleCourse } = useSelector((state) => state.course);

  const [loading, setLoading] = useState(false);
  const [uploadState, setUploadState] = useState({});

  const emptyLesson = useMemo(() => ({
    title: "",
    videoUrl: "",
    resourceUrL: "", // Primary PDF Note
    resources: [],
    content: "Lesson Material", // Required by some backends, hidden from UI
  }), []);

  const [lessons, setLessons] = useState([{ ...emptyLesson }]);

  useEffect(() => {
    if (!singleCourse || singleCourse.slug !== slug) {
      handleGetSingleCourse(slug);
    }
  }, [slug, handleGetSingleCourse, singleCourse]);

  const handleLessonChange = (index, name, value) => {
    const newLessons = [...lessons];
    newLessons[index][name] = value;
    setLessons(newLessons);
  };

  const addLessonRow = () => setLessons([...lessons, { ...emptyLesson }]);
  const removeLessonRow = (index) => {
    if (lessons.length === 1) return;
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleResourceUpload = async (lessonIndex, field, file, resourceIndex = null) => {
    if (!file) return;
    const key = resourceIndex !== null ? `${lessonIndex}-res-${resourceIndex}` : `${lessonIndex}-primary`;
    setUploadState(prev => ({ ...prev, [key]: { uploading: true, progress: 0 } }));

    try {
      const { data } = await uploadLessonFile(file, (event) => {
        const progress = Math.round((event.loaded * 100) / (event.total || 1));
        setUploadState(prev => ({ ...prev, [key]: { uploading: true, progress } }));
      });

      if (resourceIndex !== null) {
        const newLessons = [...lessons];
        newLessons[lessonIndex].resources[resourceIndex].url = data.url;
        setLessons(newLessons);
      } else {
        handleLessonChange(lessonIndex, field, data.url);
      }
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploadState(prev => ({ ...prev, [key]: { uploading: false, progress: 100 } }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!singleCourse?._id) return toast.error("Course context missing.");
    setLoading(true);

    try {
      const requests = lessons.map((lesson) => {
        const normalizedResources = Array.isArray(lesson.resources)
          ? lesson.resources
              .filter((item) => item?.url?.trim())
              .map((item) => {
                const url = item.url.trim();
                const lowerUrl = url.toLowerCase();
                const isPdfLink = lowerUrl.endsWith(".pdf") || lowerUrl.includes("/pdf?") || lowerUrl.includes("/pdf#");
                const normalizedType = item.type || item.resourceType || (isPdfLink ? "pdf" : "link");

                return {
                  title: item.title?.trim() || "Resource",
                  type: normalizedType,
                  url,
                  description: item.description || "",
                  resourceType: item.resourceType || item.type || normalizedType,
                };
              })
          : [];

        const notesPdf = (lesson.resourceUrL || "").trim();
        const pdfResourceFromAssets = normalizedResources.find((item) => {
          const normalizedType = (item.resourceType || item.type || "").toLowerCase();
          return normalizedType === "pdf" || normalizedType === "notes";
        });

        const payload = {
          ...lesson,
          course: singleCourse._id,
          title: lesson.title?.trim(),
          videoUrl: lesson.videoUrl?.trim(),
          resourceUrL: notesPdf || pdfResourceFromAssets?.url || "",
          resources: normalizedResources,
        };

        return createLessonAPI(payload);
      });

      await Promise.all(requests);
      toast.success(`${lessons.length} Modules Published!`);
      navigate(`/admin/courses/${slug}`);
    } catch (error) {
      toast.error("Error creating curriculum");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24 px-4 pt-6">
      {/* STICKY HEADER */}
      <div className="sticky top-4 z-[100] bg-zinc-950/80 backdrop-blur-xl border border-white/5 p-4 rounded-2xl shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><ArrowLeft size={18} /></button>
          <div>
            <h1 className="text-sm font-bold">Curriculum Builder</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{singleCourse?.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={addLessonRow} className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[11px] font-bold uppercase hover:bg-white/10 transition">
            <Plus size={14} /> Add Module
          </button>
          <button form="curriculum-form" type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-indigo-600 text-white text-[11px] font-bold uppercase hover:bg-indigo-500 disabled:opacity-50 transition shadow-lg shadow-indigo-500/20">
            {loading ? "Saving..." : <Save size={14} />} {loading ? "" : "Publish Course"}
          </button>
        </div>
      </div>

      <form id="curriculum-form" onSubmit={handleSubmit} className="space-y-10">
        {lessons.map((lesson, index) => (
          <div key={index} className="relative group">
            <GlassCard className="relative border-white/5 bg-zinc-900/40 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
              
              {lessons.length > 1 && (
                <button type="button" onClick={() => removeLessonRow(index)} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              )}

              <div className="p-6 md:p-8 space-y-8">
                {/* CORE INPUTS */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                      <Type size={12} className="text-indigo-400" /> Module Title
                    </label>
                    <input required value={lesson.title} onChange={(e) => handleLessonChange(index, "title", e.target.value)} placeholder="e.g. Introduction to logic" className="admin-input-new" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                      <Video size={12} className="text-indigo-400" /> Video URL
                    </label>
                    <input required value={lesson.videoUrl} onChange={(e) => handleLessonChange(index, "videoUrl", e.target.value)} placeholder="YouTube/Vimeo link" className="admin-input-new" />
                  </div>
                </div>

                {/* PRIMARY NOTES UPLOAD - ENHANCED UI */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <FileText size={12} className="text-indigo-400" /> Primary Lesson Notes (PDF)
                  </label>
                  
                  <div className={`relative group/drop rounded-2xl border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center text-center ${lesson.resourceUrL ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-indigo-500/50 bg-white/[0.02]'}`}>
                    {uploadState[`${index}-primary`]?.uploading ? (
                      <div className="py-4">
                        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-xs font-bold text-indigo-400">{uploadState[`${index}-primary`].progress}% Uploading...</p>
                      </div>
                    ) : lesson.resourceUrL ? (
                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Notes Uploaded Successfully</p>
                          <p className="text-[10px] text-zinc-500 mt-1 truncate max-w-xs mx-auto">{lesson.resourceUrL}</p>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <button type="button" onClick={() => handleLessonChange(index, "resourceUrL", "")} className="text-[10px] font-bold text-red-400 uppercase hover:underline">Delete</button>
                            <a href={lesson.resourceUrL} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-indigo-400 uppercase hover:underline">Preview PDF</a>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover/drop:bg-indigo-500 group-hover/drop:text-white transition-all">
                          <FileUp size={20} />
                        </div>
                        <p className="text-xs font-bold text-white">Click to upload lesson PDF</p>
                        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tighter">or paste a URL in the field below</p>
                        <input type="file" accept=".pdf" onChange={(e) => handleResourceUpload(index, "resourceUrL", e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </>
                    )}
                  </div>

                  {!lesson.resourceUrL && (
                     <div className="relative">
                        <LinkIcon size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input value={lesson.resourceUrL} onChange={(e) => handleLessonChange(index, "resourceUrL", e.target.value)} placeholder="Alternatively, paste external PDF link here..." className="admin-input-new !pl-10 !text-[11px]" />
                     </div>
                  )}
                </div>

                {/* ADDITIONAL ASSETS */}
                <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Secondary Assets</h4>
                        <button type="button" onClick={() => {
                            const newRes = [...lesson.resources, { title: "", type: "link", url: "" }];
                            handleLessonChange(index, "resources", newRes);
                        }} className="p-1.5 rounded-lg bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 text-[10px] font-bold flex items-center gap-1">
                            <Plus size={12} /> ADD ASSET
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {lesson.resources.map((res, rIdx) => (
                            <div key={rIdx} className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <input value={res.title} onChange={(e) => {
                                        const newRes = [...lesson.resources];
                                        newRes[rIdx].title = e.target.value;
                                        handleLessonChange(index, "resources", newRes);
                                    }} placeholder="Asset Name" className="bg-transparent text-[11px] font-bold text-white outline-none w-full" />
                                    <button type="button" onClick={() => {
                                        const newRes = lesson.resources.filter((_, i) => i !== rIdx);
                                        handleLessonChange(index, "resources", newRes);
                                    }} className="text-zinc-600 hover:text-red-500"><X size={14} /></button>
                                </div>
                                <div className="flex gap-2">
                                    <input value={res.url} onChange={(e) => {
                                        const newRes = [...lesson.resources];
                                        newRes[rIdx].url = e.target.value;
                                        handleLessonChange(index, "resources", newRes);
                                    }} placeholder="URL" className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-[10px] outline-none" />
                                    <label className="cursor-pointer p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                                        <UploadCloud size={14} className="text-zinc-400" />
                                        <input type="file" className="hidden" onChange={(e) => handleResourceUpload(index, "resources", e.target.files[0], rIdx)} />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            </GlassCard>
          </div>
        ))}
        
        <button type="button" onClick={addLessonRow} className="w-full py-8 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 text-zinc-500 hover:border-indigo-500/40 hover:text-indigo-400 transition-all">
            <Plus size={24} />
            <span className="text-xs font-bold uppercase tracking-widest">Add New Module</span>
        </button>
      </form>

      <style>{`
        .admin-input-new {
            width: 100%;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 0.75rem;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            color: white;
            outline: none;
            transition: all 0.2s;
        }
        .admin-input-new:focus {
            border-color: #4f46e5;
            background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

export default AdminCreateLesson;