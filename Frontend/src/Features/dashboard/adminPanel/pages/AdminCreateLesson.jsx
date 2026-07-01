import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft, Save, FileText, Type, AlignLeft, Globe, Plus, Trash2,
  Link as LinkIcon, UploadCloud, FileCode2, Presentation, ImageIcon,
  Database, BookOpen, ExternalLink, Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { GlassCard } from "../Shared/GlassCard";
import API from "../../../auth/services/api";
import { createLessonAPI } from "../../Courses/Classroom/service/lesson.api";
import { useCourse } from "../../Courses/hooks/useCourse";

const resourceTypeOptions = [
  { value: "pdf", label: "Notes PDF" },
  { value: "zip", label: "ZIP / RAR" },
  { value: "code", label: "Source Code" },
  { value: "github", label: "GitHub Repo" },
  { value: "docs", label: "Documentation" },
  { value: "demo", label: "Live Demo" },
  { value: "drive", label: "Google Drive" },
  { value: "figma", label: "Figma" },
  { value: "slides", label: "Slides" },
  { value: "dataset", label: "Dataset" },
  { value: "image", label: "Image" },
  { value: "assets", label: "Project Assets" },
  { value: "link", label: "External Link" },
];

const AdminCreateLesson = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { handleGetSingleCourse } = useCourse();
  const { singleCourse } = useSelector((state) => state.course);

  const [loading, setLoading] = useState(false);
  const [uploadState, setUploadState] = useState({});

  const emptyLesson = useMemo(
    () => ({
      title: "",
      description: "",
      content: "",
      videoUrl: "",
      resourceUrL: "",
      resources: [],
    }),
    []
  );

  const [lessons, setLessons] = useState([{ ...emptyLesson }]);

  useEffect(() => {
    if (!singleCourse || singleCourse.slug !== slug) {
      handleGetSingleCourse(slug);
    }
  }, [slug, handleGetSingleCourse, singleCourse, emptyLesson]);

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

  const addResource = (lessonIndex) => {
    const newLessons = [...lessons];
    newLessons[lessonIndex].resources = [
      ...(newLessons[lessonIndex].resources || []),
      { title: "", type: "link", url: "", description: "", resourceType: "link" },
    ];
    setLessons(newLessons);
  };

  const removeResource = (lessonIndex, resourceIndex) => {
    const newLessons = [...lessons];
    newLessons[lessonIndex].resources = (newLessons[lessonIndex].resources || []).filter((_, i) => i !== resourceIndex);
    setLessons(newLessons);
  };

  const handleResourceChange = (lessonIndex, resourceIndex, field, value) => {
    const newLessons = [...lessons];
    const resources = [...(newLessons[lessonIndex].resources || [])];
    resources[resourceIndex] = { ...resources[resourceIndex], [field]: value };
    newLessons[lessonIndex].resources = resources;
    setLessons(newLessons);
  };

  const handleResourceUpload = async (lessonIndex, resourceIndex, file) => {
    if (!file) return;
    const key = `${lessonIndex}-${resourceIndex}`;
    setUploadState((prev) => ({ ...prev, [key]: { uploading: true, progress: 0 } }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await API.post("/upload/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          const progress = Math.round((event.loaded * 100) / (event.total || 1));
          setUploadState((prev) => ({ ...prev, [key]: { uploading: true, progress } }));
        },
      });

      handleResourceChange(lessonIndex, resourceIndex, "url", data.url);
      handleResourceChange(lessonIndex, resourceIndex, "type", "file");
      toast.success("Resource uploaded successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setUploadState((prev) => ({ ...prev, [key]: { uploading: false, progress: 100 } }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!singleCourse?._id) return toast.error("Course not loaded.");

    setLoading(true);

    try {
      const requests = lessons.map((lesson) => {
        const payload = {
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          videoUrl: lesson.videoUrl,
          resourceUrL: lesson.resourceUrL,
          resources: lesson.resources || [],
          course: singleCourse._id,
        };
        return createLessonAPI(payload);
      });

      await Promise.all(requests);
      toast.success(`${lessons.length} lessons added successfully!`);
      navigate(`/admin/courses/${slug}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
          <button type="button" onClick={addLessonRow} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition">
            <Plus size={16} /> Add Lesson
          </button>
          <button form="bulk-form" type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-bg font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition shadow-lg shadow-accent/20">
            {loading ? "Processing..." : <><Save size={18} /> Publish All</>}
          </button>
        </div>
      </div>

      <form id="bulk-form" onSubmit={handleSubmit} className="space-y-8">
        {lessons.map((lesson, index) => (
          <div key={index} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
            {lessons.length > 1 && (
              <button type="button" onClick={() => removeLessonRow(index)} className="absolute -right-3 -top-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg">
                <Trash2 size={14} />
              </button>
            )}

            <GlassCard className="p-8 border border-white/10 bg-white/[0.01]">
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                <span className="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center font-black text-xs">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 italic">New Module</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <Field label="Title" icon={<Type size={14} className="text-accent" />}>
                    <input required name="title" value={lesson.title} onChange={(e) => handleLessonChange(index, e)} placeholder="Enter lesson title..." className="input" />
                  </Field>

                  <Field label="Detailed Notes" icon={<FileText size={14} className="text-accent" />}>
                    <textarea name="content" value={lesson.content} onChange={(e) => handleLessonChange(index, e)} rows="5" placeholder="Write lesson notes or paste text..." className="input min-h-[140px] font-mono text-xs" />
                  </Field>
                </div>

                <div className="space-y-6 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                  <Field label="Video URL" icon={<Globe size={14} className="text-accent" />}>
                    <input type="url" name="videoUrl" value={lesson.videoUrl} onChange={(e) => handleLessonChange(index, e)} placeholder="YouTube / Vimeo Link" className="input" />
                  </Field>

                  <Field label="Primary PDF / Notes Link" icon={<LinkIcon size={14} className="text-accent" />}>
                    <input type="url" name="resourceUrL" value={lesson.resourceUrL} onChange={(e) => handleLessonChange(index, e)} placeholder="Google Drive / PDF URL" className="input" />
                  </Field>

                  <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-accent font-black">Resources & Notes</p>
                        <p className="text-[11px] text-text-secondary">Add PDFs, ZIP files, slides, GitHub links, and more.</p>
                      </div>
                      <button type="button" onClick={() => addResource(index)} className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-[10px] uppercase tracking-widest text-white hover:bg-white/10">
                        <Plus size={14} /> Add Resource
                      </button>
                    </div>

                    {(lesson.resources || []).length === 0 ? (
                      <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-[11px] text-text-secondary">
                        No resources yet. Add one to make notes and assets available to students.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(lesson.resources || []).map((resource, resourceIndex) => {
                          const uploadKey = `${index}-${resourceIndex}`;
                          const uploadMeta = uploadState[uploadKey] || { uploading: false, progress: 0 };
                          return (
                            <div key={resourceIndex} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-3">
                              <div className="flex items-center justify-between">
                                <p className="text-[10px] uppercase tracking-widest text-text-secondary">Resource {resourceIndex + 1}</p>
                                <button type="button" onClick={() => removeResource(index, resourceIndex)} className="p-1.5 rounded-lg text-text-secondary hover:bg-red-500/20 hover:text-red-400">
                                  <Trash2 size={14} />
                                </button>
                              </div>

                              <div className="grid gap-3 md:grid-cols-2">
                                <input value={resource.title} onChange={(e) => handleResourceChange(index, resourceIndex, "title", e.target.value)} placeholder="Title" className="input" />
                                <select value={resource.resourceType} onChange={(e) => handleResourceChange(index, resourceIndex, "resourceType", e.target.value)} className="input">
                                  {resourceTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                </select>
                              </div>

                              <div className="grid gap-3 md:grid-cols-2">
                                <label className="space-y-2">
                                  <span className="text-[10px] uppercase tracking-widest text-text-secondary">Upload File</span>
                                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-black/20 px-3 py-3 text-[11px] text-text-secondary hover:border-accent hover:text-accent">
                                    <UploadCloud size={14} />
                                    <span>{resource.url ? "Replace file" : "Upload PDF / ZIP / Image"}</span>
                                    <input type="file" className="hidden" onChange={(e) => handleResourceUpload(index, resourceIndex, e.target.files?.[0])} />
                                  </label>
                                  {uploadMeta.uploading && <p className="text-[10px] text-accent">Uploading {uploadMeta.progress}%</p>}
                                </label>
                                <label className="space-y-2">
                                  <span className="text-[10px] uppercase tracking-widest text-text-secondary">Or URL</span>
                                  <input value={resource.url} onChange={(e) => handleResourceChange(index, resourceIndex, "url", e.target.value)} placeholder="https://..." className="input" />
                                </label>
                              </div>

                              <textarea value={resource.description} onChange={(e) => handleResourceChange(index, resourceIndex, "description", e.target.value)} rows={2} placeholder="Optional description" className="input" />
                              {resource.url && (
                                <div className="flex items-center gap-2 text-[11px] text-accent">
                                  <ExternalLink size={12} />
                                  <span>Student preview/download will use this link.</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        ))}
      </form>
    </div>
  );
};

const Field = ({ label, icon, children }) => (
  <label className="space-y-2 block">
    <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2">
      {icon} {label}
    </span>
    {children}
  </label>
);

export default AdminCreateLesson;