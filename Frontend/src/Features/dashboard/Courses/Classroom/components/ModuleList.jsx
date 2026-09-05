import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Box, Megaphone, PlayCircle } from 'lucide-react';
import { fetchLessons } from '../../../Courses/Classroom/redux/lesson.slice';

const ModuleList = ({ courseId }) => {
  const [activeTab, setActiveTab] = useState('modules');
  const [expandedId, setExpandedId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lessons = [], loading, error } = useSelector((state) => state.lesson);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchLessons(courseId));
    }
  }, [courseId, dispatch]);

  const toggleModule = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const displayModules = lessons.length > 0
    ? lessons.map((lesson) => ({
      id: lesson._id || lesson.id,
      title: lesson.title || 'Untitled Lesson',
      badge: lesson.completed ? "Completed" : "New",
      badgeType: lesson.completed ? "green" : "accent",
      lessons: Array.isArray(lesson.subModules) && lesson.subModules.length > 0
        ? lesson.subModules.map((subModule) => ({
          id: lesson._id || lesson.id,
          subModuleId: subModule._id,
          title: subModule.title || 'Submodule',
          type: "video",
          completed: lesson.completed || false,
        }))
        : [{
          id: lesson._id || lesson.id,
          title: lesson.title || 'Lesson',
          type: "video",
          completed: lesson.completed || false,
        }]
    }))
    : [];

  return (
    /* Added min-h-0 here to allow flex child to shrink and trigger scroll */
    <div className="flex-1 min-h-0 bg-bg2/40 border border-border/50 rounded-[2rem] flex flex-col overflow-hidden shadow-2xl backdrop-blur-md relative z-10">
      
      {/* Tabs */}
      <div className="flex items-center gap-4 sm:gap-8 px-4 sm:px-8 pt-4 border-b border-border/30 shrink-0 overflow-x-auto scrollbar-hide">
        <TabButton
          active={activeTab === 'modules'}
          onClick={() => setActiveTab('modules')}
          icon={<Box size={14} />}
          label="Modules"
        />
        <TabButton
          active={activeTab === 'announcements'}
          onClick={() => setActiveTab('announcements')}
          icon={<Megaphone size={14} />}
          label="Updates"
        />
      </div>

      {/* Content Area - Added min-h-0 and overscroll-contain */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 overscroll-contain">
        <AnimatePresence mode="wait">
          {activeTab === 'modules' ? (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {loading ? (
                <div className="flex items-center justify-center py-20 opacity-50 text-xs uppercase tracking-widest">Loading...</div>
              ) : error ? (
                <div className="text-red-500 text-xs text-center py-10">Error: {error}</div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-accent/5 rounded-2xl border border-accent/10 mb-6 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                      <span className="text-xs sm:text-sm font-semibold tracking-tight truncate">Live Class: Introduction to React</span>
                    </div>
                    <button className="w-full sm:w-auto bg-red-900/20 text-red-400 text-[9px] font-black px-4 py-2 rounded-lg uppercase border border-red-900/30 hover:bg-red-900/40 transition-colors">
                      Join Live
                    </button>
                  </div>

                  <div className="space-y-1">
                    {displayModules.map((module) => (
                      <ModuleItem
                        key={module.id}
                        module={module}
                        isExpanded={expandedId === module.id}
                        onToggle={() => toggleModule(module.id)}
                        courseId={courseId}
                        navigate={navigate}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="announcements"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-text-secondary"
            >
              <Megaphone size={32} className="mb-4 opacity-10" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-40">No new announcements</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] pb-4 transition-all relative whitespace-nowrap ${
      active ? 'text-accent' : 'text-text-secondary hover:text-text'
    }`}
  >
    {icon} {label}
    {active && (
      <motion.div
        layoutId="tab-underline"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
      />
    )}
  </button>
);

const ModuleItem = ({ module, isExpanded, onToggle, courseId, navigate }) => {
  const isLocked = module.badge === "Locked";

  return (
    <div className={`border-b border-border/20 last:border-0 ${isLocked ? 'opacity-40' : ''}`}>
      <div
        onClick={onToggle}
        className="flex items-center justify-between py-5 cursor-pointer group gap-4"
      >
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <span className={`text-xs sm:text-sm font-bold transition-colors truncate ${isExpanded ? 'text-accent' : 'text-text-secondary group-hover:text-text'}`}>
            {module.title}
          </span>
          <span className={`shrink-0 text-[8px] font-black uppercase px-2 py-0.5 rounded border tracking-tighter ${
            module.badgeType === 'green' ? 'bg-green-900/20 text-green-400 border-green-900/30' :
            module.badgeType === 'accent' ? 'bg-accent/20 text-accent border-accent/30' :
            'bg-white/5 text-text-secondary border-white/10'
          }`}>
            {module.badge}
          </span>
        </div>
        {!isLocked && (
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="shrink-0">
            <ChevronDown size={16} className="text-text-secondary" />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && !isLocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pl-2 sm:pl-4 pb-6 space-y-2">
              {module.lessons.map((lesson, idx) => (
                <div
                  key={`${lesson.id}-${idx}`}
                  className="flex items-center justify-between group p-3 rounded-xl transition-all hover:bg-white/[0.03] border border-transparent hover:border-border/30 gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="shrink-0">
                      <PlayCircle size={14} className={lesson.completed ? 'text-green-500' : 'text-accent'} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[11px] sm:text-xs font-semibold truncate ${lesson.completed ? 'text-text-secondary' : 'text-text'}`}>
                        {lesson.title}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/classroom/course/${courseId}/lecture/${lesson.id}${lesson.subModuleId ? `?subModule=${lesson.subModuleId}` : ''}`);
                    }}
                    className={`shrink-0 text-[9px] font-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg uppercase border transition-all ${
                      lesson.completed
                        ? "bg-green-900/20 text-green-400 border-green-900/30"
                        : "bg-accent text-white border-accent shadow-lg shadow-accent/10"
                    }`}
                  >
                    {lesson.completed ? "Review" : "Start"}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModuleList;