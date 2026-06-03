import React, { useEffect } from 'react';
import { Search, Video, Headphones } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import EnrolledCourseCards from '../components/EnrolledCourseCards';
import NotificationPanel from '../components/NotificationPanel';
import StatsBento from '../components/StatsBento';
import { FluidBackground } from '../../../Home/components/FluidBackground';
import { getMyEnrollments } from '../../enrollment.slice';

const ClassroomPage = () => {
  const dispatch = useDispatch();
  const { enrollments = [], loading } = useSelector((state) => state.enrollment);

  useEffect(() => {
    dispatch(getMyEnrollments());
  }, [dispatch]);

  const courses = enrollments.map((enrollment) => {
    const course = enrollment.course || {};
    const progressValue = enrollment.progress ?? enrollment.courseProgress?.progress ?? 0;
    return {
      id: course._id || course.id,
      title: course.title || 'Untitled Course',
      instructor: course.instructor?.name || 'Unknown Instructor',
      progress: progressValue,
      image: course.thumbnail || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800',
    };
  });

  const overallProgress = courses.length > 0
    ? Math.round(courses.reduce((total, course) => total + (course.progress || 0), 0) / courses.length)
    : 0;

  return (
    /* h-screen + overflow-hidden locks the page height */
    <div className="h-screen w-full bg-[var(--color-bg)] text-text overflow-hidden font-sans relative">
      <FluidBackground />
      
      <div className="relative z-10 max-w-[1600px] mx-auto h-full flex flex-col px-4 sm:px-6 lg:px-10">
        
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 lg:py-8 gap-4 shrink-0">
          <h1 className="text-3xl font-display font-bold text-gradient">Classroom</h1>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-xs font-bold hover:bg-white/10 transition-all border border-white/5">
              <Video size={16} className="text-accent" /> Overview
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-xl text-xs font-bold hover:bg-accent/30 transition-all">
              <Headphones size={16} className="text-accent" /> Support
            </button>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 pb-6">
          {/* Main Section */}
          <section className="xl:col-span-8 flex flex-col min-h-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
              <h2 className="text-xl font-display font-bold">Your Enrolled Courses</h2>
              <div className="relative group w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/40" size={16} />
                <input type="text" placeholder="Search" className="w-full bg-white/5 border border-border/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent/50 transition-all" />
              </div>
            </div>

            {/* ONLY THIS DIV SCROLLS */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 scroll-smooth">
              {loading ? (
                <p className="text-center text-text-secondary py-10">Loading...</p>
              ) : courses.length === 0 ? (
                <p className="text-center text-text-secondary py-10">No courses found</p>
              ) : (
                courses.map((course, idx) => (
                  <EnrolledCourseCards key={course.id} course={course} index={idx} />
                ))
              )}
            </div>
          </section>

          {/* Sidebar - Remains fixed in its grid position */}
          <aside className="hidden xl:flex xl:col-span-4 flex-col gap-6 min-h-0">
            <NotificationPanel empty />
            <StatsBento progress={overallProgress} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ClassroomPage;