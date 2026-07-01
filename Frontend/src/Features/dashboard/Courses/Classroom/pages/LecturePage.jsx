import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChevronLeft, Download, Bookmark,
  CheckCircle, FileText, List, Info, Check, Play,
  MessageCircle, Globe, MonitorPlay, X, ExternalLink,
  BookOpen, FolderOpen, Image as ImageIcon
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
  const [videoProgress, setVideoProgress] = useState(0);
  const [activeResource, setActiveResource] = useState(null);

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
        setViewMode('video'); // Reset to video when changing lessons
    }
  }, [lectureId, dispatch]);

  const currentModule = lessons.find(m => (m._id || m.id) === lectureId);
  const currentIndex = lessons.indexOf(currentModule);
  const completedLessons = lessons.filter(m => m.completed).length || 0;
  const progressPercent = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;
  const isBookmarked = bookmarks.some((b) => String(b.lesson?._id) === String(lectureId));

  // --- RENDERING LOGIC ---
  const renderMainDisplay = () => {
    if (viewMode === 'pdf' && currentModule?.resourceUrL) {
      return (
        <div className="relative w-full h-full bg-bg2">
            {/* Close PDF / Back to Video Button */}
            <button 
                onClick={() => setViewMode('video')}
                className="absolute top-4 right-4 z-50 p-2 bg-accent text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                title="Back to Video"
            >
                <X size={20} />
            </button>
            <iframe
                src={`${currentModule.resourceUrL}#toolbar=0`}
                className="w-full h-full border-none"
                title="Lesson PDF"
            />
        </div>
      );
    }

    // Default Video Player Logic
    const url = currentModule?.videoUrl;
    if (!url) return <div className="text-text-secondary text-xs uppercase tracking-widest font-black italic">No Media Content Available</div>;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return (
        <iframe
          src={embedUrl}
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
        onTimeUpdate={handleVideoTimeUpdate}
      />
    );
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    setVideoProgress(Math.round((currentTime / duration) * 100));

    const lastSavedTime = videoRef.current.dataset.lastSaved || 0;
    if (currentTime - lastSavedTime > 10) {
      dispatch(saveLessonProgress({
        lessonId: lectureId,
        watchedSeconds: currentTime,
        totalDuration: duration,
      }));
      videoRef.current.dataset.lastSaved = currentTime;
    }
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

  const handleBookmark = async () => {
    if (isBookmarked) await dispatch(removeBookmark(lectureId));
    else await dispatch(addBookmark({ lessonId: lectureId }));
    dispatch(getBookmarks());
  };

  if (!currentModule) return (
    <div className="h-screen bg-bg flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="font-display text-[10px] font-black uppercase tracking-[0.3em] text-accent">Loading Curriculum</p>
    </div>
  );

  return (
    <div className="h-screen w-full bg-bg text-text font-sans flex flex-col overflow-hidden relative">
      <FluidBackground />
      <div className="noise-bg" />

      {/* --- HEADER --- */}
      <nav className="h-16 lg:h-20 flex-shrink-0 glass flex items-center justify-between px-4 lg:px-8 z-50 border-b border-border">
        <div className="flex items-center gap-3 lg:gap-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-all text-text-secondary">
            <ChevronLeft size={22} />
          </button>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-accent uppercase tracking-[0.2em] bg-accent/10 px-1.5 py-0.5 rounded w-fit mb-1">Module {currentIndex + 1}</span>
            <h1 className="text-xs sm:text-sm lg:text-base font-display font-bold max-w-[150px] sm:max-w-[300px] truncate">
              {currentModule.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
            {viewMode === 'pdf' && (
                 <button onClick={() => setViewMode('video')} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-accent/10 transition-all text-[10px] font-black uppercase tracking-widest text-accent">
                    <MonitorPlay size={14} /> Watch Video
                </button>
            )}
          <button onClick={handleBookmark} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-[10px] font-black uppercase tracking-widest ${isBookmarked ? "bg-accent text-white" : "glass hover:bg-accent/10"}`}>
            <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
            <span className="hidden xs:inline">{isBookmarked ? "Saved" : "Save"}</span>
          </button>
        </div>
      </nav>

      {/* --- WORKSPACE --- */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        
        {/* MAIN DISPLAY AREA (VIDEO OR PDF) */}
        <main className="w-full lg:flex-1 bg-black flex items-center justify-center sticky top-0 z-30 lg:relative aspect-video lg:aspect-auto border-b border-border lg:border-none">
          {renderMainDisplay()}
        </main>

        {/* SIDEBAR */}
        <aside className="w-full lg:w-[400px] flex flex-col bg-bg2 border-l border-border relative">
          
          <div className="p-4 bg-bg2/95 backdrop-blur-md border-b border-border">
            <div className="flex bg-bg rounded-xl p-1 border border-border">
              <TabBtn active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<List size={15} />} label="Playlist" />
              <TabBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Info size={15} />} label="Notes" />
              <TabBtn active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} icon={<FileText size={15} />} label="Files" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 pb-32">
            
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl glass border border-accent/10 bg-card/20">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Progress</span>
                        <span className="text-[10px] font-black text-accent">{progressPercent}%</span>
                    </div>
                    <div className="h-1 w-full bg-bg rounded-full overflow-hidden">
                        <div className="h-full bg-accent transition-all duration-700" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>

                <div className="space-y-1">
                  {lessons.map((m, idx) => {
                    const isActive = (m._id || m.id) === lectureId;
                    return (
                      <button
                        key={m._id || m.id}
                        onClick={() => navigate(`/classroom/course/${courseId}/lecture/${m._id || m.id}`)}
                        className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all border ${isActive ? 'bg-accent/10 border-accent/20' : 'hover:bg-card/40 border-transparent'}`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${isActive ? 'bg-accent text-white' : m.completed ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-bg border border-border text-text-secondary'}`}>
                          {m.completed ? <Check size={12} strokeWidth={3} /> : isActive ? <Play size={10} fill="currentColor" /> : idx + 1}
                        </div>
                        <p className={`text-xs font-bold flex-1 text-left truncate ${isActive ? 'text-text' : 'text-text-secondary'}`}>
                          {m.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent">Lesson Brief</h3>
                <div className="text-xs text-text-secondary leading-relaxed font-medium bg-card/10 p-5 rounded-2xl border border-border whitespace-pre-wrap">
                  {currentModule.content || currentModule.description || "No specific technical notes provided."}
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                {currentModule.resourceUrL ? (
                  <button onClick={() => { setActiveResource(null); setViewMode('pdf'); }} className="w-full text-left">
                    <ResourceItem title="Open Lesson PDF" size="View in Workspace" isPDF={true} />
                  </button>
                ) : null}

                {(currentModule.resources && currentModule.resources.length > 0) ? (
                  currentModule.resources.map((resource, index) => (
                    <div key={index} className="rounded-2xl border border-border bg-card/10 p-3 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-bg text-accent border border-border">
                            {resource.resourceType === 'pdf' ? <FileText size={14} /> : resource.resourceType === 'image' ? <ImageIcon size={14} /> : resource.resourceType === 'zip' || resource.resourceType === 'code' ? <FolderOpen size={14} /> : resource.resourceType === 'slides' ? <BookOpen size={14} /> : <Globe size={14} />}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold">{resource.title || 'Untitled Resource'}</p>
                            <p className="text-[9px] uppercase tracking-widest text-text-secondary/70">{resource.resourceType || 'link'}</p>
                            {resource.description ? <p className="text-[10px] text-text-secondary mt-1">{resource.description}</p> : null}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {resource.url ? (
                          <>
                            <a href={resource.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-accent">
                              <ExternalLink size={12} /> Open
                            </a>
                            {resource.resourceType === 'pdf' ? (
                              <a href={resource.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white">
                                <Download size={12} /> Download
                              </a>
                            ) : null}
                          </>
                        ) : null}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 px-4 py-12 text-center text-[10px] uppercase tracking-widest text-text-secondary">
                    No lesson resources yet.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-bg2 border-t border-border z-40">
            <button 
                onClick={handleCompleteLesson} 
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${currentModule.completed ? 'bg-card border border-accent/20 text-accent' : 'bg-accent text-white hover:opacity-90 active:scale-95'}`}
            >
              <CheckCircle size={16} />
              {currentModule.completed ? "Module Mastered" : "Mark as Completed"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-2 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex-1 justify-center ${active ? 'bg-card text-accent border border-border shadow-sm' : 'text-text-secondary hover:text-text'}`}>
    {icon} <span>{label}</span>
  </button>
);

const ResourceItem = ({ title, size, isPDF }) => (
  <div className="p-4 rounded-xl glass border border-transparent hover:border-accent/40 transition-all flex items-center justify-between group bg-card/20">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-bg text-accent border border-border">
          {isPDF ? <FileText size={16} /> : <Globe size={16} />}
      </div>
      <div>
        <p className="text-[11px] font-bold group-hover:text-accent transition-colors">{title}</p>
        <p className="text-[9px] text-text-secondary/50 mt-0.5 font-black uppercase tracking-tighter">{size}</p>
      </div>
    </div>
    <Play size={14} className="text-text-secondary group-hover:text-accent fill-current" />
  </div>
);

export default LecturePage;