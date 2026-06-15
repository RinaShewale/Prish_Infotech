import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChevronLeft, Download, Bookmark,
  CheckCircle, FileText, List, Info, Menu, X, Check, Play,
  MessageCircle,
  FlaskRoundIcon
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
  const [videoProgress, setVideoProgress] = useState(0);

  const { lessons = [], loading } = useSelector((state) => state.lesson);
  const { bookmarks = [] } = useSelector((state) => state.bookmark);

  useEffect(() => {
    dispatch(getBookmarks());
    if (courseId) {
      dispatch(fetchLessons(courseId));
      dispatch(fetchTopUsers({ courseId, limit: 10 }));
    }
  }, [courseId, dispatch]);

  useEffect(() => {
    if (lectureId) dispatch(getLessonProgress(lectureId));
  }, [lectureId, dispatch]);

  const course = lessons.length > 0 ? {
    title: "Introduction to GEN AI",
    modules: lessons.map(l => ({ ...l, id: l._id || l.id }))
  } : null;

  const currentModule = course?.modules.find(m => m.id === lectureId);
  const currentIndex = course?.modules.indexOf(currentModule);
  const completedLessons = course?.modules.filter(m => m.completed).length || 0;
  const progressPercent = course ? Math.round((completedLessons / course.modules.length) * 100) : 0;
  const isBookmarked = bookmarks.some((b) => String(b.lesson?._id) === String(lectureId));

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
        watchedSeconds: videoRef.current?.duration || 100,
        totalDuration: videoRef.current?.duration || 100,
      })).unwrap();
      await dispatch(fetchLessons(courseId));
      await dispatch(fetchCourseProgress(courseId));
    } catch (error) { console.error(error); }
  };

  const handleBookmark = async () => {
    if (isBookmarked) await dispatch(removeBookmark(lectureId));
    else await dispatch(addBookmark({ lessonId: lectureId }));
    await dispatch(getBookmarks());
  };

  if (!course || !currentModule) return (
    <div className="h-screen bg-bg flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">Initializing Workspace</p>
    </div>
  );

  return (
    <div className="h-screen w-full bg-bg text-text font-sans flex flex-col overflow-hidden relative">
       <FluidBackground />
      <div className="noise-bg" />

      {/* --- TOP HEADER --- */}
      <nav className="h-16 lg:h-20 flex-shrink-0 glass flex items-center justify-between px-4 lg:px-8 z-50 border-b border-border">
        <div className="flex items-center gap-3 lg:gap-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-all text-text-secondary">
            <ChevronLeft size={22} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-black text-accent uppercase tracking-[0.2em] bg-accent/10 px-1.5 py-0.5 rounded">Module {currentIndex + 1}</span>
            </div>
            <h1 className="text-xs sm:text-sm lg:text-base font-display font-bold max-w-[120px] sm:max-w-[200px] lg:max-w-[400px] truncate">
              {course.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleBookmark} className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all text-xs font-bold uppercase tracking-wider ${isBookmarked ? "bg-accent text-white" : "glass hover:bg-accent/10"}`}>
            <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
            <span className="hidden xs:inline">{isBookmarked ? "Saved" : "Save"}</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-full glass hover:bg-accent/10 transition-all">
            <MessageCircle size={14} />
          </button>
        </div>
      </nav>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">

        {/* LEFT / TOP: VIDEO PLAYER */}
        <main className="w-full lg:flex-1 bg-black flex items-center justify-center sticky top-0 z-30 lg:relative lg:top-auto aspect-video lg:aspect-auto">
          <video
            ref={videoRef}
            key={currentModule.videoUrl}
            src={currentModule.videoUrl}
            className="w-full h-full max-h-full object-contain"
            controls
            autoPlay
            onTimeUpdate={handleVideoTimeUpdate}
          />
        </main>

        {/* RIGHT / BOTTOM: CONTENT AREA */}
        <aside className="w-full lg:w-[400px] flex flex-col bg-bg2 border-l border-border relative">

          {/* STICKY TAB NAVIGATION (Mobile: sticks below video | Desktop: stays at top of sidebar) */}
          <div className="sticky top-0 lg:relative z-20 p-4 bg-bg2/95 backdrop-blur-md border-b border-border lg:border-none">
            <div className="flex bg-bg rounded-xl p-1 border border-border shadow-inner">
              <TabBtn active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<List size={15} />} label="Playlist" />
              <TabBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Info size={15} />} label="Notes" />
              <TabBtn active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} icon={<FileText size={15} />} label="Files" />
            </div>
          </div>

          {/* SCROLLABLE SECTION */}
          <div className="flex-1 overflow-y-visible lg:overflow-y-auto custom-scrollbar p-4 lg:p-6 pb-32 lg:pb-6">

            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* PROGRESS BAR */}
                <div className="p-4 rounded-2xl glass border border-accent/10 bg-card/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Course Progress</span>
                    <span className="text-[10px] font-black text-accent">{progressPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden">
                    <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>

                {/* PLAYLIST */}
                <div className="space-y-1 relative">
                  <div className="absolute left-[23px] top-4 bottom-4 w-[1px] bg-border/50" />
                  {course.modules.map((m, idx) => {
                    const isActive = m.id === lectureId;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          navigate(`/classroom/course/${courseId}/lecture/${m.id}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full relative z-10 flex items-center gap-4 p-3.5 rounded-xl transition-all group ${isActive ? 'bg-accent/10 border border-accent/20' : 'hover:bg-card/40 border border-transparent'}`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 border font-mono text-[10px] font-bold ${isActive ? 'bg-accent text-white' : m.completed ? 'bg-accent/20 text-accent border-accent/40' : 'bg-bg border-border text-text-secondary'}`}>
                          {m.completed ? <Check size={12} strokeWidth={3} /> : isActive ? <Play size={10} fill="currentColor" /> : idx + 1}
                        </div>
                        <p className={`text-xs font-bold flex-1 text-left truncate ${isActive ? 'text-text' : 'text-text-secondary group-hover:text-text'}`}>
                          {m.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h3 className="font-display text-sm font-bold uppercase tracking-widest text-accent">Module Overview</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-medium bg-card/10 p-4 rounded-xl border border-border">
                  {currentModule.description || "No specific notes available for this module. Follow the video for full technical implementation."}
                </p>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-2">
                <ResourceItem title="Technical_Doc_v1.pdf" size="2.4 MB" />
                <ResourceItem title="Project_Assets.zip" size="15.0 MB" />
              </div>
            )}
          </div>

          {/* ACTION FOOTER - Fixed at bottom of screen on mobile, bottom of sidebar on desktop */}
          <div className="fixed lg:relative bottom-0 left-0 right-0 p-4 bg-bg lg:bg-bg2 border-t border-border z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
            {!currentModule.completed ? (
              <button onClick={handleCompleteLesson} className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-accent text-white hover:opacity-90 shadow-lg active:scale-[0.98] transition-transform">
                <CheckCircle size={18} />
                <span className="text-xs font-black uppercase tracking-[0.15em]">Complete Lesson</span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-card border border-accent/30 text-accent">
                <CheckCircle size={18} />
                <span className="text-xs font-black uppercase tracking-[0.15em]">Lesson Mastered</span>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex-1 justify-center ${active ? 'bg-card text-accent border border-border' : 'text-text-secondary hover:text-text'}`}
  >
    {icon}
    <span className="xs:inline">{label}</span>
  </button>
);

const ResourceItem = ({ title, size }) => (
  <div className="p-4 rounded-xl glass border border-transparent hover:border-accent/40 transition-all flex items-center justify-between group cursor-pointer bg-card/20">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-bg text-accent border border-border"><FileText size={16} /></div>
      <div>
        <p className="text-[11px] font-bold group-hover:text-accent transition-colors">{title}</p>
        <p className="text-[9px] text-text-secondary/50 mt-0.5 font-bold">{size}</p>
      </div>
    </div>
    <Download size={16} className="text-text-secondary group-hover:text-accent" />
  </div>
);

export default LecturePage;