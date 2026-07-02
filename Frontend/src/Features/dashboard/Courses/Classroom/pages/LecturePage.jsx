import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChevronLeft, Download, Bookmark,
  FileText, List, Globe, MonitorPlay, X, 
  ExternalLink, FolderOpen, 
  Terminal, Check, PlayCircle, Eye
} from 'lucide-react';

// Redux & Hooks
import { fetchLessons } from '../../Classroom/redux/lesson.slice';
import { saveLessonProgress, getLessonProgress } from '../../Classroom/redux/lessonProgress.slice';
import { fetchTopUsers } from '../../Classroom/redux/leaderboard.slice';
import { fetchCourseProgress } from '../../Classroom/redux/courseProgress.slice';
import { getBookmarks } from "../../Classroom/redux/bookmark.slice";
import useBookmark from '../hook/useBookmark'; 
import { FluidBackground } from '../../../Home/components/FluidBackground';

const LecturePage = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  const [activeTab, setActiveTab] = useState('content');
  const [viewMode, setViewMode] = useState('video'); 
  const [isCompleting, setIsCompleting] = useState(false);
  const [activePdfUrl, setActivePdfUrl] = useState(null);

  const { bookmarkLesson, unbookmarkLesson } = useBookmark();
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
        window.scrollTo(0, 0);
    }
  }, [lectureId, dispatch]);

  const currentModule = lessons.find(m => (m._id || m.id) === lectureId);
  const currentIndex = lessons.indexOf(currentModule);
  const isBookmarked = bookmarks.some((b) => String(b.lesson?._id) === String(lectureId));

  // --- MERGED ASSETS: Both PDFs and Links ---
  const allAssets = useMemo(() => {
    if (!currentModule) return [];
    const assets = [];
    
    // 1. Add main PDF if exists
    if (currentModule.resourceUrL) {
        assets.push({ title: "Lesson Notes", url: currentModule.resourceUrL, type: "pdf", isPrimary: true });
    }
    
    // 2. Add from resources array
    if (Array.isArray(currentModule.resources)) {
        currentModule.resources.forEach(res => {
            // Check if it's a PDF by type or file extension
            const isPdf = res.type === 'pdf' || res.resourceType === 'pdf' || res.url?.endsWith('.pdf');
            if (res.url !== currentModule.resourceUrL) {
                assets.push({ ...res, type: isPdf ? 'pdf' : (res.type || 'link') });
            }
        });
    }
    return assets;
  }, [currentModule]);

  const handleBookmarkToggle = async () => {
    try {
      if (isBookmarked) {
        await unbookmarkLesson(lectureId);
      } else {
        await bookmarkLesson(courseId, lectureId);
      }
      dispatch(getBookmarks());
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
    }
  };

  const handleCompleteLesson = async () => {
    setIsCompleting(true);
    try {
      await dispatch(saveLessonProgress({
        lessonId: lectureId,
        watchedSeconds: 100,
        totalDuration: 100,
      })).unwrap();
      dispatch(fetchLessons(courseId));
      dispatch(fetchCourseProgress(courseId));
    } catch (error) { console.error(error); } 
    finally { setIsCompleting(false); }
  };

  const renderMainDisplay = () => {
    if (viewMode === 'pdf' && activePdfUrl) {
      return (
        <div className="relative w-full h-full bg-[#050505] animate-in fade-in zoom-in-95 duration-500">
          <div className="absolute top-6 right-6 z-50">
            <button 
                onClick={() => setViewMode("video")} 
                className="group flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-full shadow-2xl hover:scale-105 transition-all"
            >
              <MonitorPlay size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Back to Video</span>
            </button>
          </div>
          <iframe src={`${activePdfUrl}#toolbar=0`} title="Lesson PDF" className="w-full h-full border-0" />
        </div>
      );
    }

    const url = currentModule?.videoUrl;
    if (!url) return (
        <div className="flex flex-col items-center justify-center h-full bg-[#0a0a0a] text-zinc-700">
            <MonitorPlay size={40} className="opacity-20 mb-4" />
            <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">No Content</p>
        </div>
    );

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} className="w-full h-full border-0" allowFullScreen allow="autoplay" />;
    }

    return <video ref={videoRef} key={url} src={url} className="w-full h-full object-contain bg-black" controls autoPlay />;
  };

  if (!currentModule) return <div className="h-screen bg-[#0a0a0a] flex items-center justify-center text-accent font-black uppercase text-[10px] tracking-widest animate-pulse">Loading Module...</div>;

  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-zinc-100 font-sans flex flex-col overflow-hidden relative">
      <FluidBackground />
      
      {/* HEADER */}
      <nav className="h-20 lg:h-24 flex-shrink-0 flex items-center justify-between px-6 lg:px-10 z-50 border-b border-white/5 relative bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/5 hover:bg-accent rounded-2xl transition-all">
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-accent uppercase tracking-widest mb-1">Module {currentIndex + 1}</span>
            <h1 className="text-base lg:text-lg font-bold text-white tracking-tight line-clamp-1">{currentModule.title}</h1>
          </div>
        </div>

        <button onClick={handleBookmarkToggle} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${isBookmarked ? 'bg-accent border-accent text-white' : 'bg-white/5 border-white/5 text-zinc-500'}`}>
          <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </nav>

      {/* WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        <main className="w-full lg:flex-1 bg-black aspect-video lg:aspect-auto relative z-20 overflow-hidden shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
          {renderMainDisplay()}
        </main>

        <aside className="flex-1 lg:w-[450px] lg:flex-none flex flex-col bg-[#0a0a0a] border-l border-white/5 relative z-10 overflow-hidden">
          
          {/* TABS (Now only 2 Tabs) */}
          <div className="p-6 pb-2">
            <div className="flex bg-white/[0.03] rounded-[1.25rem] p-1.5 border border-white/5 backdrop-blur-sm">
              <TabBtn active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<List size={15} />} label="Curriculum" />
              <TabBtn active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} icon={<FolderOpen size={15} />} label="Assets & Files" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 pb-32">
            {activeTab === 'content' && (
              <div className="space-y-2.5">
                {lessons.map((m, idx) => {
                  const isActive = m._id === lectureId;
                  return (
                    <button key={m._id} onClick={() => navigate(`/classroom/course/${courseId}/lecture/${m._id}`)} className={`group w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${isActive ? 'bg-accent/10 border-accent/30 shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}>
                      <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-[10px] font-black ${isActive ? 'bg-accent text-white' : 'bg-white/5 text-zinc-500'}`}>
                          {m.completed ? <Check size={16} strokeWidth={4} /> : idx + 1}
                      </div>
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className={`text-[13px] font-bold text-left line-clamp-1 ${isActive ? 'text-white' : 'text-zinc-400'}`}>{m.title}</span>
                        {isActive && <span className="text-[9px] text-accent font-black uppercase tracking-widest mt-0.5">Active</span>}
                      </div>
                      {isActive && <PlayCircle size={14} className="ml-auto text-accent" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* --- ASSETS TAB: COMBINED PDFs & LINKS --- */}
            {activeTab === 'resources' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                {allAssets.length > 0 ? (
                  allAssets.map((res, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-accent/30 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-all ${res.type === 'pdf' ? 'bg-accent/10 text-accent' : 'bg-zinc-900 text-zinc-500'}`}>
                                {getResourceIcon(res.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-bold truncate text-white">{res.title || 'Attached Resource'}</p>
                                <p className="text-[9px] font-black uppercase tracking-[0.1em] text-zinc-600 mt-0.5">{res.type}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {res.type === 'pdf' ? (
                                    <>
                                        <button 
                                            onClick={() => { setActivePdfUrl(res.url); setViewMode('pdf'); }}
                                            className="p-2.5 rounded-lg bg-accent/20 text-accent hover:bg-accent hover:text-white transition-all shadow-lg shadow-accent/5"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <a href={res.url} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-white/5 text-zinc-500 hover:text-white transition-all">
                                            <Download size={16} />
                                        </a>
                                    </>
                                ) : (
                                    <a href={res.url} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-white/5 text-zinc-500 hover:text-accent transition-all">
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                  ))
                ) : (
                    <div className="py-20 border-2 border-dashed border-white/5 rounded-[2.5rem] text-center">
                        <FolderOpen size={40} className="text-zinc-800 mb-4 mx-auto opacity-20" />
                        <span className="text-zinc-600 uppercase text-[10px] font-black tracking-[0.2em]">No Assets Found</span>
                    </div>
                )}
              </div>
            )}
          </div>

          {/* MARK COMPLETED */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pt-12 z-30">
            <button 
                disabled={isCompleting}
                onClick={handleCompleteLesson} 
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-[10px] transition-all flex items-center justify-center gap-3 shadow-2xl ${currentModule.completed ? 'bg-zinc-900 text-accent border border-accent/30' : 'bg-accent text-white hover:brightness-110'}`}
            >
              {currentModule.completed ? <><Check size={16} strokeWidth={4}/> Lesson Completed</> : "Mark as Completed"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2.5 py-3 rounded-[0.9rem] text-[10px] font-black uppercase tracking-widest transition-all flex-1 justify-center ${active ? 'bg-zinc-800 text-accent border border-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}>
    {icon} <span className="hidden xl:inline">{label}</span>
  </button>
);

const getResourceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return <FileText size={18} />;
      case 'github': case 'repo': case 'terminal': return <Terminal size={18} />;
      default: return <Globe size={18} />;
    }
};

export default LecturePage;