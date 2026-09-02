import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-accent/30">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader toggleSidebar={() => setIsSidebarOpen(true)} />

        <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8">
          <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;