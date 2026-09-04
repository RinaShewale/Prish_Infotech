import React, { useRef, useLayoutEffect, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  ArrowRight, ChevronDown, Check, Globe, Sparkles, Server, Code, BookOpen, Download, Cpu, Zap
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
  // FIX: Proper padding for numbers (1 -> 01, 10 -> 10)
  const moduleNumber = (index + 1).toString().padStart(2, '0');

  return (
    <div className="relative mb-6 group">
      <div 
        onClick={toggle}
        className={`glass rounded-[28px] transition-all duration-500 border overflow-hidden ${
          isOpen 
          ? 'bg-white/[0.04] border-accent/40 shadow-[0_0_50px_rgba(var(--accent-rgb),0.1)]' 
          : 'hover:border-white/20 border-white/5 bg-white/[0.01]'
        }`}
      >
        <div className="p-6 md:p-8 flex items-center justify-between cursor-pointer relative z-10">
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-accent text-bg scale-110 shadow-lg shadow-accent/20' : 'bg-white/5 text-accent border border-white/10'}`}>
              {getIcon(section.title)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-black">
                  Module {moduleNumber}
                </span>
                {isOpen && <motion.span layoutId="active-dot" className="w-1 h-1 rounded-full bg-accent" />}
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase group-hover:text-accent transition-colors">
                {section.title}
              </h3>
            </div>
          </div>
          <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all ${isOpen ? 'bg-white text-bg rotate-180 scale-90' : 'text-white/40 group-hover:border-accent/40'}`}>
            <ChevronDown size={18} />
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-6 md:px-8 pb-8">
                <div className="h-[1px] w-full bg-gradient-to-r from-accent/20 via-white/5 to-transparent mb-8" />
                <div className="grid md:grid-cols-[1.4fr_1fr] gap-10">
                  <div className="space-y-5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Detailed Curriculum</h4>
                    <ul className="grid gap-3">
                      {section.topics?.map((topic, j) => (
                        <li key={j} className="flex items-start gap-4 group/item">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent/30 mt-1.5 transition-colors group-hover/item:bg-accent" />
                          <span className="text-white/70 text-[15px] leading-relaxed group-hover/item:text-white transition-colors">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {section.tools && (
                    <div className="space-y-4">
                      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
                        <h4 className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-5 flex items-center gap-2">
                           <Zap size={12} className="text-accent" /> Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {section.tools.map((tool, i) => (
                            <span key={i} className="px-3 py-1.5 bg-accent/5 border border-accent/20 rounded-xl text-[10px] font-mono text-accent uppercase tracking-wider">{tool}</span>
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
      gsap.from(".hero-reveal", { y: 50, opacity: 0, stagger: 0.1, duration: 1.2, ease: "expo.out" });
      gsap.from(".hero-img-anim", { scale: 0.9, opacity: 0, duration: 1.8, ease: "expo.out", delay: 0.3 });
      gsap.utils.toArray('.reveal-section').forEach(s => {
        gsap.from(s, { scrollTrigger: { trigger: s, start: "top 85%" }, y: 40, opacity: 0, duration: 1, ease: "power2.out" });
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
      
      {/* Background with Grid and Noise */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FluidBackground />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/80 to-bg" />
      </div>

      <main className="relative z-10 pt-32 md:pt-48 pb-20 px-6 max-w-7xl mx-auto">

        {/* HERO SECTION */}
        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-center mb-44">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="hero-reveal inline-flex items-center gap-3 px-4 py-2 border border-accent/20 bg-accent/5 rounded-full mb-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-[11px] font-black tracking-[0.3em] uppercase text-accent">
                {courseData.heroHighlight || "Professional Cohort"}
              </span>
            </div>
            <h1 className="hero-reveal text-5xl sm:text-7xl lg:text-[100px] font-bold leading-[0.85] tracking-tighter text-white mb-10">
              {mainTitle} <br />
              <span className="italic font-serif text-accent">{lastWord}</span>
            </h1>
            <p className="hero-reveal text-lg md:text-2xl text-white/50 max-w-xl mb-12 mx-auto lg:mx-0 font-medium leading-relaxed">
              {courseData.description}
            </p>
            <div className="hero-reveal flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-12">
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-2">Total Investment</span>
                <div className="flex items-baseline gap-4">
                    <span className="text-6xl font-bold text-white tracking-tighter">₹{PRICE}</span>
                    <span className="text-2xl text-white/20 line-through font-light">₹{OLD_PRICE}</span>
                </div>
              </div>
              <button
                onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-12 py-7 bg-accent text-bg font-black rounded-[24px] hover:scale-[1.03] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-4 shadow-[0_20px_60px_rgba(var(--accent-rgb),0.3)]"
              >
                Join the Cohort <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* ANIMATED HERO IMAGE */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
             <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="hero-img-anim relative w-full max-w-[440px]"
             >
                <div className="absolute -inset-10 bg-accent/20 blur-[120px] rounded-full opacity-30" />
                <div className="relative aspect-square rounded-[48px] overflow-hidden border border-white/10 shadow-2xl bg-black/40 group">
                    <img src={courseData.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={courseData.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-accent/10 rounded-xl">
                                    <Cpu size={20} className="text-accent" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">Industrial Grade</h4>
                                    <p className="text-white/40 text-[10px] uppercase tracking-wider font-black">Curriculum v2.0</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </motion.div>
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
              {SYLLABUS.map((section, index) => (
                <SyllabusCard key={index} index={index} section={section} isOpen={activeIndex === index} toggle={() => setActiveIndex(activeIndex === index ? null : index)} />
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-20 flex justify-center">
              <button onClick={handleDownloadPDF} className="group flex items-center gap-4 px-10 py-5 rounded-2xl border border-white/10 hover:border-accent/40 bg-white/[0.02] transition-all text-white/50 hover:text-white uppercase text-[11px] tracking-[0.2em] font-black">
                <Download size={18} className="text-accent group-hover:translate-y-0.5 transition-transform" /> Full Syllabus PDF
              </button>
            </motion.div>
          </section>
        )}

        <div className="reveal-section mb-44"><ComparisonSection /></div>

        {/* QUOTE SECTION - IMPROVED UI */}
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

      {/* STICKY CTA - RESPONSIVE & SLEEK */}
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
        :root {
          --accent-rgb: 255, 107, 0; /* Dynamic fallback */
        }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(24px); }
        body { background-color: #000; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #333; }
      `}</style>
    </div>
  );
};