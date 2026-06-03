import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Box, Megaphone, ArrowUpRight, PlayCircle, FileText, Lock } from 'lucide-react';
import { fetchLessons } from '../lesson.slice';

const ModuleList = ({ courseId }) => {
  const [activeTab, setActiveTab] = useState('modules');
  const [expandedId, setExpandedId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lessons = [], loading, error } = useSelector(
    (state) => state.lesson
  );

  useEffect(() => {
    if (courseId) {
      dispatch(fetchLessons(courseId));
    }
  }, [courseId, dispatch]);

  const toggleModule = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const displayModules = lessons.length > 0
    ? lessons.map((lesson, idx) => ({
      id: lesson._id || lesson.id,
      title: lesson.title || 'Untitled Lesson',
      badge: lesson.completed ? "Completed" : "New",
      badgeType: lesson.completed ? "green" : "accent",
      lessons: [
        {
          id: lesson._id || lesson.id,
          title: lesson.title || 'Lesson',
          type: "video",
          completed: lesson.completed || false,
        }
      ]
    }))
    : [];

  return (
    <div className="flex-1 bg-bg2 border border-border rounded-xl flex flex-col overflow-hidden shadow-2xl">

      {/* Tabs */}
      <div className="flex items-center gap-6 px-6 pt-4 border-b border-border/50 shrink-0">
        <TabButton
          active={activeTab === 'modules'}
          onClick={() => setActiveTab('modules')}
          icon={<Box size={14} />}
          label="All Modules"
        />
        <TabButton
          active={activeTab === 'announcements'}
          onClick={() => setActiveTab('announcements')}
          icon={<Megaphone size={14} />}
          label="Announcements"
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
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
                <div className="flex items-center justify-center py-20">
                  <p className="text-text-secondary">Loading modules...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-20">
                  <p className="text-red-500">Error loading modules: {error}</p>
                </div>
              ) : (
                <>
                  {/* Join Live Section */}
                  <div className="flex items-center justify-between p-4 bg-card/30 rounded-xl border border-border/40 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium tracking-tight">Live Class: Introduction to React</span>
                    </div>
                    <button className="bg-red-900/20 text-red-400 text-[10px] font-black px-4 py-2 rounded-lg uppercase border border-red-900/30 hover:bg-red-900/40 transition-colors">
                      Join Live
                    </button>
                  </div>

                  {/* Dynamic Module List */}
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
              <Megaphone size={40} className="mb-4 opacity-20" />
              <p className="text-xs uppercase tracking-widest font-bold">No new announcements</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Sub-Component: Tab Button
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pb-4 transition-all relative ${active ? 'text-accent' : 'text-text-secondary hover:text-text'
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

// Sub-Component: Module Item
const ModuleItem = ({ module, isExpanded, onToggle, courseId, navigate }) => {
  const isLocked = module.badge === "Locked";

  return (
    <div className={`border-b border-border/30 last:border-0 ${isLocked ? 'opacity-50' : ''}`}>
      <div
        onClick={onToggle}
        className="flex items-center justify-between py-4 cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <span className={`text-sm font-semibold transition-colors ${isExpanded ? 'text-accent' : 'group-hover:text-text'}`}>
            {module.title}
          </span>
          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${module.badgeType === 'green' ? 'bg-green-900/20 text-green-400 border-green-900/30' :
            module.badgeType === 'accent' ? 'bg-accent/20 text-accent border-accent/30' :
              'bg-white/5 text-text-secondary border-white/10'
            }`}>
            {module.badge}
          </span>
        </div>
        {!isLocked && (
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
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
            <div className="pl-4 pb-6 space-y-2 pt-2">
              {module.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-all"
                >
                  {/* Left Side: Icon and Title */}
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {lesson.type === 'resource' ? (
                        <ArrowUpRight size={14} className="text-accent" />
                      ) : (
                        <PlayCircle size={14} className={lesson.completed ? 'text-green-500' : 'text-text-secondary'} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${lesson.completed ? 'text-text/60' : 'font-medium text-text'}`}>
                        {lesson.title}
                      </p>
                      {lesson.alert && (
                        <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tighter">
                          {lesson.alert}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Resume Button (only for incomplete lessons) */}
                  <button
                    onClick={() =>
                      navigate(`/classroom/course/${courseId}/lecture/${lesson.id}`)
                    }
                    className={`text-[10px] font-black px-4 py-2 rounded-lg uppercase border transition-all ${lesson.completed
                        ? "bg-green-900/20 text-green-400 border-green-900/30 hover:bg-green-900/30"
                        : "bg-white/5 text-text-secondary border-white/10 hover:bg-accent/20 hover:text-accent hover:border-accent/30"
                      }`}
                  >
                    {lesson.completed ? "Review" : "Resume"}
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