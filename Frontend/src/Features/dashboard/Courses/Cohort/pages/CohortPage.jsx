import React, { useRef, useLayoutEffect, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  ArrowRight, CheckCircle2, Terminal, MousePointer2, Download, ChevronDown
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis'; 
import { motion, AnimatePresence } from 'framer-motion';

// Components
import { FluidBackground } from "../../../Home/components/FluidBackground";
import ComparisonSection from "../../../Home/components/ComparisonSection";
import { FAQSection } from '../../../Home/components/FAQSection';
import CertificationSection from '../component/CertificationSection';
import { PrishEnrollment } from '../component/PrishEnrollment';

// Hooks
import { useCertificate } from '../../hooks/useCertificate';
import { useEnrollment } from "../../hooks/useEnrollment";

gsap.registerPlugin(ScrollTrigger);

// ======================================================
// 🧩 INTERNAL COMPONENT: SYLLABUS CARD (BORDERLESS)
// ======================================================
const SyllabusCard = ({ section, isOpen, toggle, index }) => {
  return (
    <div className="group py-8 border-b border-white/5 last:border-0 transition-all">
      <button 
        onClick={toggle}
        className="w-full flex items-start justify-between text-left gap-8 group"
      >
        <div className="flex gap-6 md:gap-10">
          <span className="text-accent font-mono text-sm pt-1 opacity-50 group-hover:opacity-100 transition-opacity">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className={`text-xl md:text-3xl font-bold tracking-tight transition-colors ${isOpen ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
              {section.title}
            </h3>
            <p className="text-text-secondary/40 text-sm md:text-base mt-2 font-light max-w-2xl">
              {section.description}
            </p>
          </div>
        </div>
        <div className={`mt-2 p-2 rounded-full transition-transform duration-500 ${isOpen ? 'rotate-180 bg-accent text-bg' : 'text-white/20'}`}>
          <ChevronDown size={20} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-[52px] md:pl-[76px] pt-6 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.lessons?.map((lesson, i) => (
                <div key={i} className="flex items-center gap-3 text-white/60 hover:text-accent transition-colors">
                  <div className="w-1 h-1 rounded-full bg-accent" />
                  <span className="text-sm font-medium">{lesson}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CohortPage = ({ courseData }) => {
  const containerRef = useRef(null);
  const syllabusRef = useRef(null);
  const enrollmentRef = useRef(null);
  const heroImageRef = useRef(null);
  
  const [activeIndex, setActiveIndex] = useState(null);

  // ======================================================
  // 🚀 SMOOTH SCROLL INITIALIZATION (LENIS)
  // ======================================================
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // ======================================================
  // 🔐 DATA & AUTH
  // ======================================================
  const { user } = useSelector((state) => state.auth);
  const { myCertificates, getMyCertificates } = useCertificate();
  const { enrollments } = useEnrollment();

  useEffect(() => { getMyCertificates(); }, []);

  const currentUserCertificate = useMemo(() => {
    if (!courseData?._id || !myCertificates) return null;
    return myCertificates.find(cert => (cert.course?._id === courseData._id) || (cert.course === courseData._id));
  }, [myCertificates, courseData]);

  const PRICE = Math.floor(courseData?.price || 0);
  const OLD_PRICE = Math.floor(courseData?.oldPrice || 0);
  const SYLLABUS = courseData?.syllabus || [];
  const CATEGORIES = courseData?.category || [];
  const isLive = courseData?.type === "live";

  const titleWords = (courseData?.title || "").split(' ');
  const mainTitle = titleWords.slice(0, -1).join(' ');
  const lastWord = titleWords.slice(-1);

  // ======================================================
  // 🎭 GSAP ANIMATIONS
  // ======================================================
  useLayoutEffect(() => {
    if (!courseData) return;
    let ctx = gsap.context(() => {
      gsap.from(".hero-reveal", { y: 40, opacity: 0, stagger: 0.08, duration: 1.5, ease: "expo.out" });
      
      gsap.utils.toArray('.reveal-section').forEach(section => {
        gsap.from(section, {
          scrollTrigger: { trigger: section, start: "top 85%", toggleActions: "play none none reverse" },
          y: 40, opacity: 0, duration: 1.2, ease: "power3.out"
        });
      });

      gsap.fromTo(".sticky-cta", 
        { y: 150, opacity: 0 }, 
        { scrollTrigger: { trigger: "body", start: "1000px top", toggleActions: "play none none reverse" },
          y: 0, opacity: 1, duration: 0.8, ease: "expo.out" 
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [courseData]);

  return (
    <div ref={containerRef} className="bg-bg text-text min-h-screen selection:bg-accent/30 overflow-x-hidden relative font-sans">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FluidBackground />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(var(--accent-rgb), 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb), 0.5) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/40 to-bg" />
      </div>

      <main className="relative z-10 pt-28 md:pt-40 pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <section className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center mb-24 md:mb-48">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <span className="hero-reveal inline-block px-4 py-1.5 border border-accent/20 bg-accent/5 rounded-full text-[10px] font-black tracking-[0.3em] uppercase text-accent mb-6">
              {courseData.heroHighlight || "Engineering Cohort"}
            </span>
            <h1 className="hero-reveal text-4xl sm:text-6xl lg:text-[80px] xl:text-[90px] font-bold leading-[0.95] tracking-tighter text-white mb-8">
              {mainTitle} <br />
              <span className="italic font-serif text-accent">{lastWord}</span>
            </h1>
            <p className="hero-reveal text-base md:text-xl text-text-secondary/60 max-w-xl mb-8 mx-auto lg:mx-0 font-light leading-relaxed">
              {courseData.description}
            </p>
            <div className="hero-reveal flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
               <div className="flex items-center gap-4">
                  <span className="text-5xl md:text-7xl font-bold text-white tracking-tighter">₹{PRICE}</span>
                  <span className="text-lg md:text-xl text-white/20 line-through">₹{OLD_PRICE}</span>
               </div>
               <button onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-10 py-5 bg-accent text-bg font-black rounded-2xl hover:scale-105 transition-all duration-500 uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                Reserve Your Seat <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div ref={heroImageRef} className="order-1 lg:order-2 perspective-1000">
            <div className="relative group max-w-[500px] mx-auto transition-transform duration-500 ease-out">
              <div className="absolute -inset-4 bg-accent/20 blur-[80px] rounded-full opacity-20" />
              <div className="relative rounded-[32px] md:rounded-[40px] overflow-hidden border border-white/10 aspect-square bg-black/40 backdrop-blur-3xl shadow-2xl">
                <img src={courseData.thumbnail} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={courseData.title} />
                {isLive && (
                  <div className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 bg-red-600 rounded-full shadow-xl">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Now</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SYLLABUS SECTION (BORDERLESS UI) */}
        {SYLLABUS.length > 0 && (
          <section ref={syllabusRef} className="reveal-section mb-44 max-w-5xl mx-auto">
             <header className="mb-20">
                <div className="inline-block px-4 py-1 rounded-full border border-white/5 bg-white/[0.02] text-accent text-[10px] tracking-[0.5em] uppercase font-black mb-6">Course Path</div>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
                  Curriculum <span className="text-accent italic font-serif">Breakdown.</span>
                </h2>
            </header>

            <div className="divide-y divide-white/5">
              {SYLLABUS.map((section, index) => (
                <SyllabusCard 
                  key={index} 
                  index={index} 
                  section={section} 
                  isOpen={activeIndex === index} 
                  toggle={() => setActiveIndex(activeIndex === index ? null : index)} 
                />
              ))}
            </div>
          </section>
        )}

        <div className="reveal-section mb-44"><ComparisonSection /></div>

        {/* QUOTE SECTION */}
        <section className="reveal-section mb-44 px-4">
          <div className="relative py-32 md:py-48 bg-white/[0.02] border border-white/5 rounded-[60px] text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-rgb),0.05)_0%,transparent_70%)]" />
            <h2 className="relative z-10 text-4xl md:text-7xl font-bold text-white mb-16 leading-[1] tracking-tighter">
              {courseData.heroQuote || "Stop consuming tech."} <br />
              <span className="text-accent italic font-serif mt-4 block md:inline-block">Engineer the future.</span>
            </h2>
            <button onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="relative z-10 px-16 py-8 bg-white text-bg rounded-3xl font-black uppercase tracking-tighter text-xl hover:scale-105 transition-all">
                SECURE YOUR SPOT <ArrowRight className="inline-block ml-3" />
            </button>
          </div>
        </section>

        <CertificationSection
          userCertificate={currentUserCertificate}
          user={{ ...user, enrollments }}
          data={{
            _id: courseData?._id,
            isEnrolled: courseData?.isEnrolled,
            mainHeading: "Industry",
            highlightedText: "Standard",
            description: "Receive a professional engineering certificate upon completion.",
            certType: courseData.title || "Specialist",
            skillsLearned: CATEGORIES.join(", "),
          }}
        />

        <div className="reveal-section mt-44"><FAQSection /></div>

        <section ref={enrollmentRef} className="pt-24">
          <PrishEnrollment courseData={courseData} title={courseData.title} price={PRICE} oldPrice={OLD_PRICE} />
        </section>
      </main>

      {/* STICKY CTA */}
      <div className="sticky-cta fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[480px]">
        <div className="bg-bg/80 backdrop-blur-3xl border border-white/15 rounded-[32px] p-3 flex items-center justify-between shadow-2xl">
          <div className="pl-6">
            <span className="text-[9px] text-accent font-black uppercase tracking-widest block">Enrollment Open</span>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-white tracking-tighter">₹{PRICE}</span>
              <span className="text-xs text-white/30 line-through font-medium">₹{OLD_PRICE}</span>
            </div>
          </div>
          <button onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-accent text-bg px-10 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest">
            Join Now
          </button>
        </div>
      </div>

      <style jsx global>{`
        html.lenis { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
        :root { --accent-rgb: 255, 107, 0; }
        body { background-color: #000; color: #fff; }
      `}</style>
    </div>
  );
};