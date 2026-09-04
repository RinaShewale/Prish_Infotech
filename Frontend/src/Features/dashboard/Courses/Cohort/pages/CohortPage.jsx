import React, { useRef, useLayoutEffect, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  ArrowRight, CheckCircle2, Terminal, MousePointer2, Layers, Cpu,
  ChevronDown, Check, Globe, Sparkles, Server, Code, BookOpen, Download
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from "framer-motion";

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

export const CohortPage = ({ courseData }) => {

  const containerRef = useRef(null);
  const syllabusRef = useRef(null);
  const enrollmentRef = useRef(null);
  const contentRef = useRef(null);
  const heroImageRef = useRef(null);
  const tabsRef = useRef(null);
  const [activeModule, setActiveModule] = useState(0);

  // ======================================================
  // 🔐 AUTH & CERTIFICATE INTEGRATION
  // ======================================================
  const { user } = useSelector((state) => state.auth);
  const { myCertificates, getMyCertificates } = useCertificate();
  const { enrollments } = useEnrollment();

  useEffect(() => {
    getMyCertificates();
  }, []);

  const currentUserCertificate = useMemo(() => {
    if (!courseData?._id || !myCertificates) return null;
    return myCertificates.find(cert =>
      (cert.course?._id === courseData._id) || (cert.course === courseData._id)
    );
  }, [myCertificates, courseData]);

  // ======================================================
  // 📊 DATA PARSING
  // ======================================================
  const PRICE = Math.floor(courseData?.price || 0);
  const OLD_PRICE = Math.floor(courseData?.oldPrice || 0);
  const SYLLABUS = courseData?.syllabus || [];
  const CATEGORIES = courseData?.category || [];
  const isLive = courseData?.type === "live";

  const titleWords = (courseData?.title || "").split(' ');
  const mainTitle = titleWords.slice(0, -1).join(' ');
  const lastWord = titleWords.slice(-1);

  // ======================================================
  // 🎭 MINIMAL AESTHETIC GSAP ANIMATIONS
  // ======================================================
  useLayoutEffect(() => {
    if (!courseData) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from(".hero-reveal", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 1.5,
        clearProps: "all"
      })
        .from(heroImageRef.current, {
          scale: 0.95,
          opacity: 0,
          duration: 2,
          ease: "power2.out"
        }, "-=1.2");

      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;

        gsap.to(heroImageRef.current, {
          x: xPos,
          y: yPos,
          rotationY: xPos / 2,
          rotationX: -yPos / 2,
          duration: 1,
          ease: "power2.out"
        });
      };

      if (window.innerWidth > 1024) {
        window.addEventListener('mousemove', handleMouseMove);
      }

      gsap.utils.toArray('.reveal-section').forEach(section => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          y: 40,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out"
        });
      });

      gsap.fromTo(".sticky-cta",
        { y: 150, opacity: 0 },
        {
          scrollTrigger: {
            trigger: "body",
            start: "1000px top",
            toggleActions: "play none none reverse"
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "expo.out"
        }
      );

      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, [courseData]);

  const handleTabChange = (index) => {
    if (index === activeModule) return;
    const tabElement = tabsRef.current?.children[index];
    if (tabElement) {
      tabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
    setActiveModule(index);
  };

  return (
    <div ref={containerRef} className="bg-bg text-text min-h-screen selection:bg-accent/30 overflow-x-hidden relative font-sans">

      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FluidBackground />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `linear-gradient(rgba(var(--accent-rgb), 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb), 0.5) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/60 to-bg" />
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

            <div className="hero-reveal flex flex-wrap justify-center lg:justify-start gap-2 mb-10">
              {CATEGORIES.map((cat, index) => (
                <span key={index} className="px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-lg text-[10px] font-bold text-white/40 uppercase tracking-widest hover:border-accent/40 transition-colors duration-500">
                  {cat}
                </span>
              ))}
            </div>

            <div className="hero-reveal flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-4">
                  <span className="text-5xl md:text-7xl font-bold text-white tracking-tighter">₹{PRICE}</span>
                  <div className="flex flex-col items-start">
                    <span className="text-lg md:text-xl text-white/20 line-through decoration-accent/40 leading-none">₹{OLD_PRICE}</span>
                  </div>
                </div>
                <span className="text-[10px] text-accent font-black uppercase tracking-widest mt-2">Limited Enrollment Open</span>
              </div>

              <button
                onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-10 py-5 bg-accent text-bg font-black rounded-2xl hover:scale-105 hover:shadow-[0_0_40px_rgba(var(--accent-rgb),0.5)] transition-all duration-500 uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)]"
              >
                Reserve Your Seat <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div ref={heroImageRef} className="order-1 lg:order-2 perspective-1000">
            <div className="relative group max-w-[500px] mx-auto transition-transform duration-500 ease-out">
              <div className="absolute -inset-4 bg-accent/20 blur-[80px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative rounded-[32px] md:rounded-[40px] overflow-hidden border border-white/10 aspect-square bg-black/40 backdrop-blur-3xl shadow-2xl">
                <img src={courseData.thumbnail} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={courseData.title} />
                {isLive && (
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-red-600 rounded-full shadow-xl border border-white/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest">Live Now</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* SYLLABUS SECTION */}
        {SYLLABUS.length > 0 && (
          <section ref={syllabusRef} className="reveal-section mb-24 md:mb-48">
            <div className="mb-12 md:mb-20 text-center lg:text-left px-2 max-w-4xl">
               <div className="inline-block px-4 py-1 border border-accent/20 bg-accent/5 rounded-full mb-6">
                    <span className="text-accent text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-black">Technical Roadmap</span>
                </div>
              <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-none mb-6">Curriculum Architecture<span className="text-accent">.</span></h2>
              <p className="text-text-secondary/50 text-base md:text-xl font-light italic">"A strictly engineered curriculum designed for deep industry-level mastery."</p>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              {/* STICKY SIDEBAR TABS */}
              <div className="w-full lg:col-span-4 lg:sticky lg:top-32 z-20">
                <div className="relative">
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-bg to-transparent z-10 lg:hidden pointer-events-none" />
                  <div ref={tabsRef} className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 lg:max-h-[80vh] no-scrollbar snap-x snap-mandatory lg:pr-4 px-2 lg:px-0">
                    {SYLLABUS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTabChange(idx)}
                        className={`flex-shrink-0 w-[280px] lg:w-full p-6 md:p-8 rounded-[2rem] border transition-all duration-500 text-left snap-center group outline-none relative overflow-hidden ${
                            activeModule === idx 
                            ? "bg-accent border-accent text-bg shadow-[0_20px_40px_rgba(var(--accent-rgb),0.2)] scale-[1.03]" 
                            : "bg-white/[0.02] border-white/5 text-text-secondary hover:border-white/20 hover:bg-white/[0.04]"
                          }`}
                      >
                        <div className="flex flex-col items-start gap-1 pointer-events-none relative z-10">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activeModule === idx ? "text-bg/50" : "text-accent/50"}`}>
                            Step 0{idx + 1} // {item.phase}
                          </span>
                          <h3 className="font-black uppercase text-base md:text-xl tracking-tight leading-tight">{item.title}</h3>
                        </div>
                        {activeModule === idx && (
                             <div className="absolute -right-2 -bottom-2 opacity-10 rotate-12"><Cpu size={100} strokeWidth={1} /></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CONTENT AREA */}
              <div className="w-full lg:col-span-8">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeModule}
                    initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="relative bg-white/[0.02] border border-white/10 rounded-[3rem] md:rounded-[5rem] p-8 md:p-14 lg:p-20 backdrop-blur-3xl overflow-hidden shadow-2xl group"
                  >
                    {/* BLUEPRINT OVERLAY BACKGROUND */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none hidden lg:block group-hover:rotate-12 transition-transform duration-1000">
                        <Terminal size={320} strokeWidth={0.5} />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] text-accent font-black uppercase tracking-widest animate-pulse">Live Blueprint</span>
                            <span className="text-white/20 text-[10px] font-mono">ID: MOD_0{activeModule+1}</span>
                        </div>
                        
                        <h3 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-10 md:mb-16 tracking-tighter leading-[1] max-w-2xl">{SYLLABUS[activeModule]?.title}</h3>
                        
                        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
                            {/* Learning Milestones (Left) */}
                            <div className="lg:col-span-3 space-y-8">
                                <h4 className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] flex items-center gap-3">
                                    <Layers size={14} className="text-accent" /> Knowledge Milestones
                                </h4>
                                <div className="relative ml-2 space-y-6">
                                    <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-accent/40 via-accent/5 to-transparent" />
                                    {SYLLABUS[activeModule]?.topics?.map((t, i) => (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                            key={i} className="flex items-start gap-5 group/item"
                                        >
                                            <div className="relative z-10 mt-2 w-3.5 h-3.5 rounded-full bg-bg border-2 border-accent/40 group-hover/item:border-accent group-hover/item:scale-125 transition-all" />
                                            <span className="text-base md:text-xl text-text-secondary/70 group-hover/item:text-white transition-colors font-light leading-relaxed">{t}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Engineering Stack Dashboard (Right) */}
                            <div className="lg:col-span-2">
                                <div className="bg-black/40 rounded-[2.5rem] p-8 border border-white/5 h-fit relative group/stack overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover/stack:opacity-100 transition-opacity duration-500" />
                                    <h4 className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                                        <Cpu size={12} className="text-accent" /> Stack // Tools
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3 relative z-10">
                                        {SYLLABUS[activeModule]?.tools?.map((tool, i) => (
                                            <div key={i} className="px-4 py-3 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-between hover:border-accent/30 transition-all group/tool">
                                                <span className="text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-wider">{tool}</span>
                                                <span className="text-[8px] font-mono text-accent/30 group-hover/tool:text-accent transition-colors">0{i+1}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-white/5 opacity-40">
                                        <p className="text-[9px] leading-relaxed italic">Module optimized for current industry deployment cycles.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>
        )}

        <div className="reveal-section mb-24 md:mb-48">
          <ComparisonSection />
        </div>

        {/* QUOTE SECTION */}
        <section className="reveal-section mb-24 md:mb-48 relative group px-2">
          <div className="absolute inset-0 bg-accent/5 blur-[120px] rounded-full scale-50" />
          <div className="relative py-16 md:py-32 px-6 bg-white/[0.02] border border-white/10 rounded-[40px] md:rounded-[100px] text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-rgb),0.1),transparent_70%)]" />
            <div className="relative z-10 max-w-5xl mx-auto">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <MousePointer2 className="w-6 h-6 md:w-7 md:h-7 text-accent" />
              </div>
              <h2 className="text-3xl md:text-6xl lg:text-[80px] font-bold text-white mb-10 md:mb-16 leading-[1.1] tracking-tighter">
                {courseData.heroQuote || "Don't Just Use AI."} <br />
                <span className="text-accent italic font-serif">Engineer It.</span>
              </h2>
              <div className="flex justify-center">
                <button
                  onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative flex items-center justify-center gap-4 px-8 md:px-16 py-6 md:py-10 bg-white text-bg rounded-full transition-all hover:scale-[1.03] active:scale-95 shadow-2xl"
                >
                  <span className="text-xs md:text-2xl font-black uppercase tracking-tighter">ENROLL NOW</span>
                  <ArrowRight className="w-5 h-5 md:w-8 md:h-8 shrink-0 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <CertificationSection
          userCertificate={currentUserCertificate}
          user={{
            ...user,
            enrollments,
          }}
          data={{
            _id: courseData?._id,
            isEnrolled: courseData?.isEnrolled,
            mainHeading: "Validate Your",
            highlightedText: "Expertise",
            description:
              "Earn a specialized certification upon successful completion of the cohort curriculum and final project assessment.",
            certType: courseData.title || "Mastery",
            skillsLearned: CATEGORIES.join(", "),
          }}
        />

        <div className="reveal-section mt-24 md:mt-48"><FAQSection /></div>

        <section ref={enrollmentRef} className="mb-24 md:mb-48 pt-10">
          <PrishEnrollment courseData={courseData} title={courseData.title} price={PRICE} oldPrice={OLD_PRICE} />
        </section>
      </main>

      {/* STICKY CTA */}
      <div className="sticky-cta fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[500px]">
        <div className="bg-bg/80 backdrop-blur-2xl border border-white/10 rounded-[24px] md:rounded-[32px] p-2 flex items-center justify-between shadow-2xl">
          <div className="pl-4 md:pl-6 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold text-white tracking-tighter leading-none">₹{PRICE}</span>
              <span className="text-[10px] md:text-xs text-white/20 line-through">₹{OLD_PRICE}</span>
            </div>
            <span className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-accent font-black block mt-1">
              Limited Slots Left • {courseData.discount}% OFF
            </span>
          </div>
          <button
            onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-accent text-bg px-6 py-4 md:px-10 md:py-5 rounded-[18px] md:rounded-[26px] font-black text-[10px] md:text-[11px] uppercase tracking-widest hover:brightness-110 hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)] transition-all active:scale-95 shadow-lg"
          >
            Enroll Now
          </button>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .perspective-1000 { perspective: 1000px; }
        @media (max-width: 1024px) {
          .overflow-x-auto { scroll-behavior: smooth; -webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory; }
        }
        .lg\\:overflow-y-auto { scrollbar-gutter: stable; }
      `}</style>
    </div>
  );
};