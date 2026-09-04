import React, { useRef, useLayoutEffect, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  ArrowRight, CheckCircle2, Terminal, MousePointer2, Layers,
  ChevronDown, Check, Globe, Sparkles, Server, Code, BookOpen, Download
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import jsPDF from "jspdf";

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
// 🛠️ HELPER: SYLLABUS ICON MAPPING
// ======================================================
const getIcon = (title) => {
  const t = title?.toLowerCase() || "";
  if (t.includes('web') || t.includes('frontend')) return <Globe className="w-5 h-5" />;
  if (t.includes('ai') || t.includes('gen')) return <Sparkles className="w-5 h-5" />;
  if (t.includes('cloud') || t.includes('devops') || t.includes('server')) return <Server className="w-5 h-5" />;
  if (t.includes('system') || t.includes('design') || t.includes('dsa')) return <Code className="w-5 h-5" />;
  return <BookOpen className="w-5 h-5" />;
};

// ======================================================
// 📱 COMPONENT: RESPONSIVE SYLLABUS CARD
// ======================================================
const SyllabusCard = ({ section, isOpen, toggle, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024) return; // Disable tilt on mobile for performance
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative mb-4 md:mb-6"
    >
      <div 
        onClick={toggle}
        className={`glass rounded-2xl md:rounded-[2rem] transition-all duration-500 border border-white/5 overflow-hidden cursor-pointer ${
          isOpen ? 'bg-white/[0.04] border-accent/30' : 'hover:border-accent/20 bg-white/[0.02]'
        }`}
      >
        <div className="p-5 md:p-8 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6" style={{ transform: "translateZ(30px)" }}>
            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0 ${isOpen ? 'bg-accent text-bg' : 'bg-white/5 text-accent border border-white/10'}`}>
              {getIcon(section.title)}
            </div>
            <div>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-accent/60 font-black mb-1 block">
                {section.phase || `Module 0${index + 1}`}
              </span>
              <h3 className="text-lg md:text-2xl font-bold tracking-tight text-white leading-tight">
                {section.title}
              </h3>
            </div>
          </div>
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }} 
            className={`shrink-0 ${isOpen ? "text-accent" : "text-white/20"}`}
          >
            <ChevronDown size={20} className="md:w-6 md:h-6" strokeWidth={2} />
          </motion.div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="overflow-hidden"
            >
              <div className="px-5 md:px-8 pb-8 pt-6 border-t border-white/10" style={{ transform: "translateZ(20px)" }}>
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                  {/* Topics List */}
                  <div className="space-y-4">
                    <h4 className="text-accent text-sm md:text-base flex items-center gap-2 font-bold uppercase tracking-widest opacity-80">
                      <ArrowRight size={14} className="text-accent" /> Objectives
                    </h4>
                    <ul className="space-y-3">
                      {section.topics?.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-text-secondary/70 text-xs md:text-sm leading-relaxed group/item">
                          <Check size={14} className="mt-0.5 text-accent/40 group-hover/item:text-accent transition-colors shrink-0" />
                          <span className="group-hover:text-text transition-colors">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tools Stack */}
                  <div className="space-y-4">
                    <h4 className="text-accent text-sm md:text-base flex items-center gap-2 font-bold uppercase tracking-widest opacity-80">
                      <Terminal size={14} className="text-accent" /> Stack & Tools
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {section.tools?.map((tool, i) => (
                            <span key={i} className="px-2.5 py-1.5 md:px-3 md:py-2 bg-black/40 border border-white/10 rounded-lg text-[9px] md:text-[10px] font-mono text-accent/80 uppercase tracking-wider hover:border-accent/40 transition-colors">
                                {tool}
                            </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ======================================================
// 🚀 PAGE COMPONENT
// ======================================================
export const CohortPage = ({ courseData }) => {
  const containerRef = useRef(null);
  const syllabusRef = useRef(null);
  const enrollmentRef = useRef(null);
  const heroImageRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const PRICE = Math.floor(courseData?.price || 0);
  const OLD_PRICE = Math.floor(courseData?.oldPrice || 0);
  const SYLLABUS = courseData?.syllabus || [];
  const CATEGORIES = courseData?.category || [];
  const isLive = courseData?.type === "live";

  const titleWords = (courseData?.title || "").split(' ');
  const mainTitle = titleWords.slice(0, -1).join(' ');
  const lastWord = titleWords.slice(-1);

  // PDF Generator
  const handleDownloadPDF = () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      let y = 20;
      pdf.setFontSize(22);
      pdf.text(`${courseData.title} Syllabus`, 15, y);
      y += 15;
      SYLLABUS.forEach((section, idx) => {
        if (y > 270) { pdf.addPage(); y = 20; }
        pdf.setFontSize(14);
        pdf.text(`${idx + 1}. ${section.title}`, 15, y);
        y += 7;
        pdf.setFontSize(10);
        section.topics?.forEach(t => {
            pdf.text(`- ${t}`, 20, y);
            y += 5;
        });
        y += 5;
      });
      pdf.save(`${courseData.title}_Syllabus.pdf`);
    } catch (e) { console.error("PDF generation error", e); }
  };

  useLayoutEffect(() => {
    if (!courseData) return;
    let ctx = gsap.context(() => {
      gsap.from(".hero-reveal", { y: 40, opacity: 0, stagger: 0.1, duration: 1.2, ease: "expo.out" });
      gsap.utils.toArray('.reveal-section').forEach(section => {
        gsap.from(section, {
          scrollTrigger: { trigger: section, start: "top 90%", toggleActions: "play none none reverse" },
          y: 40, opacity: 0, duration: 1, ease: "power2.out"
        });
      });
      gsap.fromTo(".sticky-cta", { y: 100, opacity: 0 }, {
        scrollTrigger: { trigger: "body", start: "800px top", toggleActions: "play none none reverse" },
        y: 0, opacity: 1, duration: 0.6, ease: "expo.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, [courseData]);

  return (
    <div ref={containerRef} className="bg-bg text-text min-h-screen selection:bg-accent/30 overflow-x-hidden relative font-sans">
      
      {/* GLOBAL BACKGROUNDS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FluidBackground />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(var(--accent-rgb), 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb), 0.5) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/60 to-bg" />
      </div>

      <main className="relative z-10 pt-24 md:pt-40 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <section className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 md:mb-48">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <span className="hero-reveal inline-block px-4 py-1.5 border border-accent/20 bg-accent/5 rounded-full text-[10px] font-black tracking-[0.3em] uppercase text-accent mb-6">
              {courseData.heroHighlight || "Engineering Cohort"}
            </span>
            <h1 className="hero-reveal text-4xl sm:text-6xl lg:text-7xl xl:text-[90px] font-bold leading-[0.95] tracking-tighter text-white mb-8">
              {mainTitle} <br />
              <span className="italic font-serif text-accent">{lastWord}</span>
            </h1>
            <p className="hero-reveal text-base md:text-xl text-text-secondary/60 max-w-xl mb-10 mx-auto lg:mx-0 font-light leading-relaxed">
              {courseData.description}
            </p>
            <div className="hero-reveal flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
              <div className="flex items-center gap-5">
                  <span className="text-5xl md:text-7xl font-bold text-white tracking-tighter">₹{PRICE}</span>
                  <span className="text-lg md:text-xl text-white/20 line-through decoration-accent/30">₹{OLD_PRICE}</span>
              </div>
              <button onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-10 py-5 bg-accent text-bg font-black rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(var(--accent-rgb),0.3)]">
                Reserve Your Seat <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div ref={heroImageRef} className="order-1 lg:order-2">
            <div className="relative rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/10 aspect-square bg-black/40 backdrop-blur-3xl shadow-2xl">
                <img src={courseData.thumbnail} className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" alt={courseData.title} />
                {isLive && (
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-full shadow-xl border border-white/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Now</span>
                  </div>
                )}
            </div>
          </div>
        </section>

        {/* SYLLABUS SECTION */}
        {SYLLABUS.length > 0 && (
          <section ref={syllabusRef} className="reveal-section mb-24 md:mb-48 max-w-4xl mx-auto scroll-mt-24">
            <header className="text-center mb-16 md:mb-24">
                <div className="inline-block px-4 py-1 border border-accent/20 bg-accent/5 rounded-full mb-6">
                    <span className="text-accent text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-black">Curriculum</span>
                </div>
                <h2 className="text-4xl md:text-[80px] font-bold tracking-tighter text-white leading-none mb-6">What You'll Study</h2>
                <p className="text-base md:text-xl text-text-secondary/50 font-light max-w-2xl mx-auto italic">"The most comprehensive roadmap designed for industry-level mastery."</p>
            </header>

            <div className="perspective-1000">
                {SYLLABUS.map((section, index) => (
                    <SyllabusCard 
                        key={index} index={index} section={section}
                        isOpen={activeIndex === index}
                        toggle={() => setActiveIndex(activeIndex === index ? null : index)}
                    />
                ))}
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-16 md:mt-24 flex flex-col items-center gap-6">
                <button 
                  onClick={handleDownloadPDF} 
                  className="group relative bg-white/[0.03] hover:bg-white/[0.06] px-8 md:px-12 py-4 md:py-5 rounded-full font-bold transition-all hover:scale-105 border border-white/10 flex items-center gap-3 backdrop-blur-md"
                >
                    <Download size={18} className="text-accent group-hover:animate-bounce" />
                    <span className="text-white text-sm md:text-base uppercase tracking-tighter">Download Syllabus PDF</span>
                </button>
                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-accent/60 font-black">Updated for 2025 Batch</p>
            </motion.div>
          </section>
        )}

        <div className="reveal-section mb-24 md:mb-48"><ComparisonSection /></div>

        {/* CALL TO ACTION QUOTE */}
        <section className="reveal-section mb-24 md:mb-48 px-4 text-center">
            <div className="max-w-5xl mx-auto py-20 md:py-32 bg-white/[0.01] border border-white/5 rounded-[40px] md:rounded-[80px] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-rgb),0.05),transparent_70%)]" />
                <div className="relative z-10 px-6">
                    <MousePointer2 className="w-10 h-10 md:w-16 md:h-16 text-accent mx-auto mb-8 opacity-20" />
                    <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-10 leading-tight tracking-tighter">
                        {courseData.heroQuote || "Don't Just Use AI."} <br />
                        <span className="text-accent italic font-serif">Engineer It.</span>
                    </h2>
                    <button onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="px-10 md:px-16 py-5 md:py-8 bg-white text-bg rounded-2xl md:rounded-3xl font-black text-sm md:text-xl uppercase tracking-tighter hover:scale-105 transition-all shadow-2xl">
                        ENROLL IN COHORT
                    </button>
                </div>
            </div>
        </section>

        <CertificationSection
          userCertificate={currentUserCertificate}
          user={{ ...user, enrollments }}
          data={{
            _id: courseData?._id,
            isEnrolled: courseData?.isEnrolled,
            mainHeading: "Validate Your",
            highlightedText: "Expertise",
            description: "Earn a specialized certification upon successful completion of the cohort curriculum.",
            certType: courseData.title || "Mastery",
            skillsLearned: CATEGORIES.join(", "),
          }}
        />

        <div className="reveal-section mt-24 md:mt-48"><FAQSection /></div>

        <section ref={enrollmentRef} className="mb-24 md:mb-48 pt-10 px-2">
          <PrishEnrollment courseData={courseData} title={courseData.title} price={PRICE} oldPrice={OLD_PRICE} />
        </section>
      </main>

      {/* STICKY CTA (Bottom Mobile-first) */}
      <div className="sticky-cta fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[500px]">
        <div className="bg-bg/80 backdrop-blur-3xl border border-white/10 rounded-[24px] p-2 flex items-center justify-between shadow-2xl overflow-hidden">
          <div className="pl-5">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold text-white tracking-tighter leading-none">₹{PRICE}</span>
              <span className="text-[10px] md:text-xs text-white/20 line-through">₹{OLD_PRICE}</span>
            </div>
            <span className="text-[7px] md:text-[8px] uppercase tracking-widest text-accent font-black block mt-1">Limited Seats Left</span>
          </div>
          <button 
            onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} 
            className="bg-accent text-bg px-7 py-4 md:px-10 md:py-5 rounded-[18px] md:rounded-[22px] font-black text-[10px] md:text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg"
          >
            Enroll Now
          </button>
        </div>
      </div>

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(10px); }
        @media (max-width: 768px) {
            h1 { font-size: 2.5rem !important; }
        }
      `}</style>
    </div>
  );
};