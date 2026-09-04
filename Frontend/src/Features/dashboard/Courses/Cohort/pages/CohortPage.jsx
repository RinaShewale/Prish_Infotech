import React, { useRef, useLayoutEffect, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  ArrowRight, CheckCircle2, Terminal, MousePointer2, ChevronDown, Check, Globe, Sparkles, Server, Code, BookOpen, Download
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

// Helper to map icons based on module title keywords
const getIcon = (title) => {
  const t = title?.toLowerCase() || "";
  if (t.includes('web') || t.includes('frontend')) return <Globe className="w-5 h-5" />;
  if (t.includes('ai') || t.includes('gen')) return <Sparkles className="w-5 h-5" />;
  if (t.includes('cloud') || t.includes('devops') || t.includes('server')) return <Server className="w-5 h-5" />;
  if (t.includes('system') || t.includes('design') || t.includes('dsa')) return <Code className="w-5 h-5" />;
  return <BookOpen className="w-5 h-5" />;
};

const SyllabusCard = ({ section, isOpen, toggle, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative mb-5"
    >
      <div 
        onClick={toggle}
        className={`glass rounded-2xl md:rounded-[32px] transition-all duration-500 border border-white/5 ${
          isOpen ? 'bg-white/[0.04] border-accent/30' : 'hover:border-accent/20 bg-white/[0.02]'
        }`}
      >
        <div className="p-6 md:p-8 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-6" style={{ transform: "translateZ(30px)" }}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-accent text-bg' : 'bg-white/5 text-accent border border-white/10'}`}>
              {getIcon(section.title)}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-accent/60 font-bold mb-1 block">
                0{index + 1} — {section.phase || 'Module'}
              </span>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase">
                {section.title}
              </h3>
            </div>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className={isOpen ? "text-accent" : "text-white/20"}>
            <ChevronDown size={24} strokeWidth={1.5} />
          </motion.div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="overflow-hidden px-6 md:px-8 pb-8"
            >
              <div className="pt-8 grid md:grid-cols-2 gap-10 border-t border-white/10" style={{ transform: "translateZ(20px)" }}>
                <div className="space-y-5">
                  <h4 className="font-serif italic text-accent text-lg flex items-center gap-3">
                    <ArrowRight size={14} className="not-italic" /> Curriculum Breakdown
                  </h4>
                  <ul className="space-y-3">
                    {section.topics?.map((topic, j) => (
                      <li key={j} className="flex items-start gap-3 text-text-secondary/70 text-sm leading-relaxed group/item">
                        <Check size={14} className="mt-1 text-accent/50 group-hover/item:text-accent transition-colors shrink-0" />
                        <span className="group-hover:text-text transition-colors">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {section.tools && (
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 h-fit">
                    <h4 className="text-text-secondary/30 text-[9px] font-black uppercase tracking-widest mb-4">Core Modules & Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {section.tools.map((tool, i) => (
                        <span key={i} className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[9px] font-mono text-accent uppercase tracking-wider">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

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

  // PDF Download Logic
  const handleDownloadPDF = () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      let yPosition = 20;
      const margin = 15;
      const maxWidth = pdf.internal.pageSize.getWidth() - 2 * margin;

      pdf.setFontSize(24);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${courseData.title} - Syllabus`, margin, yPosition);
      yPosition += 15;

      SYLLABUS.forEach((section, idx) => {
        if (yPosition > 270) { pdf.addPage(); yPosition = 20; }
        
        pdf.setFontSize(14);
        pdf.setFont(undefined, "bold");
        pdf.text(`Module 0${idx + 1}: ${section.title}`, margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont(undefined, "normal");
        section.topics?.forEach(topic => {
          const splitTopic = pdf.splitTextToSize(`• ${topic}`, maxWidth - 10);
          pdf.text(splitTopic, margin + 5, yPosition);
          yPosition += (splitTopic.length * 5);
        });
        yPosition += 5;
      });

      pdf.save(`${courseData.title}_Syllabus.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
    }
  };

  useLayoutEffect(() => {
    if (!courseData) return;
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".hero-reveal", { y: 40, opacity: 0, stagger: 0.08, duration: 1.5 });
      
      gsap.utils.toArray('.reveal-section').forEach(section => {
        gsap.from(section, {
          scrollTrigger: { trigger: section, start: "top 85%" },
          y: 40, opacity: 0, duration: 1.2, ease: "power3.out"
        });
      });

      gsap.fromTo(".sticky-cta", { y: 150, opacity: 0 }, {
        scrollTrigger: { trigger: "body", start: "1000px top", toggleActions: "play none none reverse" },
        y: 0, opacity: 1, duration: 0.8
      });
    }, containerRef);
    return () => ctx.revert();
  }, [courseData]);

  return (
    <div ref={containerRef} className="bg-bg text-text min-h-screen selection:bg-accent/30 overflow-x-hidden relative font-sans">
      
      {/* BACKGROUND ELEMENTS */}
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
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-4">
                  <span className="text-5xl md:text-7xl font-bold text-white tracking-tighter">₹{PRICE}</span>
                  <span className="text-lg md:text-xl text-white/20 line-through decoration-accent/40">₹{OLD_PRICE}</span>
                </div>
              </div>
              <button
                onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-10 py-5 bg-accent text-bg font-black rounded-2xl hover:scale-105 transition-all duration-500 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
              >
                Reserve Your Seat <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div ref={heroImageRef} className="order-1 lg:order-2 perspective-1000">
             <div className="relative rounded-[32px] md:rounded-[40px] overflow-hidden border border-white/10 aspect-square bg-black/40 backdrop-blur-3xl shadow-2xl">
                <img src={courseData.thumbnail} className="w-full h-full object-cover grayscale-[0.2]" alt={courseData.title} />
             </div>
          </div>
        </section>

        {/* NEW SYLLABUS SECTION */}
        {SYLLABUS.length > 0 && (
          <section ref={syllabusRef} className="reveal-section mb-24 md:mb-48">
             <header className="text-center mb-16 md:mb-24">
                <div className="inline-block px-4 py-1 border border-accent/20 bg-accent/5 mb-6">
                    <span className="text-accent text-[10px] tracking-[0.4em] uppercase font-bold">Curriculum</span>
                </div>
                <h2 className="text-5xl md:text-[80px] font-bold tracking-tighter text-white leading-tight mb-4">
                  What You'll Study<span className="text-accent">.</span>
                </h2>
                <p className="text-lg text-text-secondary/50 max-w-2xl mx-auto">
                  A comprehensive roadmap from fundamentals to industry-grade architecture.
                </p>
            </header>

            <div className="max-w-4xl mx-auto perspective-1000">
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

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-20 flex flex-col items-center gap-6">
              <button 
                onClick={handleDownloadPDF}
                className="group relative glass px-10 py-4 rounded-full font-bold overflow-hidden transition-all hover:scale-105 border border-white/10 cursor-pointer"
              >
                <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity" />
                <span className="relative z-10 flex items-center gap-3 text-white uppercase text-xs tracking-widest font-black">
                  <Download size={18} className="text-accent" />
                  Download PDF Syllabus
                </span>
              </button>
            </motion.div>
          </section>
        )}

        <div className="reveal-section mb-24 md:mb-48">
          <ComparisonSection />
        </div>

        {/* QUOTE SECTION */}
        <section className="reveal-section mb-24 md:mb-48 relative group px-2">
          <div className="relative py-16 md:py-32 px-6 bg-white/[0.02] border border-white/10 rounded-[40px] md:rounded-[100px] text-center overflow-hidden">
            <h2 className="text-3xl md:text-6xl lg:text-[80px] font-bold text-white mb-10 md:mb-16 leading-[1.1] tracking-tighter">
              {courseData.heroQuote || "Don't Just Use AI."} <br />
              <span className="text-accent italic font-serif">Engineer It.</span>
            </h2>
            <div className="flex justify-center">
              <button onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="group relative flex items-center justify-center gap-4 px-8 md:px-16 py-6 md:py-10 bg-white text-bg rounded-full transition-all hover:scale-[1.03]">
                <span className="text-xs md:text-2xl font-black uppercase tracking-tighter">ENROLL NOW</span>
                <ArrowRight className="w-5 h-5 md:w-8 md:h-8" />
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
            description: "Earn a specialized certification upon successful completion.",
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
          </div>
          <button onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-accent text-bg px-6 py-4 md:px-10 md:py-5 rounded-[18px] md:rounded-[26px] font-black text-[10px] md:text-[11px] uppercase tracking-widest">
            Enroll Now
          </button>
        </div>
      </div>

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
      `}</style>
    </div>
  );
};