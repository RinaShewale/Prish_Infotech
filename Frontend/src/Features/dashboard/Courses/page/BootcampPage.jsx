import React, { useRef, useLayoutEffect, useEffect } from "react";
import { motion, useScroll, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis"; // Import lenis

// Components
import { Nav } from "../../Home/components/Nav";
import { FluidBackground } from "../../Home/components/FluidBackground";
import { Footer } from "../../Home/components/Footer";
import BootcampComparison from "../Component/BootcampComparison";
import BootcampCards from "../Component/BootcampCards";
import BootcampVideo from "../Component/BootcampVideo";
import CinematicBootcamp from "../Component/CinematicBootcamp";
import AdmissionForm from "../Component/AdmissionForm";
import { BootcampPricing } from "../Component/BootcampPricing";
import { BootcampCertification } from "../Component/BootcampCertification";
import SyllabusSection from "../Component/SyllabusSection";
import { useMedia } from "../../Home/components/hooks/useMedia";

gsap.registerPlugin(ScrollTrigger);

export default function BootcampPage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const { media } = useMedia();

  // 1. SMOOTH SCROLL IMPLEMENTATION (LENIS)
  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smoothHover: true,
      smoothWheel: true,
      touchMultiplier: 2, // Ensures smooth scroll feels good on mobile too
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Scroll to top on load
    window.scrollTo(0, 0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // 2. GSAP 3D Mouse Follow Effect (Desktop Only for Performance)
  useGSAP(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 15;
      const yPos = (clientY / window.innerHeight - 0.5) * 15;

      gsap.to(".hero-3d-content", {
        rotationY: xPos,
        rotationX: -yPos,
        transformPerspective: 1200,
        duration: 1.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: containerRef });

  // 3. Floating Particles Animation
  useGSAP(() => {
    gsap.to(".floating-orb", {
      y: -40,
      x: 20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5
    });
  });

  return (
    <div ref={containerRef} className="relative min-h-screen bg-bg text-text selection:bg-accent/30 overflow-x-hidden">
      {/* BACKGROUND LAYERS */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <FluidBackground />
      </div>

      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="floating-orb absolute top-1/4 left-10 w-32 h-32 bg-accent/10 rounded-full blur-[80px]" />
        <div className="floating-orb absolute top-3/4 right-10 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="noise-bg z-[1]" />

      <div className="fixed inset-0 z-[2] bg-[linear-gradient(to_right,#2a232b_1px,transparent_1px),linear-gradient(to_bottom,#2a232b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <Nav />

      <main className="relative z-10 pt-20 md:pt-32">
        {/* HERO SECTION */}
        <section ref={heroRef} className="max-w-7xl mx-auto py-12 md:py-20 text-center relative px-4 hero-3d-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* SOCIAL PROOF BADGE */}
            <div className="inline-flex items-center gap-3 md:gap-4 px-3 py-2 rounded-full bg-accent/5 border border-accent/20 mb-8 md:mb-10 pr-6 backdrop-blur-md shadow-inner-white">
              <div className="flex -space-x-2 md:-space-x-3 overflow-hidden">
                {[media?.studentImg1, media?.studentImg2, media?.studentImg3, media?.studentImg4].filter(Boolean).map((img, i) => (
                  <motion.img
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    src={img}
                    alt="Student"
                    className="w-7 h-7 md:w-10 md:h-10 rounded-full border-2 border-bg object-cover"
                  />
                ))}
                <div className="w-7 h-7 md:w-10 md:h-10 rounded-full border-2 border-bg bg-bg2 flex items-center justify-center text-[8px] md:text-[10px] font-bold text-accent">
                  +1K
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[9px] md:text-xs font-display font-bold uppercase tracking-[0.2em] text-accent/80">
                  Engineering League
                </span>
              </div>
            </div>

            <h1 ref={titleRef} className="font-display text-5xl md:text-8xl lg:text-[110px] leading-[1] md:leading-[0.9] tracking-tighter mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-b from-text to-text/50">
              The Prish <span className="italic font-serif text-accent block md:inline">Incubator</span>
            </h1>

            <p className="max-w-2xl mx-auto text-base md:text-xl text-text-secondary font-light leading-relaxed mb-10 md:mb-12 px-4">
              An elite project-based journey designed to transform ambitious developers
              into <span className="text-text font-medium italic underline decoration-accent/30">senior-ready</span> software architects.
            </p>

            <div className="flex justify-center">
              <motion.button
                onClick={() => document.getElementById('apply').scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex items-center justify-center gap-4 px-8 md:px-12 py-5 md:py-6 rounded-full bg-accent text-bg font-display font-bold text-base md:text-xl tracking-tight shadow-xl overflow-hidden"
              >
                <span className="relative z-10">Apply For Admission</span>
                <div className="relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                  <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-bg" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* SECTIONS */}
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <ScrollReveal rotateX={15}>
            <section className="py-12 md:py-24">
              <div className="glass rounded-[30px] md:rounded-[40px] p-1.5 md:p-3 bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-2xl">
                <div className="rounded-[24px] md:rounded-[32px] overflow-hidden bg-bg2 relative group">
                  <BootcampVideo />
                </div>
              </div>
            </section>
          </ScrollReveal>

          <section className="py-12 md:py-24">
            <div className="flex flex-col items-center text-center mb-12 md:mb-16">
              <div className="inline-block px-4 py-1 border border-accent/20 bg-accent/5 mb-6">
                <span className="text-accent text-[8px] md:text-[10px] tracking-[0.4em] uppercase font-bold">Specification</span>
              </div>
              <h2 className="font-display text-4xl md:text-7xl mb-6">Choose Your Track</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-accent/40 to-transparent rounded-full" />
            </div>
            <BootcampCards />
          </section>

          <section className="py-12 md:py-24">
             <SyllabusSection />
          </section>

          <ScrollReveal y={30}>
            <section className="py-12 md:py-24">
              <div className="glass rounded-[30px] md:rounded-[48px] p-6 md:p-16 border border-white/5 bg-white/[0.02] backdrop-blur-2xl">
                <BootcampComparison />
              </div>
            </section>
          </ScrollReveal>
        </div>

        <BootcampCertification />
        <BootcampPricing />

        <section className="relative mt-20 md:mt-32">
          <div className="absolute top-0 left-0 w-full h-32 md:h-64 bg-gradient-to-b from-bg to-transparent z-10" />
          <CinematicBootcamp />
          <div className="absolute bottom-0 left-0 w-full h-32 md:h-64 bg-gradient-to-t from-bg to-transparent z-10" />
        </section>

        <section id="apply" className="relative mt-20 md:mt-32">
          <AdmissionForm />
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ScrollReveal({ children, rotateX = 10, y = 50 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: y, rotateX: rotateX, transformPerspective: 1000 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}