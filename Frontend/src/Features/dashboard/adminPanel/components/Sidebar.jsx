import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, Users, CreditCard, Image, 
  BarChart3, DollarSign, Settings, GraduationCap, Ticket, X, ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Courses', path: '/admin/courses', icon: BookOpen },
    { name: 'Bootcamps', path: '/admin/bootcamps', icon: GraduationCap },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Requested Calls', path: '/admin/users', icon: Users },
    { name: 'Enrollments', path: '/admin/enrollments', icon: CreditCard },
    { name: 'Payments', path: '/admin/payments', icon: DollarSign },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Media Assets', path: '/admin/media', icon: Image },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-[80] w-72 bg-[#050505] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        <div className="h-16 lg:h-20 px-8 flex items-center justify-between border-b border-white/5">
          <h2 className="text-2xl font-bold tracking-tighter text-white">
            PRISH<span className="text-accent">.</span>
          </h2>
          {/* Close Sidebar on Mobile */}
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-gray-500">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 opacity-60">Admin Menu</p>
          </div>

          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/admin'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-accent/10 text-accent ring-1 ring-accent/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <link.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm font-medium flex-1">{link.name}</span>
              <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
              
              <div className={`absolute left-0 w-1 h-5 bg-accent rounded-r-full transition-all duration-300 ${
                (location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path))) 
                ? 'opacity-100' : 'opacity-0'
              }`} />
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 mt-auto">
          <p className="text-[10px] text-gray-600 text-center font-medium uppercase tracking-widest">
            v1.0.4 Premium
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;