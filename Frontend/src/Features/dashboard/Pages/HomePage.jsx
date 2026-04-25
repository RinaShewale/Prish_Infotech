import React from "react";
import { motion } from "motion/react";
import { Zap, ArrowRight } from "lucide-react";

// Components
import Nav from "../components/Nav";
import FluidBackground from "../components/FluidBackground";
import CourseCard from "../components/CourseCard";
import { Media } from "../components/Media";

/* ---------------- Home Page ---------------- */
export default function HomePage() {
  return (
    <div className="relative min-h-screen">

      {/* Background layers */}
      <FluidBackground />
      <Nav />

      <main className="pt-32 pb-24 px-6">

        {/* HERO */}
        <section className="max-w-7xl mx-auto py-20 text-center relative">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-8">
              <Zap className="w-3 h-3 fill-accent" />
              Next Cohort starting May 15
            </div>

            <h1 className="font-display text-7xl md:text-8xl leading-none tracking-tight mb-8">
              Crafting <span className="italic font-serif text-accent">Logic</span>
              <br />
              Designing Futures
            </h1>

            <p className="max-w-xl mx-auto text-lg md:text-xl text-text-secondary font-light leading-relaxed mb-12">
              Premium cohort-based courses for software architects and high-growth engineers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-10 py-5 bg-accent text-white rounded-lg text-sm font-medium flex items-center gap-2">
                Browse Courses
                <ArrowRight className="w-4 h-4" />
              </button>

              <button className="px-10 py-5 border border-border rounded-lg text-sm font-medium">
                View Schedule
              </button>
            </div>

          </motion.div>
        </section>
        <section className="max-w-7xl mx-auto py-24">
          <Media />
        </section>
          

        {/* COURSES */}
        <section className="max-w-7xl mx-auto py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CourseCard
              title="Advanced Systems Design"
              category="Architectural"
              desc="Scalability patterns and distributed systems."
              duration="12 Weeks"
            />
            <CourseCard
              title="Performance Engineering"
              category="Frontend"
              desc="Deep dive into rendering and optimization."
              duration="8 Weeks"
            />
            <CourseCard
              title="Zero Trust Security"
              category="Security"
              desc="Modern cloud security principles."
              duration="10 Weeks"
            />
          </div>
        </section>

      </main>
    </div>
  );
}