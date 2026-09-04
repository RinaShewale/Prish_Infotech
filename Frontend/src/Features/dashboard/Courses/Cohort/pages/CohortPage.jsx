import React, { useRef, useLayoutEffect, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  ArrowRight, CheckCircle2, Terminal, MousePointer2, Download
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis'; // Import Lenis for smooth scrolling

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
  const [activeModule, setActiveModule] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);

  // ======================================================
  // 🚀 SMOOTH SCROLL INITIALIZATION (LENIS)
  // ======================================================
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

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

  const handleDownloadPDF = () => {
    // Logic for PDF download
  };

  // ======================================================
  // 🎭 GSAP ANIMATIONS
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
      }).from(heroImageRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 2,
      }, "-=1.2");

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
    }, containerRef);

    return () => ctx.revert();
  }, [courseData]);

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
            <div className="relative group max-w-[500px] mx-auto">
              <div className="absolute -inset-4 bg-accent/20 blur-[80px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative rounded-[32px] md:rounded-[40px] overflow-hidden border border-white/10 aspect-square bg-black/40 backdrop-blur-3xl shadow-2xl">
                <img src={courseData.thumbnail} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={courseData.title} />
                {isLive && (
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-full shadow-xl border border-white/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Now</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* SYLLABUS SECTION */}
        {SYLLABUS.length > 0 && (
          <section ref={syllabusRef} className="reveal-section mb-44">
             <header className="text-center mb-24">
                <div className="inline-block px-4 py-1 rounded-full border border-white/5 bg-white/[0.02] text-accent text-[10px] tracking-[0.5em] uppercase font-black mb-6">Course Path</div>
                <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
                  Architect your<br/><span className="text-accent italic font-serif">Knowledge.</span>
                </h2>
            </header>

            <div className="max-w-4xl mx-auto space-y-4">
              {/* Existing Syllabus Logic */}
              <div className="flex flex-col gap-4">
                {SYLLABUS.map((section, idx) => (
                  <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-accent/20 transition-all">
                    <h3 className="text-xl font-bold text-white mb-2">{section.title}</h3>
                    <p className="text-sm text-text-secondary/60">{section.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-20 flex justify-center">
              <button onClick={handleDownloadPDF} className="group flex items-center gap-4 px-10 py-5 rounded-2xl border border-white/10 hover:border-accent/40 bg-white/[0.02] transition-all text-white/50 hover:text-white uppercase text-[11px] tracking-[0.2em] font-black">
                <Download size={18} className="text-accent group-hover:translate-y-0.5 transition-transform" /> Full Syllabus PDF
              </button>
            </div>
          </section>
        )}

        <div className="reveal-section mb-44"><ComparisonSection /></div>

        {/* QUOTE SECTION */}
        <section className="reveal-section mb-44 px-4">
          <div className="relative py-32 md:py-48 bg-white/[0.02] border border-white/5 rounded-[60px] md:rounded-[100px] text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-rgb),0.05)_0%,transparent_70%)]" />
            <div className="relative z-10 max-w-5xl mx-auto px-6">
                <h2 className="text-4xl md:text-7xl font-bold text-white mb-16 leading-[1] tracking-tighter">
                  {courseData.heroQuote || "Stop consuming tech."} <br />
                  <span className="text-accent italic font-serif mt-4 block md:inline-block">Engineer the future.</span>
                </h2>
                <div className="flex flex-col items-center gap-8">
                    <button 
                        onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} 
                        className="group relative inline-flex items-center gap-4 px-16 py-8 bg-white text-bg rounded-3xl transition-all hover:scale-105 active:scale-95 font-black uppercase tracking-tighter text-xl shadow-[0_20px_80px_rgba(255,255,255,0.15)]"
                    >
                        SECURE YOUR SPOT 
                        <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                    </button>
                    <p className="text-white/30 text-[11px] uppercase tracking-[0.3em] font-bold">Limited Enrollment Capacity</p>
                </div>
            </div>
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
            description: "Receive a professional engineering certificate upon completion of the cohort and the capstone project.",
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
        <div className="bg-bg/80 backdrop-blur-3xl border border-white/15 rounded-[32px] p-3 flex items-center justify-between shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)]">
          <div className="pl-6">
            <div className="flex flex-col">
              <span className="text-[9px] text-accent font-black uppercase tracking-widest mb-0.5">Enrollment Open</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-white tracking-tighter">₹{PRICE}</span>
                <span className="text-xs text-white/30 line-through font-medium">₹{OLD_PRICE}</span>
              </div>
            </div>
          </div>
          <button onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-accent text-bg px-10 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-lg shadow-accent/20 transition-transform hover:scale-105 active:scale-95">
            Join Now
          </button>
        </div>
      </div>

      <style jsx global>{`
        /* Essential styles for Lenis smooth scrolling */
        html.lenis {
          height: auto;
        }
        .lenis.lenis-smooth {
          scroll-behavior: auto !important;
        }
        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }
        .lenis.lenis-stopped {
          overflow: hidden;
        }
        .lenis.lenis-scrolling iframe {
          pointer-events: none;
        }

        :root {
          --accent-rgb: 255, 107, 0; 
        }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(24px); }
        body { background-color: #000; color: #fff; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #333; }
      `}</style>
    </div>
  );
};