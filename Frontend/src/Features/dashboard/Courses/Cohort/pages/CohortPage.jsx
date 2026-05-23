import React, { useRef, useLayoutEffect, useState } from 'react';
import {
  ArrowRight, CheckCircle2, ChevronRight, MousePointer2,
  Sparkles, Terminal, Layers, ShieldCheck, BrainCircuit, Zap, Cpu
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { FluidBackground } from "../../../components/FluidBackground";
import ComparisonSection from "../../../components/ComparisonSection";
import { FAQSection } from '../../../components/FAQSection';
import CertificationSection from '../component/CertificationSection';
import { PrishEnrollment } from '../component/PrishEnrollment';

gsap.registerPlugin(ScrollTrigger);

export const CohortPage = ({ courseData }) => {
  const containerRef = useRef(null);
  const syllabusRef = useRef(null);
  const enrollmentRef = useRef(null);
  const contentRef = useRef(null);
  const heroImageRef = useRef(null);
  const [activeModule, setActiveModule] = useState(0);

  const PRICE = Math.floor(courseData?.price || 0);
  const OLD_PRICE = Math.floor(courseData?.oldPrice || 0);
  const SYLLABUS = courseData?.syllabus || [];
  const CATEGORIES = courseData?.category || [];
  const isLive = courseData?.type === "live";

  const titleWords = (courseData?.title || "").split(' ');
  const mainTitle = titleWords.slice(0, -1).join(' ');
  const lastWord = titleWords.slice(-1);

  useLayoutEffect(() => {
    if (!courseData) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-reveal", { y: 60, opacity: 0, stagger: 0.1, duration: 1.2 })
        .from(heroImageRef.current, { scale: 0.9, opacity: 0, duration: 1.5 }, "-=1");

      gsap.utils.toArray('.reveal-section').forEach(section => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            toggleActions: "play none none reverse"
          },
          y: 30,
          opacity: 0,
          duration: 1
        });
      });

      gsap.fromTo(".sticky-cta",
        { y: 120, opacity: 0 },
        {
          scrollTrigger: {
            trigger: "body",
            start: "800px top",
            toggleActions: "play none none reverse"
          },
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.4)"
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [courseData]);

  const handleTabChange = (index) => {
    if (index === activeModule) return;
    gsap.to(contentRef.current, {
      opacity: 0, x: -10, duration: 0.2,
      onComplete: () => {
        setActiveModule(index);
        gsap.fromTo(contentRef.current,
          { opacity: 0, x: 10 },
          { opacity: 1, x: 0, duration: 0.4 }
        );
      }
    });
  };

  return (
    <div ref={containerRef} className="bg-bg text-text min-h-screen selection:bg-accent/30 overflow-x-hidden relative font-sans">

      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FluidBackground />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `linear-gradient(rgba(var(--accent-rgb), 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb), 0.5) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/40 to-bg" />
      </div>

      <main className="relative z-10 pt-28 md:pt-40 pb-24 px-4 sm:px-8 max-w-7xl mx-auto">

        {/* HERO SECTION */}
        <section className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center mb-24 md:mb-48">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <span className="hero-reveal inline-block px-4 py-1.5 border border-accent/20 bg-accent/5 rounded-full text-[10px] font-black tracking-[0.3em] uppercase text-accent mb-6">
              {courseData.heroHighlight || "Engineering Cohort"}
            </span>

            <h1 className="hero-reveal text-5xl sm:text-6xl lg:text-[90px] font-bold leading-[0.95] tracking-tighter text-white mb-8">
              {mainTitle} <br />
              <span className="italic font-serif text-accent">{lastWord}</span>
            </h1>

            <p className="hero-reveal text-base md:text-xl text-text-secondary/60 max-w-xl mb-8 mx-auto lg:mx-0 font-light leading-relaxed">
              {courseData.description}
            </p>

            <div className="hero-reveal flex flex-wrap justify-center lg:justify-start gap-2 mb-10">
              {CATEGORIES.map((cat, index) => (
                <span key={index} className="px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-lg text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  {cat}
                </span>
              ))}
            </div>

            <div className="hero-reveal flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
              <div className="flex flex-col items-center lg:items-start">
                {/* IMPROVED DISCOUNT UI */}
                <div className="flex items-center gap-4">
                  <span className="text-5xl md:text-7xl font-bold text-white tracking-tighter">₹{PRICE}</span>
                  <div className="flex flex-col items-start">
                    <span className="text-lg md:text-xl text-white/20 line-through decoration-accent/40 leading-none">₹{OLD_PRICE}</span>
                    {courseData.discount > 0 && (
                      <span className="mt-1.5 px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent rounded-md text-[9px] font-black uppercase tracking-wider">
                        {courseData.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-accent font-black uppercase tracking-widest mt-2">Limited Enrollment Open</span>
              </div>

              <button
                onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-10 py-5 bg-accent text-bg font-black rounded-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)]"
              >
                Reserve Your Seat <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div ref={heroImageRef} className="order-1 lg:order-2">
            <div className="relative group max-w-[500px] mx-auto">
              <div className="absolute -inset-4 bg-accent/20 blur-[80px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />

              <div className="relative rounded-[32px] md:rounded-[40px] overflow-hidden border border-white/10 aspect-square bg-black/40 backdrop-blur-3xl shadow-2xl">
                <img src={courseData.thumbnail} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" alt={courseData.title} />

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

        {/* STATS STRIP */}
        <div className="reveal-section grid grid-cols-2 md:grid-cols-4 gap-4 mb-24 md:mb-48">
          {[
            { label: 'Modules', val: SYLLABUS.length, icon: Layers },
            { label: 'Tools', val: '12+ Tech', icon: Terminal },
            { label: 'Projects', val: 'Industrial', icon: Sparkles },
            { label: 'Certification', val: 'Verified', icon: ShieldCheck },
          ].map((stat, i) => (
            <div key={i} className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center hover:bg-white/[0.05] transition-colors">
              <stat.icon className="w-5 h-5 text-accent/50 mb-3 md:mb-4" />
              <span className="text-xl md:text-2xl font-bold text-white mb-1">{stat.val}</span>
              <span className="text-[9px] md:text-[10px] text-text-secondary/40 font-black uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* SYLLABUS SECTION */}
        {SYLLABUS.length > 0 && (
          <section ref={syllabusRef} className="reveal-section mb-24 md:mb-48">
            <div className="mb-12 text-center md:text-left">
              <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-none mb-6">Curriculum<span className="text-accent">.</span></h2>
              <p className="text-text-secondary/50 text-base md:text-lg">A structured roadmap designed for industry mastery.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 lg:gap-12">
              <div className="lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 no-scrollbar snap-x snap-mandatory">
                {SYLLABUS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTabChange(idx)}
                    className={`flex-shrink-0 w-[260px] lg:w-full p-6 rounded-2xl md:rounded-[32px] border transition-all duration-500 text-left snap-center group ${activeModule === idx ? "bg-accent border-accent text-bg" : "bg-white/[0.03] border-white/5 text-text-secondary hover:border-white/20"}`}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${activeModule === idx ? "text-bg/60" : "text-accent/60"}`}>
                        0{idx + 1} — {item.phase}
                      </span>
                      <h3 className="font-bold uppercase text-base md:text-xl tracking-tight leading-tight">{item.title}</h3>
                    </div>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-8">
                <div className="relative bg-white/[0.01] border border-white/10 rounded-[32px] md:rounded-[60px] p-6 md:p-16 min-h-[450px] md:min-h-[500px] backdrop-blur-3xl overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-6 md:p-10 opacity-[0.02] pointer-events-none hidden md:block">
                    <Terminal size={300} />
                  </div>

                  <div ref={contentRef} className="relative z-10 flex flex-col h-full">
                    <span className="text-accent/60 font-black tracking-[0.2em] uppercase text-[10px] md:text-[12px] mb-4 md:mb-6 block">
                      {SYLLABUS[activeModule]?.phase}
                    </span>

                    <h3 className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-8 md:mb-12 tracking-tighter leading-[1]">
                      {SYLLABUS[activeModule]?.title}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-auto">
                      <ul className="space-y-4 md:space-y-6">
                        {SYLLABUS[activeModule]?.topics?.map((t, i) => (
                          <li key={i} className="flex gap-3 md:gap-4 text-sm md:text-lg text-text-secondary/70 font-light items-start">
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-accent/40 shrink-0 mt-1" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="bg-white/[0.03] border border-white/5 rounded-2xl md:rounded-[32px] p-6 md:p-8 h-fit">
                        <h4 className="text-text-secondary/30 text-[9px] font-black uppercase tracking-widest mb-4 md:mb-6">Core Modules</h4>
                        <div className="flex flex-wrap gap-2">
                          {SYLLABUS[activeModule]?.tools?.map((tool, i) => (
                            <span key={i} className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[9px] font-mono text-accent uppercase tracking-wider">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="reveal-section mb-24 md:mb-48">
          <ComparisonSection />
        </div>

        {/* QUOTE / FINAL CTA SECTION */}
        <section className="reveal-section mb-24 md:mb-48 relative group">
          <div className="absolute inset-0 bg-accent/5 blur-[120px] rounded-full scale-50" />
          <div className="relative py-20 md:py-40 px-6 bg-white/[0.02] border border-white/10 rounded-[40px] md:rounded-[100px] text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-rgb),0.1),transparent_70%)]" />
            <div className="relative z-10 max-w-5xl mx-auto">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-8 md:mb-10 border border-white/10 rotate-12">
                <MousePointer2 className="w-6 h-6 md:w-7 md:h-7 text-accent" />
              </div>
              <h2 className="text-3xl md:text-[80px] font-bold text-white mb-10 md:mb-16 leading-[1.1] tracking-tighter">
                {courseData.heroQuote || "Don't Just Use AI."} <br />
                <span className="text-accent italic font-serif">Engineer It.</span>
              </h2>
              <div className="flex justify-center">
                <button
                  onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative flex items-center justify-center gap-4 md:gap-6 px-8 md:px-16 py-6 md:py-10 bg-white text-bg rounded-full transition-all hover:scale-[1.03] active:scale-95 shadow-2xl"
                >
                  <span className="text-xs md:text-2xl font-black uppercase tracking-tighter">
                    ENROLL NOW
                  </span>
                  <ArrowRight className="w-5 h-5 md:w-8 md:h-8 shrink-0 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <CertificationSection data={{
          mainHeading: "Validate Your", highlightedText: "Expertise",
          description: "Earn a specialized certification upon successful completion of the cohort curriculum and final project assessment.",
          certType: "Mastery", skillsLearned: CATEGORIES.join(", "),
        }} />

        <div className="reveal-section mt-24 md:mt-48"><FAQSection /></div>

        <section ref={enrollmentRef} className="mb-24 md:mb-48 pt-10">
          <PrishEnrollment courseData={courseData} title={courseData.title} price={PRICE} oldPrice={OLD_PRICE} />
        </section>
      </main>

      {/* STICKY CTA - IMPROVED PRICE DISPLAY */}
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
            className="bg-accent text-bg px-6 py-4 md:px-10 md:py-5 rounded-[18px] md:rounded-[26px] font-black text-[10px] md:text-[11px] uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-lg"
          >
            Enroll Now
          </button>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 640px) {
          h1 { word-break: break-word; }
        }
      `}</style>
    </div>
  );
};