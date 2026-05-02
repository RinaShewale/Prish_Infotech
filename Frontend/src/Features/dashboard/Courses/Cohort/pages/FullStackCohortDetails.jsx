import React, { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, ArrowRight, Zap, CheckCircle2, 
  Code2, Server, Globe, Box,
  Sparkles, ShieldCheck, CreditCard
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import { FluidBackground } from "../../../components/FluidBackground";
import ComparisonSection from "../../../components/ComparisonSection";
import { FAQSection } from '../../../components/FAQSection';
import CertificationSection from '../component/CertificationSection';
import { PrishEnrollment } from '../component/PrishEnrollment';

// Data
import { COURSES_DATA } from "../../page/CoursePage";

gsap.registerPlugin(ScrollTrigger);

export const FullStackCohortDetails = () => {
  const containerRef = useRef(null);
  const syllabusRef = useRef(null);
  const heroRef = useRef(null);
  const enrollmentRef = useRef(null);

  const course = COURSES_DATA[2]; // Full Stack course
  const PRICE = course.price;
  const OLD_PRICE = course.oldPrice;

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Hero Entrance Animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
      
      tl.from(".hero-tag", { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 })
        .from(".hero-title", { y: 40, opacity: 0 }, "-=0.4")
        .from(".hero-desc", { y: 20, opacity: 0 }, "-=0.6")
        .from(".hero-stats", { y: 20, opacity: 0 }, "-=0.6")
        .from(".hero-btns", { y: 20, opacity: 0 }, "-=0.4")
        .from(".hero-image", { x: 40, opacity: 0, duration: 1.2 }, "-=1");

      // 2. Syllabus Scroll Animation
      gsap.from(".syllabus-card", {
        scrollTrigger: {
          trigger: syllabusRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out"
      });

      // 3. Sticky CTA Pop-in
      gsap.from(".sticky-cta", {
        scrollTrigger: {
          trigger: "body",
          start: "top -20%",
          toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const SYLLABUS = [
    {
      phase: "Phase 01",
      title: "Frontend Engineering",
      topics: ["React 19 & Next.js 15 Foundations", "Server Components & Suspense", "Advanced Tailwind & Framer Motion", "State Management (Zustand/Tanstack)"]
    },
    {
      phase: "Phase 02",
      title: "Scalable Backend Systems",
      topics: ["Node.js Performance Tuning", "PostgreSQL & Prisma Deep Dive", "Redis Caching Strategies", "REST vs GraphQL vs gRPC"]
    },
    {
      phase: "Phase 03",
      title: "Architecture & DevOps",
      topics: ["Dockerization & Orchestration", "CI/CD Pipelines (GitHub Actions)", "AWS/Vercel Deployment", "Microservices vs Monoliths"]
    },
    {
      phase: "Phase 04",
      title: "System Design & Security",
      topics: ["High Availability & Load Balancing", "OAuth2 & JWT Security Patterns", "Database Sharding & Replication", "Portfolio Building & Interview Prep"]
    }
  ];

  const FS_CERT_DATA = {
    mainHeading: "Secure Your",
    highlightedText: "Architect Status",
    description: "Proof of your ability to build, scale, and deploy enterprise-grade applications. This certification validates your journey from a developer to a full-stack architect.",
    certType: "Architect",
    skillsLearned: "MERN Stack Architecture, DevOps Automation, Distributed Systems, and Cloud Deployment",
  };

  return (
    <div ref={containerRef} className="text-text min-h-screen selection:bg-accent/30 overflow-x-hidden bg-bg">
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <FluidBackground />
      </div>

      <main className="relative z-10 pt-20 md:pt-32 pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        
        {/* --- HERO SECTION --- */}
        <section ref={heroRef} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 md:mb-32">
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
              {["Next.js", "Node.js", "Docker", "AWS"].map((tag) => (
                <span key={tag} className="hero-tag px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-[10px] font-bold tracking-[0.2em] uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="hero-title text-4xl sm:text-6xl md:text-7xl font-display font-bold text-white mb-6 leading-[1.1] md:leading-[0.9] tracking-tighter">
              {course.heading}
              <span className="italic font-serif text-accent block">{course.subheading}</span>
            </h1>

            <p className="hero-desc text-lg md:text-xl text-text-secondary mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
              {course.description}
            </p>

            <div className="hero-stats flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-10 mb-10">
              <div className="text-center sm:text-left">
                <span className="text-[10px] text-accent font-bold uppercase tracking-widest mb-2 block">Starting at</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-display font-bold text-white">₹{PRICE}</span>
                  <span className="text-lg md:text-xl text-text-secondary line-through opacity-40">₹{OLD_PRICE}</span>
                </div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-white/10" />
              <div className="text-center sm:text-left">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2 block">Cohort Status</span>
                <p className="text-lg md:text-xl font-display text-white italic flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   June 1st Batch Open
                </p>
              </div>
            </div>

            <div className="hero-btns flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-accent text-bg font-bold rounded-2xl flex items-center justify-center gap-4 hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(var(--accent-rgb),0.3)]">
                ENROLL AT — ₹{PRICE} <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-4 hover:bg-white/10 transition-all">
                VIEW CURRICULUM
              </button>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="hero-image order-1 lg:order-2 relative rounded-[32px] md:rounded-[40px] overflow-hidden border border-white/10 shadow-2xl aspect-square max-w-lg mx-auto lg:max-w-none group">
            <div className="absolute top-0 w-full bg-white/10 px-6 py-4 flex gap-2 border-b border-white/5 z-20 backdrop-blur-md">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <img 
              src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
              alt="Full Stack Development" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-left">
              <div className="bg-accent/90 text-bg px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 inline-block">Industry Standard</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">MERN + DevOps Stack</h3>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:scale-110 transition-transform">
                <Play className="fill-white w-6 h-6 ml-1" />
              </div>
            </div>
          </div>
        </section>

        {/* --- SYLLABUS SECTION --- */}
        <section ref={syllabusRef} className="mb-24 md:mb-44">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">The <span className="text-accent italic">Curriculum</span></h2>
            <p className="text-text-secondary px-4 max-w-2xl mx-auto">A structured 12-week blueprint to take you from a developer to a high-performing Senior Systems Engineer.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 text-left">
            {SYLLABUS.map((item, idx) => (
              <div key={idx} className="syllabus-card p-6 md:p-10 bg-[#111] rounded-[32px] md:rounded-[40px] border border-white/5 relative overflow-hidden group hover:border-accent/20 transition-colors">
                <div className="absolute top-0 right-0 p-6 text-6xl font-black text-white/[0.02] group-hover:text-accent/[0.05] transition-colors">
                  0{idx + 1}
                </div>
                <span className="text-accent font-bold text-xs uppercase tracking-widest mb-4 block">{item.phase}</span>
                <h4 className="text-xl md:text-2xl font-bold text-white mb-6">{item.title}</h4>
                <ul className="space-y-4">
                  {item.topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary group-hover:text-text transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-accent/40 mt-0.5 shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-24 md:mb-44">
          <ComparisonSection />
        </section>

        {/* --- FINAL CALL TO ACTION --- */}
        <section className="mb-24 md:mb-44 bg-accent/5 border border-accent/10 rounded-[40px] p-8 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-30" />
            <Sparkles className="w-12 h-12 text-accent mx-auto mb-8 opacity-50" />
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Ready to Build Systems that Scale?</h2>
            <p className="text-text-secondary text-lg md:text-xl mb-12 max-w-2xl mx-auto">Join the next generation of Full Stack Architects and transform your career trajectory.</p>
            
            <div className="inline-flex flex-col items-center gap-6">
                <button 
                  onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-12 py-6 bg-accent text-bg font-bold rounded-2xl flex items-center gap-4 hover:scale-105 transition-all text-lg shadow-xl shadow-accent/20">
                    START LEARNING NOW — ₹{PRICE}
                </button>
                <div className="flex items-center gap-8 text-xs text-text-secondary font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-accent" /> Architect Certification</span>
                    <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-accent" /> 0% EMI Options Available</span>
                </div>
            </div>
        </section>

        <div className="mb-24 md:mb-44">
          <CertificationSection data={FS_CERT_DATA} />
        </div>

        <section className="mb-24 md:mb-44">
          <FAQSection />
        </section>

        {/* ENROLLMENT SECTION */}
        <section ref={enrollmentRef} className="mb-24 md:mb-44">
          <PrishEnrollment 
            courseData={course}
            title={course.title}
            price={course.price}
            oldPrice={course.oldPrice}
          />
        </section>

      </main>

      {/* STICKY ENROLL */}
      <div className="sticky-cta fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-2xl">
        <div className="bg-[#111]/80 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-full p-2 flex items-center justify-between shadow-2xl">
          <div className="pl-6 md:pl-10 text-left">
            <div className="flex items-baseline gap-2">
                <span className="text-xl md:text-2xl font-display font-bold text-white">₹{PRICE}</span>
                <span className="text-[10px] text-accent font-bold uppercase tracking-tight italic">Starting Price</span>
            </div>
            <p className="hidden md:block text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Limited Seats for June 1st Batch</p>
          </div>
          <button 
            onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-accent text-bg px-8 md:px-12 py-3 md:py-4 rounded-xl md:rounded-full font-bold text-xs md:text-sm hover:brightness-110 transition-all whitespace-nowrap shadow-lg shadow-accent/20">
            ENROLL NOW <ArrowRight className="inline-block ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};