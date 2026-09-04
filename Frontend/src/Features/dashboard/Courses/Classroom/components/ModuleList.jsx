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
    if (courseId) dispatch(fetchLessons(courseId));
  }, [courseId, dispatch]);

  const toggleModule = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const displayModules = lessons.length > 0 ? lessons.map((lesson) => ({
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
        : [{ id: lesson._id || lesson.id, title: lesson.title || 'Lesson', type: "video", completed: lesson.completed || false }]
    })) : [];

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full w-full bg-bg2/40 border border-border/50 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-4 sm:gap-8 px-4 sm:px-8 pt-4 border-b border-border/30 shrink-0">
        <TabButton active={activeTab === 'modules'} onClick={() => setActiveTab('modules')} icon={<Box size={14} />} label="Modules" />
        <TabButton active={activeTab === 'announcements'} onClick={() => setActiveTab('announcements')} icon={<Megaphone size={14} />} label="Updates" />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'modules' ? (
            <motion.div key="modules" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {loading ? (
                <div className="py-10 text-center opacity-50 text-xs">Loading...</div>
              ) : (
                <div className="space-y-1 pb-10">
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
              )}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-40 text-[10px] uppercase tracking-widest">No Updates</div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

const ModuleItem = ({ module, isExpanded, onToggle, courseId, navigate }) => {
  return (
    <div className="border-b border-border/20 last:border-0">
      <div onClick={onToggle} className="flex items-center justify-between py-4 cursor-pointer group px-2 select-none">
        <span className={`text-sm font-bold truncate ${isExpanded ? 'text-accent' : 'text-text-secondary group-hover:text-text'}`}>
          {module.title}
        </span>
        <ChevronDown size={16} className={`transition-transform duration-300 shrink-0 ml-2 ${isExpanded ? 'rotate-180 text-accent' : 'text-text-secondary'}`} />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-2 sm:pl-4 pb-4 space-y-2">
              {module.lessons.map((lesson, idx) => (
                <div key={`${lesson.id}-${idx}`} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-transparent hover:border-border/30 transition-all gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <PlayCircle size={16} className={`shrink-0 ${lesson.completed ? 'text-green-500' : 'text-accent'}`} />
                    <p className="text-xs font-medium truncate text-text">{lesson.title}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/classroom/course/${courseId}/lecture/${lesson.id}${lesson.subModuleId ? `?subModule=${lesson.subModuleId}` : ''}`);
                    }}
                    className="shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-green-900/30 text-green-400 bg-green-900/10 hover:bg-green-900/20 transition-colors"
                  >
                    REVIEW
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

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pb-4 transition-all relative ${active ? 'text-accent' : 'text-text-secondary'}`}>
    {icon} {label}
    {active && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
  </button>
);

export default ModuleList;