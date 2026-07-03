import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';

const AdminLayout = () => {
  // 1. Add state to manage sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-accent/30">
      
      {/* 2. Pass state and setter to Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 3. Pass the toggle function to the Header */}
        <AdminHeader toggleSidebar={() => setIsSidebarOpen(true)} />
        
        {/* Adjusted padding: p-4 for mobile, p-8 for desktop for better responsiveness */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          
          {/* Animated Noise Background */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;