import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

// Components
import Nav from "../../components/Nav";
import FluidBackground from "../../components/FluidBackground";
import { Footer } from "../../components/Footer";
import CourseCard from "../Component/CourseCard";
import ComparisonSection from "../../components/ComparisonSection";
import { FAQSection } from "../../components/FAQSection";
import { CTASection } from "../../components/CTASection";

const COURSES_DATA = [
  {
    id: 1,
    title: "AI & Machine Learning Mastery Cohort",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    techTags: ["Gen-AI", "LLMs"],
    features: ["Product Building", "Community Access", "Gamified Learning"],
    price: "4,999",
    oldPrice: "11,999",
    isLive: true,
  },
  {
    id: 2,
    title: "Data Science with Generative AI",
    image:
      "https://images.unsplash.com/photo-1775896194071-f3311de4dabb?w=1200&auto=format&fit=crop&q=80",
    techTags: ["Python", "Data Viz"],
    features: ["1-on-1 Mentorship", "Job Portal", "Live Projects"],
    price: "3,499",
    oldPrice: "7,999",
    isLive: false,
  },
  {
    id: 3,
    title: "Full Stack Web Development 2024",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    techTags: ["React", "Node.js", "Docker"],
    features: ["Zero to Hero", "Open Source", "Interview Prep"],
    price: "5,999",
    oldPrice: "12,999",
    isLive: true,
  },
];

export default function CoursesPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      
      {/* ✅ Background Layer */}
      <FluidBackground />

      {/* ✅ Content Layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <Nav />

        <main className="pt-32 pb-24 px-6">
          
          {/* HERO SECTION */}
          <section className="max-w-7xl mx-auto py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-[0.2em] mb-8">
                <Zap className="w-3 h-3 fill-accent" />
                Next Cohort starting May 15
              </div>

              <h1 className="font-display text-6xl md:text-8xl leading-none tracking-tight mb-8 text-white">
                Master Your{" "}
                <span className="italic font-serif text-accent text-7xl md:text-9xl">
                  Craft
                </span>
              </h1>

              <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 font-light leading-relaxed mb-12">
                Premium cohort-based courses for{" "}
                <span className="text-white font-medium italic">
                  software architects
                </span>{" "}
                and high-growth engineers looking to dominate the industry.
              </p>
            </motion.div>
          </section>

          {/* COURSES GRID */}
          <section className="max-w-7xl mx-auto py-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
            >
              {COURSES_DATA.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </motion.div>
          </section>

          {/* COMPARISON */}
          <section className="mt-24">
            <ComparisonSection />
          </section>

          {/* FAQ */}
          <section className="mt-24">
            <FAQSection />
          </section>

          {/* CTA */}
          <section className="mt-24">
            <CTASection />
          </section>

        </main>

        <Footer />
      </motion.div>
    </div>
  );
}