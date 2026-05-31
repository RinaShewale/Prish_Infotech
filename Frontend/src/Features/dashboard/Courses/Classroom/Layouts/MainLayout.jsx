import React from 'react';
import { Outlet } from 'react-router-dom';
import { Nav } from '../../../Home/components/Nav';

const MainLayout = () => {
  return (
    <div className="min-h-screen w-full bg-[#0A0A0B] text-white selection:bg-accent/30">
      <Nav />
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
        <div className="noise-bg" />
      </div>

      {/* Content Area */}
      <main className="relative z-10 pt-32 pb-10 px-6 max-w-[1600px] mx-auto h-screen flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;