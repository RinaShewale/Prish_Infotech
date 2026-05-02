import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import { AICohortDetails } from '../Cohort/pages/AICohortDetails';
import { DataScienceCohortDetails } from '../Cohort/pages/DataScienceCohortDetails';
import { FullStackCohortDetails } from '../Cohort/pages/FullStackCohortDetails';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';
import { FluidBackground } from "../../components/FluidBackground";

export const CourseDetailPage = () => {
  const { slug } = useParams();

  // Scroll to top on load or slug change
  useEffect(() => { 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }, [slug]);

  const renderCohort = () => {
    switch (slug) {
      case 'ai-ml-mastery': return <AICohortDetails />;
      case 'data-science': return <DataScienceCohortDetails />;
      case 'full-stack': return <FullStackCohortDetails />;
      default: return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-white">
          <h2 className="font-display text-4xl mb-4">Cohort Not Found</h2>
          <p className="text-text-secondary">The requested course does not exist.</p>
        </div>
      );
    }
  };

  return (
    <div className="bg-bg min-h-screen relative overflow-x-hidden selection:bg-accent/30">
      
      {/* 1. ATMOSPHERIC BACKGROUND LAYERS (Consistent with CoursesPage) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <FluidBackground />
      </div>
      
      {/* Technical Grid Overlay */}
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(to_right,#2a232b_1px,transparent_1px),linear-gradient(to_bottom,#2a232b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10 pointer-events-none" />
      
      {/* Noise Texture */}
      <div className="noise-bg z-[1] fixed inset-0 pointer-events-none" />

      {/* 2. NAVIGATION */}
      <div className="relative z-50">
        <Nav />
      </div>

      {/* 3. MAIN CONTENT STAGE */}
      <main className="relative z-10 pt-20">
        
        {/* Subtle top indicator/breadcrumb line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderCohort()}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* 4. FOOTER */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Background Orbs for Depth */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
};

