import React, { useRef, useLayoutEffect, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  ArrowRight, CheckCircle2, Terminal, MousePointer2, ChevronDown, Check, Globe, Sparkles, Server, Code, BookOpen, Download, Zap, ShieldCheck, Cpu
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from "framer-motion";
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

const getIcon = (title) => {
  const t = title?.toLowerCase() || "";
  if (t.includes('web') || t.includes('frontend')) return <Globe className="w-5 h-5" />;
  if (t.includes('ai') || t.includes('gen')) return <Sparkles className="w-5 h-5" />;
  if (t.includes('cloud') || t.includes('devops') || t.includes('server')) return <Server className="w-5 h-5" />;
  if (t.includes('system') || t.includes('design') || t.includes('dsa')) return <Code className="w-5 h-5" />;
  return <BookOpen className="w-5 h-5" />;
};

const SyllabusCard = ({ section, isOpen, toggle, index }) => {
  return (
    <div className="relative mb-6 group">
      {/* Connecting Line logic for UI depth */}
      <div className="absolute left-[29px] top-[70px] bottom-[-30px] w-[1px] bg-gradient-to-b from-white/10 to-transparent hidden md:block" />
      
      <div 
        onClick={toggle}
        className={`glass rounded-[24px] transition-all duration-500 border overflow-hidden ${
          isOpen 
          ? 'bg-white/[0.04] border-accent/40 shadow-[0_0_40px_rgba(var(--accent-rgb),0.1)]' 
          : 'hover:border-white/20 border-white/5 bg-white/[0.01]'
        }`}
      >
        <div className="p-6 md:p-8 flex items-center justify-between cursor-pointer relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-accent text-bg scale-110' : 'bg-white/5 text-accent border border-white/10'}`}>
                {getIcon(section.title)}
                </div>
                {isOpen && <motion.div layoutId="glow" className="absolute inset-0 bg-accent blur-xl opacity-20 -z-10" />}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-black">
                  Module {index + 1}
                </span>
                <span className="h-[1px] w-4 bg-white/20" />
                <span className="text-[10px] text-white/40 uppercase font-mono">{section.topics?.length || 0} Topics</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase group-hover:text-accent transition-colors">
                {section.title}
              </h3>
            </div>
          </div>
          <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all ${isOpen ? 'bg-white text-bg rotate-180' : 'text-white/40 group-hover:border-accent/40'}`}>
            <ChevronDown size={18} />
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-6 md:px-8 pb-8 pt-2">
                <div className="h-[1px] w-full bg-gradient-to-r from-accent/30 via-white/5 to-transparent mb-8" />
                <div className="grid md:grid-cols-[1.5fr_1fr] gap-10">
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                       Core Curriculum
                    </h4>
                    <div className="grid gap-3">
                      {section.topics?.map((topic, j) => (
                        <div key={j} className="flex items-start gap-4 group/item">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/40 group-hover/item:bg-accent transition-colors shrink-0" />
                          <span className="text-white/70 text-[15px] leading-relaxed group-hover/item:text-white transition-colors">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {section.tools && (
                    <div className="space-y-6">
                       <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
                        <h4 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-5 flex items-center gap-2">
                            <Cpu size={14} className="text-accent" /> Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {section.tools.map((tool, i) => (
                            <span key={i} className="px-3 py-1.5 bg-accent/5 border border-accent/20 rounded-lg text-[10px] font-mono text-accent uppercase tracking-wider">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const CohortPage = ({ courseData }) => {
  const containerRef = useRef(null);
  const syllabusRef = useRef(null);
  const enrollmentRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const titleWords = (courseData?.title || "").split(' ');
  const mainTitle = titleWords.slice(0, -1).join(' ');
  const lastWord = titleWords.slice(-1);

  const handleDownloadPDF = () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      let yPos = 20;
      pdf.setFontSize(22); pdf.text(`${courseData.title} Syllabus`, 15, yPos);
      yPos += 15;
      SYLLABUS.forEach((s, i) => {
        if (yPos > 270) { pdf.addPage(); yPos = 20; }
        pdf.setFontSize(14); pdf.setFont(undefined, 'bold');
        pdf.text(`Module ${i+1}: ${s.title}`, 15, yPos); yPos += 8;
        pdf.setFontSize(10); pdf.setFont(undefined, 'normal');
        s.topics?.forEach(t => { pdf.text(`• ${t}`, 20, yPos); yPos += 6; });
        yPos += 4;
      });
      pdf.save(`${courseData.title}_Syllabus.pdf`);
    } catch (e) { console.error(e); }
  };

  useLayoutEffect(() => {
    if (!courseData) return;
    let ctx = gsap.context(() => {
      gsap.from(".hero-reveal", { y: 40, opacity: 0, stagger: 0.15, duration: 1.2, ease: "expo.out" });
      gsap.from(".hero-img-container", { scale: 0.9, opacity: 0, duration: 1.8, ease: "expo.out", delay: 0.2 });
      gsap.utils.toArray('.reveal-section').forEach(s => {
        gsap.from(s, { scrollTrigger: { trigger: s, start: "top 85%" }, y: 50, opacity: 0, duration: 1.2, ease: "power3.out" });
      });
      gsap.fromTo(".sticky-cta", { y: 150 }, {
        scrollTrigger: { trigger: "body", start: "1000px top", toggleActions: "play none none reverse" },
        y: 0, duration: 0.8, ease: "expo.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, [courseData]);

  return (
    <div ref={containerRef} className="bg-bg text-text min-h-screen selection:bg-accent/30 overflow-x-hidden relative font-sans">
      
      {/* Premium Background Layering */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FluidBackground />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
      </div>

      <main className="relative z-10 pt-32 md:pt-48 pb-20 px-6 max-w-7xl mx-auto">

        {/* HERO SECTION - REFINED */}
        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-24 items-center mb-40">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="hero-reveal inline-flex items-center gap-2 px-4 py-1.5 border border-accent/30 bg-accent/10 rounded-full mb-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-[11px] font-black tracking-[0.3em] uppercase text-accent">
                {courseData.heroHighlight || "Engineering Cohort"}
              </span>
            </div>
            <h1 className="hero-reveal text-5xl sm:text-7xl lg:text-[92px] font-bold leading-[0.85] tracking-tighter text-white mb-10">
              {mainTitle} <br />
              <span className="italic font-serif text-accent">{lastWord}</span>
            </h1>
            <p className="hero-reveal text-lg md:text-xl text-white/50 max-w-xl mb-12 mx-auto lg:mx-0 font-medium leading-relaxed">
              {courseData.description}
            </p>
            <div className="hero-reveal flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-12">
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Investment</span>
                <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-bold text-white tracking-tighter">₹{PRICE}</span>
                    <span className="text-xl text-white/20 line-through font-light">₹{OLD_PRICE}</span>
                </div>
              </div>
              <button
                onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-12 py-6 bg-accent text-bg font-black rounded-[20px] hover:scale-[1.03] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(var(--accent-rgb),0.3)]"
              >
                Start Learning <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* HERO IMAGE WITH MASKING */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
             <div className="hero-img-container relative w-full max-w-[420px]">
                <div className="absolute -inset-4 bg-accent/20 blur-[100px] rounded-full opacity-30" />
                <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden border border-white/10 shadow-2xl">
                    <img src={courseData.thumbnail} className="w-full h-full object-cover" alt={courseData.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-bg bg-zinc-800" />)}
                            </div>
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-tight">500+ Engineers Enrolled</span>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </section>

        {/* SYLLABUS SECTION */}
        {SYLLABUS.length > 0 && (
          <section ref={syllabusRef} className="reveal-section mb-40 relative">
             <header className="text-center mb-24">
                <div className="inline-block mb-4 px-4 py-1 rounded-full border border-white/5 bg-white/[0.02] text-accent text-[10px] tracking-[0.4em] uppercase font-black">Curriculum</div>
                <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
                  Engineered for<br/><span className="text-accent italic font-serif">Mastery.</span>
                </h2>
            </header>

            <div className="max-w-4xl mx-auto">
              {SYLLABUS.map((section, index) => (
                <SyllabusCard key={index} index={index} section={section} isOpen={activeIndex === index} toggle={() => setActiveIndex(activeIndex === index ? null : index)} />
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-20 flex justify-center">
              <button onClick={handleDownloadPDF} className="group flex items-center gap-3 px-10 py-5 rounded-2xl border border-white/10 hover:border-accent/40 bg-white/[0.02] transition-all text-white/60 hover:text-white uppercase text-[11px] tracking-[0.2em] font-black">
                <Download size={18} className="text-accent group-hover:animate-bounce" /> Full Syllabus PDF
              </button>
            </motion.div>
          </section>
        )}

        <div className="reveal-section mb-40"><ComparisonSection /></div>

        {/* QUOTE SECTION - MODERNIZED */}
        <section className="reveal-section mb-40 px-2">
          <div className="relative py-28 md:py-40 bg-white/[0.02] border border-white/10 rounded-[60px] md:rounded-[80px] text-center overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            <h2 className="text-4xl md:text-7xl font-bold text-white mb-16 leading-[1] tracking-tighter px-4">
              {courseData.heroQuote || "Stop consuming tech."} <br />
              <span className="text-accent italic font-serif">Start building it.</span>
            </h2>
            <button onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-4 px-14 py-7 bg-white text-bg rounded-2xl transition-all hover:scale-105 active:scale-95 font-black uppercase tracking-tighter text-lg shadow-2xl">
              ENROLL IN COHORT <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </section>

        <CertificationSection
          userCertificate={currentUserCertificate}
          user={{ ...user, enrollments }}
          data={{
            _id: courseData?._id,
            isEnrolled: courseData?.isEnrolled,
            mainHeading: "Verified",
            highlightedText: "Expertise",
            description: "Receive an industry-recognized digital certification upon successful completion of the cohort and final project.",
            certType: courseData.title || "Specialist",
            skillsLearned: CATEGORIES.join(", "),
          }}
        />

        <div className="reveal-section mt-40"><FAQSection /></div>

        <section ref={enrollmentRef} className="pt-20">
          <PrishEnrollment courseData={courseData} title={courseData.title} price={PRICE} oldPrice={OLD_PRICE} />
        </section>
      </main>

      {/* STICKY CTA - SLEEKER DESIGN */}
      <div className="sticky-cta fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[480px]">
        <div className="bg-bg/80 backdrop-blur-3xl border border-white/15 rounded-[32px] p-3 flex items-center justify-between shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]">
          <div className="pl-6">
            <div className="flex flex-col">
              <span className="text-[9px] text-accent font-black uppercase tracking-widest mb-0.5">Limited Slots</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-white tracking-tighter">₹{PRICE}</span>
                <span className="text-xs text-white/30 line-through font-medium">₹{OLD_PRICE}</span>
              </div>
            </div>
          </div>
          <button onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-accent text-bg px-10 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-[0_10px_20px_rgba(var(--accent-rgb),0.2)] transition-transform hover:scale-[1.02] active:scale-95">
            Join Cohort
          </button>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --accent-rgb: ${courseData?.accentColorRgb || '59, 130, 246'}; /* Add this to your courseData or use a fallback */
        }
        .glass { 
            background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
            backdrop-filter: blur(20px); 
        }
        @font-face {
          font-family: 'Inter';
          font-display: swap;
        }
        body {
            background-color: #000;
        }
      `}</style>
    </div>
  );
};