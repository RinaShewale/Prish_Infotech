import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, CreditCard, Image, BarChart3, DollarSign, Settings, GraduationCap, Ticket } from 'lucide-react';

const Sidebar = () => {
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
    <aside className="w-64 border-r border-white/5 bg-[#050505] flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <h2 className="text-2xl font-display font-bold tracking-tighter">PRISH<span className="text-accent">.</span></h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/admin'}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-secondary hover:bg-white/5 hover:text-white'}
            `}
          >
            <link.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
export default Sidebar;