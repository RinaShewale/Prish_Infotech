import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChevronLeft, Download, Bookmark,
  CheckCircle, FileText, List, Info, Menu, X, Check, Play,
  MessageCircle
} from 'lucide-react';
import { fetchLessons } from '../lesson.slice';
import { saveLessonProgress, getLessonProgress } from '../lessonProgress.slice';
import { fetchTopUsers } from '../leaderboard.slice';
import { fetchCourseProgress } from '../courseProgress.slice';
import { addBookmark, getBookmarks ,removeBookmark } from "../bookmark.slice";

const LecturePage = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [videoProgress, setVideoProgress] = useState(0);

  const { lessons = [], loading } = useSelector((state) => state.lesson);
  const { progress } = useSelector((state) => state.lessonProgress);

  const { bookmarks = [] } = useSelector((state) => state.bookmark);

  useEffect(() => {
    dispatch(getBookmarks());
  }, [dispatch]);

  useEffect(() => {
    if (courseId) dispatch(fetchLessons(courseId));
  }, [courseId, dispatch]);

  useEffect(() => {
    if (lectureId) {
      dispatch(getLessonProgress(lectureId));
    }
  }, [lectureId, dispatch]);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchTopUsers({ courseId, limit: 10 }));
    }
  }, [courseId, dispatch]);

  const course = lessons.length > 0 ? {
    title: "Introduction to GEN AI",
    modules: lessons.map(l => ({ ...l, id: l._id || l.id }))
  } : null;

  const currentModule = course?.modules.find(m => m.id === lectureId);
  const currentIndex = course?.modules.indexOf(currentModule);

  const completedLessons = course?.modules.filter(m => m.completed).length || 0;
  const progressPercent = course ? Math.round((completedLessons / course.modules.length) * 100) : 0;

  const isBookmarked = bookmarks.some((b) => String(b.lesson?._id) === String(lectureId));

  // Save progress when video time updates
  const handleVideoTimeUpdate = (e) => {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;

    setVideoProgress(Math.round((currentTime / duration) * 100));

    // Save progress every 10 seconds
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


  // Mark lesson as complete
  const handleCompleteLesson = async () => {
    try {
      await dispatch(
        saveLessonProgress({
          lessonId: lectureId,
          watchedSeconds: videoRef.current?.duration || 100,
          totalDuration: videoRef.current?.duration || 100,
        })
      ).unwrap();

      await dispatch(fetchLessons(courseId));
      await dispatch(fetchCourseProgress(courseId));

    } catch (error) {
      console.error(error);
    }
  };


  const handleBookmark = async () => {
    const isBookmarked = bookmarks.some(
      (b) => String(b.lesson?._id) === String(lectureId)
    );

    console.log("lectureId:", lectureId);
    console.log("isBookmarked:", isBookmarked);

    if (isBookmarked) {
      console.log("REMOVING BOOKMARK...");
      await dispatch(removeBookmark(lectureId));
    } else {
      console.log("ADDING BOOKMARK...");
      await dispatch(addBookmark({ lessonId: lectureId }));
    }

    await dispatch(getBookmarks());
  };



  if (!course || !currentModule) return (
    <div className="h-screen bg-bg flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">Initializing Workspace</p>
    </div>
  );

  return (
    <div className="h-screen w-full bg-bg text-text font-sans overflow-hidden flex flex-col relative">
      <div className="noise-bg" />

      {/* --- TOP HEADER --- */}
      <nav className="h-16 lg:h-20 flex-shrink-0 glass flex items-center justify-between px-4 lg:px-8 z-50 border-b border-border">
        <div className="flex items-center gap-3 lg:gap-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-all text-text-secondary hover:text-text border border-transparent hover:border-border">
            <ChevronLeft size={22} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-black text-accent uppercase tracking-[0.2em] bg-accent/10 px-1.5 py-0.5 rounded">Module {currentIndex + 1}</span>
              <span className="text-[9px] text-text-secondary/40 uppercase tracking-widest font-bold">Workspace v2.0</span>
            </div>
            <h1 className="text-sm lg:text-base font-display font-bold truncate max-w-[150px] lg:max-w-[400px]">{course.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmark}
            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full transition-all text-xs font-bold uppercase tracking-wider ${isBookmarked
              ? "bg-accent text-white"
              : "glass hover:bg-accent/10"
              }`}
          >
            <Bookmark
              size={14}
              fill={isBookmarked ? "currentColor" : "none"}
            />

            <span>
              {isBookmarked
                ? "Bookmarked"
                : "Bookmark"}
            </span>
          </button>


          <button
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-accent/10 transition-all text-xs font-bold uppercase tracking-wider"
          >
            <MessageCircle size={14} />
          </button>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2.5 rounded-xl bg-accent text-white shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* LEFT: THEATER VIDEO AREA */}
        <main className="flex-1 relative bg-black flex items-center justify-center group overflow-hidden">
          <video
            ref={videoRef}
            key={currentModule.videoUrl}
            src={currentModule.videoUrl}
            className="w-full h-full max-h-full object-contain z-10"
            controls
            autoPlay
            onTimeUpdate={handleVideoTimeUpdate}
          />
        </main>

        {/* RIGHT: DYNAMIC SIDEBAR */}
        <aside className={`
          fixed lg:relative inset-0 lg:inset-auto z-40 lg:z-auto
          w-full lg:w-[400px] bg-bg2 flex flex-col transition-transform duration-500 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          border-l border-border
        `}>

          {/* Sidebar Tabs */}
          <div className="flex-shrink-0 p-4 bg-bg2">
            <div className="flex bg-bg rounded-xl p-1 border border-border">
              <TabBtn active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<List size={15} />} label="Playlist" />
              <TabBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Info size={15} />} label="Notes" />
              <TabBtn active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} icon={<FileText size={15} />} label="Files" />
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-bg2">

            {activeTab === 'content' && (
              <div className="p-4 pt-0">
                {/* PROGRESS HEADER */}
                <div className="mb-6 p-4 rounded-2xl glass border-accent/20 relative overflow-hidden group bg-card/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Course Status</span>
                    <span className="text-[10px] font-black text-accent">{progressPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden border border-border/50">
                    <div
                      className="h-full bg-accent transition-all duration-1000 shadow-[0_0_12px_rgba(var(--accent-rgb),0.5)]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* PLAYLIST ITEMS */}
                <div className="space-y-1 relative">
                  <div className="absolute left-[23px] top-4 bottom-4 w-[1px] bg-border/50 z-0" />

                  {course.modules.map((m, idx) => {
                    const isActive = m.id === lectureId;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          navigate(`/classroom/course/${courseId}/lecture/${m.id}`);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                        className={`w-full relative z-10 flex items-center gap-4 p-3.5 rounded-xl transition-all group ${isActive ? 'bg-accent/10 border border-accent/20' : 'hover:bg-card/40 border border-transparent'
                          }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all border font-mono text-[10px] font-bold ${isActive
                          ? 'bg-accent text-white border-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.4)]'
                          : m.completed
                            ? 'bg-accent/20 border-accent/40 text-accent'
                            : 'bg-bg border-border text-text-secondary group-hover:border-text-secondary/50'
                          }`}>
                          {m.completed ? <Check size={12} strokeWidth={3} /> : isActive ? <Play size={10} fill="currentColor" /> : idx + 1}
                        </div>

                        <div className="flex-1 text-left min-w-0">
                          <p className={`text-xs font-bold truncate ${isActive ? 'text-text' : 'text-text-secondary group-hover:text-text'}`}>
                            {m.title}
                          </p>
                        </div>
                        {isActive && <div className="w-1 h-1 rounded-full bg-accent animate-ping" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="p-6">
                <h3 className="font-display text-sm font-bold mb-4 uppercase tracking-widest text-accent">Module Overview</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                  {currentModule.description || "In-depth technical breakdown of this session's core concepts."}
                </p>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="p-4 space-y-2">
                <ResourceItem title="Documentation_Main.pdf" size="2.4 MB" />
                <ResourceItem title="Starter_Project.zip" size="15.0 MB" />
              </div>
            )}
          </div>

          {/* --- NEW IMPROVED ACTION FOOTER --- */}
          <div className="p-4 bg-bg border-t border-border shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
            {!currentModule.completed ? (
              <button onClick={handleCompleteLesson} className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-accent text-white hover:opacity-90 transition-all shadow-[0_4px_15px_rgba(var(--accent-rgb),0.3)] active:scale-[0.98]">
                <CheckCircle size={18} />
                <span className="text-xs font-black uppercase tracking-[0.15em]">Complete Lesson</span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-card border border-accent/30 text-accent">
                <CheckCircle size={18} />
                <span className="text-xs font-black uppercase tracking-[0.15em]">Lesson Mastered</span>
              </div>
            )}
            <p className="text-[9px] text-center mt-3 text-text-secondary/40 font-bold uppercase tracking-[0.2em]">System.Workspace_v2.0</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

// Internal Sub-components
const TabBtn = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`
        flex items-center gap-2 px-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex-1 justify-center
        ${active ? 'bg-card text-accent border border-border shadow-sm' : 'text-text-secondary hover:text-text'}
      `}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const ResourceItem = ({ title, size }) => (
  <div className="p-4 rounded-xl glass border border-transparent hover:border-accent/40 transition-all flex items-center justify-between group cursor-pointer bg-card/20">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-bg text-accent border border-border">
        <FileText size={16} />
      </div>
      <div>
        <p className="text-[11px] font-bold group-hover:text-accent transition-colors">{title}</p>
        <p className="text-[9px] text-text-secondary/50 mt-0.5 font-bold uppercase tracking-tighter">{size}</p>
      </div>
    </div>
    <Download size={16} className="text-text-secondary group-hover:text-accent" />
  </div>
);

export default LecturePage;