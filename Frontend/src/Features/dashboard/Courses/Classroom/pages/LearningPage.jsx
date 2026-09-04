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
    <div className="min-h-screen lg:h-screen w-full bg-bg text-text font-sans overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row p-2 md:p-4 gap-4">
      <FluidBackground />

      {/* Navigation Column (Top on Mobile, Right on Desktop) */}
      <div className="w-full lg:w-64 shrink-0 order-1 lg:order-3">
        <NavigationSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content Column (Stats & Modules) */}
      {/* On mobile: Grows to fill space. On desktop: Flex-1 */}
      <div className="flex-1 flex flex-col gap-4 min-h-0 order-2 lg:order-1 overflow-hidden">
        <div className="shrink-0">
          <StatsHeader courseId={courseId} />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar rounded-[2rem]">
          <ModuleList courseId={courseId} />
        </div>
      </div>

      {/* Center Panel Column (Leaderboard/Cert/Bookmarks) */}
      {/* On mobile: Fixed height to prevent squishing. On desktop: Fixed width, full height */}
      <div className="w-full lg:w-[400px] shrink-0 order-3 lg:order-2 h-[350px] md:h-[450px] lg:h-full overflow-hidden">
        <div className="h-full min-h-0 overflow-y-auto custom-scrollbar">
            {renderCenterPanel()}
        </div>
      </div>

      {/* Custom Scrollbar CSS (Add to your global CSS or a styled component) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default LearningPage;