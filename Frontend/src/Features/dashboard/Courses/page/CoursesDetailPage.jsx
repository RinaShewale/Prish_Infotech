import React, { useLayoutEffect, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useCourse } from '../hooks/useCourse';

// Components
import { AICohortDetails } from '../Cohort/pages/AICohortDetails';
import { DataScienceCohortDetails } from '../Cohort/pages/DataScienceCohortDetails';
import { FullStackCohortDetails } from '../Cohort/pages/FullStackCohortDetails';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';
import { FluidBackground } from "../../components/FluidBackground";

export const CourseDetailPage = () => {
  const { slug } = useParams();
  const { handleGetCourses } = useCourse();
  const { courses, loading } = useSelector((state) => state.course);

  useEffect(() => {
    if (courses.length === 0) handleGetCourses();
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Helper to generate slug exactly as CourseCard does
  const generateSlug = (title) => title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

  const currentCourse = courses.find(c => generateSlug(c.title) === slug);

  const renderCohort = () => {
    if (loading) return <div className="h-[60vh] flex items-center justify-center text-accent">Loading Cohort...</div>;
    
    if (!currentCourse) return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-white">
        <h2 className="font-display text-4xl mb-4">Cohort Not Found</h2>
        <p className="text-white/50">The requested course does not exist.</p>
      </div>
    );

    const title = currentCourse.title.toLowerCase();
    const category = currentCourse.category?.toLowerCase() || "";

    // Pass the specific currentCourse as a prop
    if (title.includes('ai') || category.includes('ai') || title.includes('machine')) {
      return <AICohortDetails courseData={currentCourse} />;
    } else if (title.includes('data') || category.includes('data')) {
      return <DataScienceCohortDetails courseData={currentCourse} />;
    } else {
      return <FullStackCohortDetails courseData={currentCourse} />;
    }
  };

  return (
    <div className="bg-bg min-h-screen relative overflow-x-hidden selection:bg-accent/30">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30"><FluidBackground /></div>
      <div className="noise-bg z-[1] fixed inset-0 pointer-events-none" />
      <div className="relative z-50"><Nav /></div>
      <main className="relative z-10 pt-20">
        <AnimatePresence mode="wait">
          <motion.div key={slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
            {renderCohort()}
          </motion.div>
        </AnimatePresence>
      </main>
      <div className="relative z-10"><Footer /></div>
    </div>
  );
};