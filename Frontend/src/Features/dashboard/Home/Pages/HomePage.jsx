import React, { useState } from "react"; // Add useState
import { motion, AnimatePresence } from "framer-motion"; // Note: change 'motion/react' to 'framer-motion' if needed
import { Zap, ArrowUpRight } from "lucide-react";

// Components
import Nav from "../../components/Nav";
import FluidBackground from "../../components/FluidBackground";
import { Media } from "../../components/Media";
import ZoomEffect from "../../components/CinematicPortal";
import TestimonialSection from "../../components/TestimonialSection";
import InfiniteScroll from "../../components/InfiniteScroll";
import InteractiveLoader from "../../components/InteractiveLoader"; 
import { Footer } from "../../components/Footer";
import ComparisonSection from "../../components/ComparisonSection";
import { FAQSection } from "../../components/FAQSection";
import { CTASection } from "../../components/CTASection";




export default function HomePage() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading ? (
          <InteractiveLoader key="loader" onComplete={() => setLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative min-h-screen"
          >
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

                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{
                        backgroundColor: "#e6cec8",
                        color: "#131014",
                        scale: 1.05
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="group relative flex items-center justify-center gap-4 px-8 py-4 md:px-10 md:py-5 rounded-full bg-accent text-bg font-display font-bold text-lg md:text-xl tracking-tight shadow-xl whitespace-nowrap"
                    >
                      <span className="relative z-10">
                        Explore Courses
                      </span>

                      <div className="relative z-10 w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                        <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-bg" />
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              </section>

              <section className="Media max-w-7xl mx-auto py-24">
                <Media />
              </section>

              <section className="relative z-10">
                <InfiniteScroll />
              </section>

              <ZoomEffect />

              <section className="relative z-10">
                <TestimonialSection />
              </section>

              <section className="relative z-10">
                <ComparisonSection />
              </section>

              <section className="relative z-10">
                <FAQSection />
              </section>

              <section className="relative z-10">
                <CTASection />
              </section>


            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}