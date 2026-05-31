import React from 'react';
import { FluidBackground } from '../../../Home/components/FluidBackground';
import StatsHeader from '../components/StatsHeader';
import ModuleList from '../components/ModuleList';
import Leaderboard from '../components/Leaderboard';
import NavigationSidebar from '../components/NavigationSidebar';

const LearningPage = () => {
  return (
    <div className="h-screen w-full bg-bg text-text font-sans overflow-hidden flex p-4 gap-4">
      <FluidBackground />

      {/* 1. Main Content (Modules) */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <StatsHeader />
        <ModuleList />
      </div>

      {/* 2. Center Panel (Leaderboard) */}
      <div className="w-[400px] shrink-0">
        <Leaderboard />
      </div>

      {/* 3. Right Panel (Navigation) */}
      <div className="w-64 shrink-0">
        <NavigationSidebar />
      </div>
    </div>
  );
};

export default LearningPage;