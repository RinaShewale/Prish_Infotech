import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-accent/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          {/* Animated Noise Background for Admin */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;