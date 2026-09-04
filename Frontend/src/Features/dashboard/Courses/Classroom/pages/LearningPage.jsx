import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FluidBackground } from '../../../Home/components/FluidBackground';
import StatsHeader from '../components/StatsHeader';
import ModuleList from '../components/ModuleList';
import Leaderboard from '../components/Leaderboard';
import NavigationSidebar from '../components/NavigationSidebar';
import CertificateWrapper from '../../Cohort/component/CertificateWrapper';
import BookmarkList from "../../Classroom/components/BookmarkList";
import { fetchCourseProgress } from '../../Classroom/redux/courseProgress.slice';

const LearningPage = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('leaderboard');

  useEffect(() => { 
    if (courseId) dispatch(fetchCourseProgress(courseId)); 
  }, [dispatch, courseId]);

  const progress = useSelector((state) => state.courseProgress?.progress || 0);
  const isCompleted = progress >= 100;

  const renderCenterPanel = () => {
    switch (activeTab) {
      case "leaderboard": return <Leaderboard courseId={courseId} />;
      case "certificate": return <CertificateWrapper courseId={courseId} isCompleted={isCompleted} progress={progress} />;
      case "bookmarks": return <BookmarkList />;
      default: return (
        <div className="h-full glass rounded-[2rem] flex items-center justify-center text-text-secondary uppercase tracking-widest text-xs">
          Coming Soon
        </div>
      );
    }
  };

  return (
    <div className="h-screen w-full bg-bg text-text font-sans overflow-hidden flex flex-col lg:flex-row p-2 md:p-4 gap-4">
      <FluidBackground />

      {/* Navigation Column */}
      <div className="w-full lg:w-64 shrink-0 order-1 lg:order-3">
        <NavigationSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content Column (Stats & Modules) */}
      <div className="flex-1 flex flex-col gap-4 min-h-0 order-2 lg:order-1 overflow-hidden">
        <div className="shrink-0">
          <StatsHeader courseId={courseId} />
        </div>
        {/* FIX: Applied hide-scrollbar class to keep it scrollable but clean */}
        <div className="flex-1 overflow-y-auto hide-scrollbar rounded-[2rem]">
          <ModuleList courseId={courseId} />
        </div>
      </div>

      {/* Center Panel Column */}
      <div className="w-full lg:w-[400px] shrink-0 order-3 lg:order-2 h-[350px] md:h-[450px] lg:h-full overflow-hidden">
        <div className="h-full overflow-y-auto hide-scrollbar">
            {renderCenterPanel()}
        </div>
      </div>

      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        @media (max-width: 1024px) {
          .h-screen {
            height: auto;
            min-height: 100vh;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default LearningPage;