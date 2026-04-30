import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Zap, ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Components
import {Nav} from "../../components/Nav";
import {FluidBackground} from "../../components/FluidBackground";
import { Footer } from "../../components/Footer";
import BootcampComparison from "../Component/BootcampComparison";
import BootcampCards from "../Component/BootcampCards";
import BootcampVideo from "../Component/BootcampVideo";
import CinematicBootcamp from "../Component/CinematicBootcamp";
import AdmissionForm from "../Component/AdmissionForm";
import { BootcampPricing } from "../Component/BootcampPricing";
import { BootcampCertification } from "../Component/BootcampCertification";
import SyllabusSection from "../Component/SyllabusSection";


gsap.registerPlugin(ScrollTrigger);

const graduates = [
  { id: 1, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80" },
  { id: 2, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80" },
  { id: 3, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80" },
  { id: 4, img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&q=80" },
];

export default function BootcampPage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // GSAP 3D Mouse Follow Effect for Hero
  useGSAP(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20;
      const yPos = (clientY / window.innerHeight - 0.5) * 20;

      gsap.to(".hero-3d-content", {
        rotationY: xPos,
        rotationX: -yPos,
        transformPerspective: 1000,
        duration: 1.2,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: containerRef });

  // Floating Particles Animation
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
    <div ref={containerRef} className="relative min-h-screen bg-bg text-text selection:bg-accent/30 overflow-x-hidden perspective-1000">
      {/* BACKGROUND LAYERS */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <FluidBackground />
      </div>

      {/* 3D FLOATING ELEMENTS */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="floating-orb absolute top-1/4 left-10 w-32 h-32 bg-accent/10 rounded-full blur-[80px]" />
        <div className="floating-orb absolute top-3/4 right-10 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="noise-bg z-[1]" />

      {/* ENHANCED GRID */}
      <div className="fixed inset-0 z-[2] bg-[linear-gradient(to_right,#2a232b_1px,transparent_1px),linear-gradient(to_bottom,#2a232b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <Nav />

      <main className="relative z-10 pt-32">

        {/* HERO SECTION */}
        <section ref={heroRef} className="max-w-7xl mx-auto py-20 text-center relative px-4 hero-3d-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* SOCIAL PROOF BADGE */}
            <div className="inline-flex items-center gap-4 px-3 py-2 rounded-full bg-accent/5 border border-accent/20 mb-10 pr-6 backdrop-blur-md shadow-inner-white">
              <div className="flex -space-x-3 overflow-hidden">
                {graduates.map((grad, i) => (
                  <motion.img
                    key={grad.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    src={grad.img}
                    alt="Engineer"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-bg object-cover"
                  />
                ))}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-bg bg-bg2 flex items-center justify-center text-[10px] font-bold text-accent shadow-lg">
                  +1K
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(230,206,200,0.8)]" />
                <span className="text-[10px] md:text-xs font-display font-bold uppercase tracking-[0.2em] text-accent/80">
                  Engineering League
                </span>
              </div>
            </div>

            {/* MAIN HEADING - 3D Text Reveal */}
            <h1 ref={titleRef} className="font-display text-6xl md:text-8xl lg:text-[110px] leading-[0.9] tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-text to-text/50">
              The Prish <span className="italic font-serif text-accent block md:inline">Incubator</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary font-light leading-relaxed mb-12 px-4">
              An elite project-based journey designed to transform ambitious developers
              into <span className="text-text font-medium italic underline decoration-accent/30">senior-ready</span> software architects.
            </p>

            {/* MAGNETIC CTA */}
            <div className="flex justify-center group">
              <motion.button
                onClick={() => document.getElementById('apply').scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex items-center justify-center gap-4 px-12 py-6 rounded-full bg-accent text-bg font-display font-bold text-lg md:text-xl tracking-tight shadow-[0_20px_50px_rgba(230,206,200,0.2)] overflow-hidden"
              >
                <span className="relative z-10">Apply For Admission</span>
                <div className="relative z-10 w-10 h-10 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                  <ArrowUpRight className="w-6 h-6 text-bg" />
                </div>
                {/* Magnetic Shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* CONTENT SECTIONS */}
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* VIDEO - With 3D Perspective Reveal */}
          <ScrollReveal rotateX={15}>
            <section className="py-24">
              <div className="glow-card glass rounded-[40px] p-2 md:p-3 bg-gradient-to-br from-white/10 to-transparent border-white/10 shadow-2xl">
                <div className="rounded-[32px] overflow-hidden bg-bg2 relative group">
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <BootcampVideo />
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* TRACKS */}
          <section className="py-24">
            <div className="flex flex-col items-center text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="inline-block px-4 py-1 border border-accent/20 bg-accent/5">
                  <span className="text-accent text-[8px] md:text-[10px] tracking-[0.4em] uppercase font-bold">
                    Specification
                  </span>
                </div>
              </motion.div>

              <h2 className="font-display text-5xl md:text-7xl mb-6">
                Choose Your Track
              </h2>

              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-accent/40 to-transparent rounded-full" />

            </div>
            <BootcampCards />
          </section>

          <section className="py-24 mt-9">
             <div className="flex flex-col items-center text-center mb-16"> 
              <SyllabusSection />
             </div>
          </section>  

          {/* COMPARISON - Glass Morphism update */}
          <ScrollReveal y={30}>
            <section className="py-24">
              <div className="glass glow-card rounded-[48px] p-8 md:p-16 border-white/5 overflow-hidden bg-white/[0.02] backdrop-blur-2xl">
                <BootcampComparison />
              </div>
            </section>
          </ScrollReveal>

        </div>
        <BootcampCertification /> 

        {/* PRICING - With Highlighted Plan */}
        <BootcampPricing />

        {/* CINEMATIC SECTION */}
        <section className="relative mt-32">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-bg via-bg/80 to-transparent z-10" />
          <CinematicBootcamp />
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-bg via-bg/80 to-transparent z-10" />
        </section>



        {/* Addmission SECTION */}
        <section id="apply" className="relative mt-32">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-bg via-bg/80 to-transparent z-10" />
          <AdmissionForm />
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-bg via-bg/80 to-transparent z-10" />
        </section>
      </main>

      <Footer />
    </div>
  );
}

/**
 * Enhanced Scroll Reveal using GSAP & Framer Motion
 * Adds a 3D "Flip" effect as items enter the viewport
 */
function ScrollReveal({ children, rotateX = 10, y = 50 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: y,
        rotateX: rotateX,
        transformPerspective: 1000
      }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        rotateX: 0
      } : {}}
      transition={{
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.1
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}