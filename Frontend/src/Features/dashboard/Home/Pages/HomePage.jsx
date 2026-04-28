import React, { useState } from "react"; // Add useState
import { motion, AnimatePresence } from "framer-motion"; // Note: change 'motion/react' to 'framer-motion' if needed
import { Zap, ArrowRight } from "lucide-react";

// Components
import Nav from "../../components/Nav";
import FluidBackground from "../../components/FluidBackground";
import { Media } from "../../components/Media";
import ZoomEffect from "../../components/CinematicPortal";
import TestimonialSection from "../../components/TestimonialSection";
import InfiniteScroll from "../../components/InfiniteScroll";
import InteractiveLoader from "../../components/InteractiveLoader"; // Import the loader
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

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="px-10 py-5 bg-accent text-[#131014] text-[19px] font-bold flex items-center gap-2 rounded-full hover:bg-[#e6cec8] transition-colors duration-300">
                      Start Journey
                      <ArrowRight className="w-5 h-5 stroke-[3]" />
                    </button>
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