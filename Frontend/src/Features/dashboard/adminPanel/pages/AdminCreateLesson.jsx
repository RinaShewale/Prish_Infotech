import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  Plus, Trash2, FileText, FileUp, 
  X, Save, ArrowLeft, Link, CheckCircle2,
  Loader2, ChevronDown, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// Redux & Services (Assumed paths)
import { createLessonAPI } from "../../Courses/Classroom/service/lesson.api";
import { useCourse } from "../../Courses/hooks/useCourse";
import { uploadLessonFile } from "../services/media.api";
import { FluidBackground } from "../../Home/components/FluidBackground";

/**
 * CUSTOM THEMED SELECT COMPONENT
 * Replaces the ugly browser-default dropdown
 */
const ThemedSelect = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || value;

  return (
    <div className="space-y-2 lg:space-y-3 relative" ref={containerRef}>
      <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white/[0.03] border ${
          isOpen ? 'border-accent/50 shadow-[0_0_20px_rgba(var(--accent-rgb),0.15)]' : 'border-white/10'
        } rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-white transition-all duration-300 outline-none`}
      >
        <span className="font-bold tracking-wide">{selectedLabel}</span>
        <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-500 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute z-[200] w-full bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-1.5"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] lg:text-xs transition-all group ${
                    value === option.value 
                      ? 'bg-accent/10 text-accent font-black uppercase tracking-widest' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  {option.label}
                  {value === option.value && <Check size={14} className="text-accent" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminCreateLesson = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { handleGetSingleCourse } = useCourse();
  const { singleCourse } = useSelector((state) => state.course);

  const [loading, setLoading] = useState(false);
  const [uploadState, setUploadState] = useState({});

  // Options Definitions
  const levelOptions = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" }
  ];

  const typeOptions = [
    { label: "Live Session", value: "Live" },
    { label: "Recorded Course", value: "Recorded" },
    { label: "Hybrid Workshop", value: "Hybrid" }
  ];

  const emptyLesson = useMemo(() => ({
    title: "",
    videoUrl: "",
    level: "Beginner",
    courseType: "Live",
    resources: [], 
    content: "Lesson Material",
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

  const addLessonRow = () => {
    setLessons([...lessons, { ...emptyLesson }]);
    toast.success("New module container added");
  };

  const removeLessonRow = (index) => {
    if (lessons.length === 1) return;
    setLessons(lessons.filter((_, i) => i !== index));
    toast.error("Module discarded");
  };

  const handleAddFileResource = async (lessonIndex, file) => {
    if (!file) return;
    if (file.type !== "application/pdf") return toast.error("Only PDF files allowed");
    
    const fileId = Math.random().toString(36).substring(7);
    setUploadState(prev => ({ ...prev, [fileId]: { name: file.name, progress: 0, lessonIndex } }));

    try {
      const { data } = await uploadLessonFile(file, (event) => {
        const progress = Math.round((event.loaded * 100) / (event.total || 1));
        setUploadState(prev => ({ ...prev, [fileId]: { ...prev[fileId], progress } }));
      });

      const newLessons = [...lessons];
      newLessons[lessonIndex].resources.push({
        title: file.name,
        url: data.url,
        type: "pdf"
      });
      setLessons(newLessons);
      toast.success("Document uploaded successfully");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadState(prev => {
        const newState = { ...prev };
        delete newState[fileId];
        return newState;
      });
    }
  };

  const removeResource = (lessonIndex, resIndex) => {
    const newLessons = [...lessons];
    newLessons[lessonIndex].resources = newLessons[lessonIndex].resources.filter((_, i) => i !== resIndex);
    setLessons(newLessons);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!singleCourse?._id) return toast.error("Course context missing.");
    
    const isValid = lessons.every(l => l.title && l.videoUrl);
    if(!isValid) return toast.error("Complete all titles and video links first");

    setLoading(true);
    try {
      const requests = lessons.map((lesson) => {
        const payload = { ...lesson, course: singleCourse._id };
        return createLessonAPI(payload);
      });

      await Promise.all(requests);
      toast.success(`${lessons.length} Modules Published!`);
      navigate(`/admin/courses/${slug}`);
    } catch {
      toast.error("Error creating curriculum");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-zinc-100 font-sans flex flex-col relative overflow-x-hidden">
      <FluidBackground />
      
      {/* HEADER */}
      <nav className="sticky top-0 h-16 lg:h-24 flex-shrink-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-12 z-[100]">
        <div className="flex items-center gap-3 lg:gap-5">
          <button onClick={() => navigate(-1)} className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl lg:rounded-2xl transition-all border border-white/5 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex flex-col max-w-[150px] sm:max-w-[300px] lg:max-w-none">
            <span className="text-[7px] lg:text-[9px] font-black text-accent uppercase tracking-[0.3em]">Curriculum Builder</span>
            <h1 className="text-xs lg:text-base font-bold text-white tracking-tight truncate">
                {singleCourse?.title || "New Curriculum"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <button type="button" onClick={addLessonRow} className="flex items-center justify-center gap-2 px-3 py-2 lg:px-6 lg:py-3 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.15em] hover:bg-white/10 transition-all">
            <Plus size={14} className="text-accent" /> <span className="hidden sm:inline">Add Module</span>
          </button>
          <button form="curriculum-form" type="submit" disabled={loading} className="flex items-center gap-2 lg:gap-3 px-4 py-2 lg:px-8 lg:py-3.5 rounded-xl lg:rounded-2xl bg-accent text-white text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)] active:scale-95 transition-all disabled:opacity-50">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> <span className="hidden sm:inline">Publish Course</span><span className="sm:hidden">Publish</span></>}
          </button>
        </div>
      </nav>

      <main className="flex-1 relative z-10">
        <div className="max-w-4xl mx-auto py-8 lg:py-16 px-4 lg:px-6 pb-40">
          <form id="curriculum-form" onSubmit={handleSubmit} className="space-y-8 lg:space-y-12">
            <AnimatePresence initial={false}>
              {lessons.map((lesson, index) => (
                <motion.div key={index} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                  
                  <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-white/5 rounded-3xl lg:rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-accent/30 shadow-2xl">
                    
                    {/* Module Header */}
                    <div className="px-5 lg:px-8 pt-6 lg:pt-8 flex items-center justify-between">
                        <div className="flex items-center gap-3 lg:gap-5">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-xs lg:text-sm font-black text-accent">{index + 1}</div>
                            <h3 className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] text-white">Module Config</h3>
                        </div>
                        {lessons.length > 1 && (
                          <button type="button" onClick={() => removeLessonRow(index)} className="p-2 lg:p-3 bg-white/5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl lg:rounded-2xl transition-all"><Trash2 size={16} /></button>
                        )}
                    </div>

                    <div className="p-5 lg:p-10 space-y-8 lg:space-y-10">
                      
                      {/* LESSON SETTINGS */}
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/80 flex items-center gap-3">
                          <span className="w-8 h-[1px] bg-accent/30"></span> Lesson Settings
                        </h4>
                        
                        <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                          {/* THEMED CUSTOM SELECTS */}
                          <ThemedSelect 
                            label="Difficulty Level"
                            value={lesson.level}
                            options={levelOptions}
                            onChange={(val) => handleLessonChange(index, "level", val)}
                          />

                          <ThemedSelect 
                            label="Course Type"
                            value={lesson.courseType}
                            options={typeOptions}
                            onChange={(val) => handleLessonChange(index, "courseType", val)}
                          />
                        </div>
                      </div>

                      {/* Content Inputs */}
                      <div className="pt-6 border-t border-white/5 grid md:grid-cols-2 gap-4 lg:gap-6">
                        <div className="space-y-2 lg:space-y-3">
                          <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Lesson Title</label>
                          <input required value={lesson.title} onChange={(e) => handleLessonChange(index, "title", e.target.value)} placeholder="e.g. Introduction to React" className="w-full bg-white/[0.03] border border-white/10 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-white outline-none focus:border-accent/50 transition-all" />
                        </div>
                        <div className="space-y-2 lg:space-y-3">
                          <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Video Link (Vimeo/Youtube)</label>
                          <input required value={lesson.videoUrl} onChange={(e) => handleLessonChange(index, "videoUrl", e.target.value)} placeholder="https://..." className="w-full bg-white/[0.03] border border-white/10 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-white outline-none focus:border-accent/50 transition-all" />
                        </div>
                      </div>

                      {/* PDF UPLOAD SECTION */}
                      <div className="space-y-4 lg:space-y-6">
                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Study Materials</label>
                            <p className="text-[8px] lg:text-[9px] text-zinc-600 ml-1 uppercase tracking-tighter">PDF guides or workbooks</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                            <AnimatePresence>
                                {lesson.resources.filter(r => r.type === "pdf").map((file, fIdx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }} 
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        key={fIdx} 
                                        className="relative group flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-xl lg:rounded-2xl hover:border-accent/40 transition-all"
                                    >
                                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform flex-shrink-0">
                                            <FileText size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] lg:text-[11px] font-bold text-white truncate pr-6">{file.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[7px] lg:text-[8px] px-1.5 py-0.5 rounded-md bg-accent/20 text-accent font-black uppercase tracking-widest">PDF</span>
                                                <CheckCircle2 size={10} className="text-emerald-500" />
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => removeResource(index, lesson.resources.indexOf(file))}
                                            className="absolute top-2 lg:top-3 right-2 lg:right-3 p-1.5 bg-black/40 text-zinc-500 hover:text-red-500 rounded-lg lg:opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <X size={12} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {Object.entries(uploadState)
                              .filter(([, state]) => state.lessonIndex === index)
                              .map(([id, state]) => (
                                <div key={id} className="relative flex items-center gap-4 p-3 lg:p-4 bg-white/[0.01] border border-dashed border-accent/30 rounded-xl lg:rounded-2xl overflow-hidden">
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <Loader2 size={18} className="text-accent animate-spin" />
                                    </div>
                                    <div className="flex-1 min-w-0 z-10">
                                        <p className="text-[10px] lg:text-[11px] font-bold text-zinc-400 truncate">{state.name}</p>
                                        <p className="text-[8px] lg:text-[9px] font-black text-accent uppercase tracking-widest mt-1">Uploading {state.progress}%</p>
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-1 bg-accent/20 transition-all duration-300" style={{ width: `${state.progress}%` }} />
                                </div>
                            ))}

                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="relative group/upload h-[70px] lg:h-[80px] rounded-xl lg:rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.01] hover:border-accent/40 hover:bg-accent/5 transition-all flex items-center justify-center gap-3 lg:gap-4 cursor-pointer overflow-hidden">
                                <div className="p-2 rounded-full bg-white/5 group-hover/upload:bg-accent/20 transition-all">
                                    <FileUp size={18} className="text-zinc-600 group-hover/upload:text-accent" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover/upload:text-accent">Add Document</span>
                                    <span className="text-[7px] lg:text-[8px] font-medium text-zinc-600 uppercase">PDF Max 10MB</span>
                                </div>
                                <input type="file" accept=".pdf" onChange={(e) => handleAddFileResource(index, e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </motion.div>
                        </div>
                      </div>

                      {/* EXTERNAL LINKS SECTION */}
                      <div className="pt-6 lg:pt-8 border-t border-white/5 space-y-4 lg:space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                            <Link size={14} className="text-accent" /> Related Assets
                          </h4>
                          <button type="button" onClick={() => {
                                const newLessons = [...lessons];
                                newLessons[index].resources.push({ title: "", type: "link", url: "" });
                                setLessons(newLessons);
                            }} className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl bg-white/5 border border-white/10 text-zinc-400 text-[8px] lg:text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                            + Link
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                          {lesson.resources.filter(r => r.type === "link").map((res, rIdx) => (
                            <div key={rIdx} className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-black border border-white/5 flex items-center gap-3 lg:gap-4 group/asset hover:border-white/10 transition-all">
                              <div className="flex-1 space-y-2">
                                <input value={res.title} onChange={(e) => {
                                        const actualIndex = lesson.resources.indexOf(res);
                                        const newLessons = [...lessons];
                                        newLessons[index].resources[actualIndex].title = e.target.value;
                                        setLessons(newLessons);
                                    }} placeholder="Source Title" className="bg-transparent text-[10px] lg:text-[11px] font-bold text-white outline-none w-full placeholder:text-zinc-800" />
                                <input value={res.url} onChange={(e) => {
                                        const actualIndex = lesson.resources.indexOf(res);
                                        const newLessons = [...lessons];
                                        newLessons[index].resources[actualIndex].url = e.target.value;
                                        setLessons(newLessons);
                                    }} placeholder="https://..." className="w-full bg-white/[0.02] border border-white/5 rounded-md px-2 lg:px-3 py-1.5 lg:py-2 text-[8px] lg:text-[9px] text-zinc-500 outline-none focus:border-accent/30 transition-all font-mono" />
                              </div>
                              <button type="button" onClick={() => removeResource(index, lesson.resources.indexOf(res))} className="p-1.5 text-zinc-800 hover:text-red-500 transition-colors"><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.99 }} type="button" onClick={addLessonRow} className="w-full py-8 lg:py-12 border-2 border-dashed border-white/5 rounded-[2rem] lg:rounded-[3rem] bg-white/[0.01] flex flex-col items-center justify-center gap-3 lg:gap-4 text-zinc-600 hover:border-accent/40 hover:text-accent transition-all group">
              <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-[#0a0a0a] border border-white/5 flex items-center justify-center group-hover:border-accent/40 transition-all duration-500">
                <Plus size={20} className="lg:size-6" />
              </div>
              <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em]">Append New Module</span>
            </motion.button>
          </form>
        </div>
      </main>

      <style>{`
        :root { --accent-rgb: 124, 58, 237; }
        input::placeholder { font-weight: 500; letter-spacing: 0.05em; }
        
        /* Custom Scrollbar for Dropdowns */
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.1); 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(124, 58, 237, 0.4); }

        ::-webkit-scrollbar { width: 4px; }
        @media (min-width: 768px) { ::-webkit-scrollbar { width: 6px; } }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminCreateLesson;