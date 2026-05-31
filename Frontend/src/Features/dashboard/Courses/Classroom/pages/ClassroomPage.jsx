import React from 'react';
import { Search, ChevronDown, Video, Headphones, LayoutGrid } from 'lucide-react';
import EnrolledCourseCards from '../components/EnrolledCourseCards';
import NotificationPanel from '../components/NotificationPanel';
import StatsBento from '../components/StatsBento';
import { FluidBackground } from '../../../Home/components/FluidBackground';

const ClassroomPage = () => {
  const courses = [
    { id: 1, title: "Complete DSA with Java & Spring", instructor: "Deepak Kumar", progress: 42, image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800", date: "May 14, 2026" },
    { id: 2, title: "2.0 Job Ready AI Powered Cohort", instructor: "Harkirat Singh", progress: 68, image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=800", date: "Oct 29, 2025", hasDiscord: true },
  ];

  return (
    <div className="h-screen w-full bg-[var(--color-bg)] text-text overflow-hidden font-sans relative">
      <FluidBackground />

      <div className="relative z-10 max-w-[1600px] mx-auto h-full flex flex-col px-6 lg:px-10">
        {/* TOP HEADER */}
        <header className="flex items-center justify-between py-8 shrink-0">
          <h1 className="text-3xl font-display font-bold text-gradient">Classroom</h1>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
              <Video size={16} className="text-accent" /> Platform Overview
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-xl text-xs font-bold hover:bg-accent/30 transition-all">
              <Headphones size={16} className="text-accent" /> Support
            </button>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 pb-8">
          {/* LEFT: Course List */}
          <section className="xl:col-span-8 flex flex-col min-h-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-display font-bold">Your Enrolled Courses</h2>
              <div className="flex gap-3">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/40 group-focus-within:text-accent transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-white/5 border border-border/50 rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-accent/50 transition-all"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 glass border-border/50 rounded-xl text-xs font-bold text-text-secondary">
                  Sort By Oldest <ChevronDown size={14} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4">
              {courses.map((course, idx) => (
                <EnrolledCourseCards key={course.id} course={course} index={idx} />
              ))}
            </div>
          </section>

          {/* RIGHT: Sidebar */}
          <aside className="xl:col-span-4 flex flex-col gap-6 min-h-0">
            <div className="flex-1 min-h-0">
              <NotificationPanel empty />
            </div>

            <div className="flex-1 min-h-0">
              <StatsBento />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ClassroomPage;