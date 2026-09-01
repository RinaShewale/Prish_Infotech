import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Zap, ArrowUpRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Components
import { Nav } from "../../Home/components/Nav";
import { FluidBackground } from "../../Home/components/FluidBackground";
import { Media } from "../../Home/components/Media";
import ZoomEffect from "../../Home/components/CinematicPortal";
import { InfiniteScroll } from "../../Home/components/InfiniteScroll";
import InteractiveLoader from "../../Home/components/InteractiveLoader";
import { Footer } from "../../Home/components/Footer";
import ComparisonSection from "../../Home/components/ComparisonSection";
import { FAQSection } from "../../Home/components/FAQSection";
import { CTASection } from "../../Home/components/CTASection";
import { TestimonialSection } from "../../Home/components/TestimonialSection";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

let hasSeenLoader = false;

export default function HomePage() {

  const { courses } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(!hasSeenLoader);
  const containerRef = useRef(null);

  const handleLoaderComplete = () => {
    hasSeenLoader = true;
    setLoading(false);
  };

  

  const navigate = useNavigate();

  // GSAP 3D Mouse Follow Effect
  useGSAP(() => {
    if (loading) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 15;
      const yPos = (clientY / window.innerHeight - 0.5) * 15;

      gsap.to(".hero-3d-content", {
        rotationY: xPos,
        rotationX: -yPos,
        transformPerspective: 1200,
        duration: 1.2,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [loading]);

  return (
    <div ref={containerRef} className="bg-bg text-text selection:bg-accent/30 overflow-x-hidden perspective-1000">
      <AnimatePresence mode="wait">
        {loading ? (
          <InteractiveLoader key="loader" onComplete={handleLoaderComplete} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative min-h-screen"
          >
            {/* BACKGROUND LAYERS */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
              <FluidBackground />
            </div>

            {/* TECHNICAL GRID & DEPTH ORBS */}
            <div className="fixed inset-0 z-[1] bg-[linear-gradient(to_right,#2a232b_1px,transparent_1px),linear-gradient(to_bottom,#2a232b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px]" />
            </div>

            <div className="noise-bg z-[1]" />

            <Nav />

            <main className="relative z-10 pt-32 pb-24 px-6">

              {/* HERO SECTION - 3D Content */}
              <section className="max-w-7xl mx-auto py-20 text-center relative hero-3d-content">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/20 text-accent text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-10 backdrop-blur-md">
                    <Zap className="w-3 h-3 fill-accent animate-pulse" />
                    Next Cohort starting {
                      courses?.[0]?.cohortStartDate
                        ? new Date(courses[0].cohortStartDate).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                        })
                        : "Coming Soon"
                    }
                  </div>

                  {/* Updated Heading to match scale of other pages */}
                  <h1 className="font-display text-6xl md:text-8xl lg:text-[110px] leading-[0.9] tracking-tight mb-10 text-white">
                    Crafting <span className="italic font-serif text-accent">Logic</span>
                    <br />
                    Designing Futures
                  </h1>

                  <p className="max-w-xl mx-auto text-lg md:text-xl text-text-secondary font-light leading-relaxed mb-14 px-4">
                    Premium cohort-based courses for <span className="text-white italic underline decoration-accent/30">software architects</span> and high-growth engineers.
                  </p>

                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => navigate("/courses")}
                      className="group relative flex items-center justify-center gap-4 px-10 py-5 md:px-12 md:py-6 rounded-full bg-accent text-bg font-display font-bold text-lg md:text-xl tracking-tight shadow-[0_20px_50px_rgba(230,206,200,0.2)] overflow-hidden"
                    >
                      <span className="relative z-10">Explore Courses</span>

                      <div className="relative z-10 w-9 h-9 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                        <ArrowUpRight className="w-6 h-6 text-bg" />
                      </div>

                      {/* Gloss Shine Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </motion.button>
                  </div>
                </motion.div>
              </section>

              {/* MEDIA SECTION - With Perspective Reveal */}
              <ScrollReveal rotateX={10}>
                <section className="Media max-w-7xl mx-auto py-24">
                  <div className="glass p-2 rounded-[40px] border-white/5 bg-white/[0.01]">
                    <Media />
                  </div>
                </section>
              </ScrollReveal>

              <section className="relative z-10 py-12">
                <InfiniteScroll />
              </section>

              {/* Portal Effect remains cinematic */}
              <ZoomEffect />



              <ScrollReveal y={40}>
                <section className="relative z-10 py-24">
                  <TestimonialSection />
                </section>
              </ScrollReveal>

              <ScrollReveal rotateX={-10}>
                <section className="relative z-10 py-24">
                  <div className="glass rounded-[48px] p-1 border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                    <ComparisonSection />
                  </div>
                </section>
              </ScrollReveal>

              <ScrollReveal>
                <section className="relative z-10 py-24">
                  <FAQSection />
                </section>
              </ScrollReveal>

              <ScrollReveal scale={0.9}>
                <section className="relative z-10 pt-24">
                  <CTASection />
                </section>
              </ScrollReveal>

            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Scroll Reveal Helper for 3D entry
function ScrollReveal({ children, rotateX = 0, y = 50, scale = 1 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: y,
        rotateX: rotateX,
        scale: scale,
        transformPerspective: 1200
      }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1
      } : {}}
      transition={{
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1]
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}