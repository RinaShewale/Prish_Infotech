import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Globe, Cpu, Rocket, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Shared Components
import { Nav } from "../../Home/components/Nav";
import { FluidBackground } from "../../Home/components/FluidBackground";
import { Footer } from "../../Home/components/Footer";

export default function AboutUs() {
  const containerRef = useRef(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GSAP 3D Tilt Effect
  useGSAP(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 15;
      const yPos = (clientY / window.innerHeight - 0.5) * 15;

      gsap.to(".about-3d-card", {
        rotationY: xPos,
        rotationX: -yPos,
        transformPerspective: 1200,
        duration: 1.2,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="bg-bg text-text selection:bg-accent/30 overflow-x-hidden perspective-1000">
      {/* BACKGROUND LAYERS */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <FluidBackground />
      </div>

      {/* TECHNICAL GRID */}
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(to_right,#2a232b_1px,transparent_1px),linear-gradient(to_bottom,#2a232b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      <div className="noise-bg z-[1]" />

      <Nav />

      <main className="relative z-10 pt-32 pb-24 px-6">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-[0.4em] mb-10 backdrop-blur-md">
              <SparkleIcon /> Our Philosophy
            </div>

            <h1 className="font-display text-6xl md:text-8xl lg:text-[110px] leading-[0.9] tracking-tight mb-12 text-white">
              Beyond <span className="italic font-serif text-accent">Code</span> <br />
              Into Reality
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary font-light leading-relaxed mb-16">
              Prish Infotech is a collective of creators, engineers, and designers dedicated to pushing the boundaries of digital experiences.
            </p>
          </motion.div>
        </section>

        {/* MISSION GRID */}
        <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mb-32">
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="about-3d-card p-12 bg-white/[0.02] border border-white/5 rounded-[48px] backdrop-blur-xl relative overflow-hidden group"
          >
            <h2 className="text-4xl font-display text-white mb-6">Our Vision</h2>
            <p className="text-text-secondary text-lg leading-relaxed font-light italic">
              "We believe in a world where functionality meets art. We don't just build software; we craft digital legacies that scale with human ambition."
            </p>
            <Globe className="absolute -right-10 -bottom-10 w-40 h-40 text-accent/5 group-hover:text-accent/10 transition-colors" />
          </motion.div>

          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="about-3d-card p-12 bg-accent/5 border border-accent/20 rounded-[48px] backdrop-blur-xl"
          >
            <h2 className="text-4xl font-display text-accent mb-6">Our Origin</h2>
            <p className="text-text-secondary text-lg leading-relaxed font-light">
              Based in <span className="text-white underline decoration-accent/30">Malegaon</span>, we serve global clients by building scalable infrastructure and immersive interfaces that define the next generation of the web.
            </p>
            <div className="mt-10 flex items-center gap-4 text-accent font-bold text-xs uppercase tracking-widest">
              Global Standards <ArrowUpRight className="w-4 h-4" />
            </div>
          </motion.div>
        </section>

        {/* STATS SECTION */}
        <section className="max-w-7xl mx-auto py-24 border-y border-white/5 relative overflow-hidden">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <StatItem number="5K+" label="Engineers Trained" />
              <StatItem number="120+" label="Global Projects" />
              <StatItem number="24/7" label="Support Mentorship" />
              <StatItem number="15+" label="Industry Partners" />
           </div>
        </section>

        {/* CORE VALUES */}
        <section className="max-w-7xl mx-auto py-32">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <h2 className="font-display text-5xl md:text-7xl text-white leading-none tracking-tighter">
              The Principles <br />
              That <span className="italic font-serif text-accent">Drive Us</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <ValueCard 
              icon={<Cpu />} 
              title="Architectural Excellence" 
              desc="We prioritize clean logic and scalable systems over quick fixes."
            />
            <ValueCard 
              icon={<Rocket />} 
              title="High-Growth Mindset" 
              desc="Engineering is not a job, it's a journey of continuous evolution."
            />
            <ValueCard 
              icon={<Zap />} 
              title="Immersive Design" 
              desc="User interfaces should be felt, not just seen. Beauty is functional."
            />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

// Sub-components for better organization
const StatItem = ({ number, label }) => (
  <div>
    <div className="text-4xl md:text-6xl font-display text-white mb-2">{number}</div>
    <div className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">{label}</div>
  </div>
);

const ValueCard = ({ icon, title, desc }) => (
  <div className="p-10 border border-white/5 rounded-3xl hover:border-accent/30 transition-colors bg-white/[0.01]">
    <div className="text-accent mb-6">{React.cloneElement(icon, { size: 32 })}</div>
    <h3 className="text-xl font-display text-white mb-4 uppercase tracking-wider">{title}</h3>
    <p className="text-text-secondary font-light text-sm leading-relaxed">{desc}</p>
  </div>
);

const SparkleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
    <path d="M6 0L7.34708 4.65292L12 6L7.34708 7.34708L6 12L4.65292 7.34708L0 6L4.65292 4.65292L6 0Z" fill="currentColor"/>
  </svg>
);