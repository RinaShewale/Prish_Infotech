import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChevronLeft, Download, Bookmark,
  CheckCircle, FileText, List, Play,
  Globe, MonitorPlay, X, ExternalLink,
  BookOpen, FolderOpen, FileCode2, 
  Presentation, Layers, Database, Box, Terminal,
  Check
} from 'lucide-react';
import { fetchLessons } from '../../Classroom/redux/lesson.slice';
import { saveLessonProgress, getLessonProgress } from '../../Classroom/redux/lessonProgress.slice';
import { fetchTopUsers } from '../../Classroom/redux/leaderboard.slice';
import { fetchCourseProgress } from '../../Classroom/redux/courseProgress.slice';
import { addBookmark, getBookmarks, removeBookmark } from "../../Classroom/redux/bookmark.slice";
import { FluidBackground } from '../../../Home/components/FluidBackground';

const LecturePage = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  const [activeTab, setActiveTab] = useState('content');
  const [viewMode, setViewMode] = useState('video'); 

  const { lessons = [] } = useSelector((state) => state.lesson);
  const { bookmarks = [] } = useSelector((state) => state.bookmark);

  useEffect(() => {
    dispatch(getBookmarks());
    if (courseId) {
      dispatch(fetchLessons(courseId));
      dispatch(fetchTopUsers({ courseId, limit: 10 }));
    }
  }, [courseId, dispatch]);

  useEffect(() => {
    if (lectureId) {
        dispatch(getLessonProgress(lectureId));
        setViewMode('video'); 
    }
  }, [lectureId, dispatch]);

  const currentModule = lessons.find(m => (m._id || m.id) === lectureId);
  const currentIndex = lessons.indexOf(currentModule);
  const completedLessons = lessons.filter(m => m.completed).length || 0;
  const progressPercent = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;
  const isBookmarked = bookmarks.some((b) => String(b.lesson?._id) === String(lectureId));

  const getResourceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
      case 'notes':
        return <FileText size={16} />;
      case 'github':
      case 'repo':
        return <Terminal size={16} />;
      case 'link':
      case 'website':
      case 'url':
        return <Globe size={16} />;
      case 'zip':
      case 'archive':
        return <Box size={16} />;
      case 'code':
      case 'sourcecode':
        return <FileCode2 size={16} />;
      case 'slides':
      case 'presentation':
        return <Presentation size={16} />;
      case 'figma':
        return <Layers size={16} />;
      case 'drive':
      case 'google-drive':
        return <Database size={16} />;
      default:
        return <Box size={16} />;
    }
  };

  const getPdfUrl = (module) => {
    if (!module) return "";

    if (module.resourceUrL?.trim()) {
      return module.resourceUrL.trim();
    }

    if (!Array.isArray(module.resources)) {
      return "";
    }

    const pdfResource = module.resources.find((resource) => {
      const type = (resource.resourceType || resource.type || "").toLowerCase();
      const url = (resource.url || "").trim().toLowerCase();

      return (
        type === "pdf" ||
        type === "notes" ||
        url.endsWith(".pdf") ||
        url.includes("/pdf?") ||
        url.includes("/pdf#")
      );
    });

    return pdfResource?.url || "";
  };

  const notesPdfUrl = getPdfUrl(currentModule);

  // --- UPDATED RENDERING LOGIC ---
  const renderMainDisplay = () => {
    // 1. PDF VIEW MODE
    if (viewMode === 'pdf' && notesPdfUrl) {
      return (
        <div className="relative w-full h-full bg-white">
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            <a
              href={notesPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
            >
              <Download size={14} />
              Download PDF
            </a>

            <button
              onClick={() => setViewMode("video")}
              className="p-2 bg-accent text-white rounded-full shadow-xl hover:scale-110 transition-transform"
            >
              <X size={20} />
            </button>
          </div>

          <iframe
            src={notesPdfUrl}
            title="Lesson PDF"
            className="w-full h-full border-0"
          >
            <div className="w-full h-full flex items-center justify-center p-6 text-center">
              <p className="text-sm text-zinc-600">
                Unable to preview the PDF inline.
                <a href={notesPdfUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-accent underline">
                  Open in a new tab
                </a>
              </p>
            </div>
          </iframe>
        </div>
      );
    }

    // 2. VIDEO VIEW MODE
    const url = currentModule?.videoUrl;
    if (!url) return <div className="text-text-secondary text-[10px] uppercase tracking-[0.3em] font-black italic">No Video Content</div>;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full border-0"
          allowFullScreen
          title="Lesson Video"
        />
      );
    }

    return (
      <video
        ref={videoRef}
        key={url}
        src={url}
        className="w-full h-full max-h-full object-contain"
        controls
        autoPlay
      />
    );
  };

  const handleCompleteLesson = async () => {
    try {
      await dispatch(saveLessonProgress({
        lessonId: lectureId,
        watchedSeconds: 100,
        totalDuration: 100,
      })).unwrap();
      dispatch(fetchLessons(courseId));
      dispatch(fetchCourseProgress(courseId));
    } catch (error) { console.error(error); }
  };

  if (!currentModule) return <div className="h-screen bg-bg flex items-center justify-center">Loading...</div>;

  return (
    <div className="h-screen w-full bg-bg text-text font-sans flex flex-col overflow-hidden relative">
      <FluidBackground />
      
      {/* HEADER */}
      <nav className="h-16 lg:h-20 flex-shrink-0 glass flex items-center justify-between px-4 lg:px-8 z-50 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-all text-text-secondary">
            <ChevronLeft size={22} />
          </button>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-accent uppercase tracking-[0.2em]">Module {currentIndex + 1}</span>
            <h1 className="text-sm font-bold truncate max-w-[200px]">{currentModule.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
            {notesPdfUrl && (
                 <button 
                    onClick={() => setViewMode(viewMode === 'video' ? 'pdf' : 'video')} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-[10px] font-black uppercase tracking-widest ${viewMode === 'pdf' ? 'bg-accent text-white' : 'glass text-accent'}`}
                >
                    {viewMode === 'video' ? <><FileText size={14} /> View Notes</> : <><MonitorPlay size={14} /> View Video</>}
                </button>
            )}
        </div>
      </nav>

      {/* WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        <main className="w-full lg:flex-1 bg-black flex items-center justify-center sticky top-0 z-30 lg:relative aspect-video lg:aspect-auto border-b border-border lg:border-none overflow-hidden">
          {renderMainDisplay()}
        </main>

        <aside className="w-full lg:w-[400px] flex flex-col bg-bg2 border-l border-border relative">
          <div className="p-4 bg-bg2/95 backdrop-blur-md border-b border-border">
            <div className="flex bg-bg rounded-xl p-1 border border-border">
              <TabBtn active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<List size={15} />} label="Playlist" />
              <TabBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<BookOpen size={15} />} label="PDF Notes" />
              <TabBtn active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} icon={<FolderOpen size={15} />} label="Resources" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 pb-32">
            {activeTab === 'content' && (
              <div className="space-y-2">
                {lessons.map((m, idx) => (
                  <button
                    key={m._id}
                    onClick={() => navigate(`/classroom/course/${courseId}/lecture/${m._id}`)}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl border ${m._id === lectureId ? 'bg-accent/10 border-accent/20' : 'border-transparent'}`}
                  >
                    <div className="w-6 h-6 rounded flex items-center justify-center bg-bg text-[10px] font-bold">
                        {m.completed ? <Check size={12} className="text-accent" /> : idx + 1}
                    </div>
                    <span className="text-xs font-bold text-left truncate flex-1">{m.title}</span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase text-accent tracking-widest">Study Documentation</h3>
                {notesPdfUrl ? (
                    <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20 text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent mx-auto">
                            <FileText size={24} />
                        </div>
                        <p className="text-xs font-bold">Comprehensive PDF Available</p>
                        <button onClick={() => setViewMode('pdf')} className="w-full py-3 rounded-xl bg-accent text-white text-[10px] font-black uppercase tracking-widest">
                            Refocus PDF in Workspace
                        </button>
                    </div>
                ) : (
                    <div className="p-10 border border-dashed border-white/10 rounded-2xl text-center text-zinc-500 uppercase text-[10px]">No Notes Provided</div>
                )}
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-3">
                {Array.isArray(currentModule.resources) && currentModule.resources.length > 0 ? (
                  currentModule.resources.map((res, i) => {
                    const resourceType = (res.resourceType || res.type || 'link').toLowerCase();
                    const isPdf = resourceType === 'pdf';

                    return (
                      <div key={i} className="rounded-2xl bg-card/20 border border-border p-4 transition-all hover:border-accent/30">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-bg rounded-lg text-accent">{getResourceIcon(resourceType)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-bold truncate">{res.title || 'Untitled Resource'}</p>
                              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{resourceType}</span>
                            </div>
                            {res.description ? (
                              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">{res.description}</p>
                            ) : null}
                            <div className="flex gap-2 mt-3">
                              <a href={res.url} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-accent/10 border border-accent/20 py-2 text-[9px] font-black uppercase tracking-widest text-accent hover:bg-accent hover:text-white transition-all">
                                <ExternalLink size={12} /> Open
                              </a>
                              {isPdf ? (
                                <a href={res.url} download target="_blank" rel="noreferrer" className="flex items-center justify-center px-3 rounded-lg bg-white/5 border border-white/10 py-2 text-[9px] font-black uppercase tracking-widest text-white">
                                  <Download size={12} />
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-[10px] uppercase tracking-widest text-zinc-500">
                    No resources attached yet.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-bg2 border-t border-border z-40">
            <button onClick={handleCompleteLesson} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${currentModule.completed ? 'bg-card border border-accent/20 text-accent' : 'bg-accent text-white'}`}>
              {currentModule.completed ? "✓ Module Completed" : "Mark as Completed"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex-1 justify-center ${active ? 'bg-card text-accent border border-border' : 'text-text-secondary'}`}>
    {icon} <span>{label}</span>
  </button>
);

export default LecturePage;