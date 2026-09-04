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
    <div className="relative mb-4">
      <div 
        onClick={toggle}
        className={`glass rounded-2xl md:rounded-[28px] transition-all duration-500 border ${
          isOpen ? 'bg-white/[0.05] border-accent/40' : 'hover:border-white/20 border-white/5 bg-white/[0.02]'
        }`}
      >
        <div className="p-5 md:p-7 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-accent text-bg' : 'bg-white/5 text-accent border border-white/10'}`}>
              {getIcon(section.title)}
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-accent/60 font-bold mb-0.5 block">
                Module 0{index + 1}
              </span>
              <h3 className="text-lg md:text-xl font-bold tracking-tight text-white uppercase">
                {section.title}
              </h3>
            </div>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className={isOpen ? "text-accent" : "text-white/20"}>
            <ChevronDown size={20} />
          </motion.div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden px-5 md:px-7 pb-7"
            >
              <div className="pt-6 grid md:grid-cols-2 gap-8 border-t border-white/10">
                <div className="space-y-4">
                  <h4 className="font-serif italic text-accent text-base flex items-center gap-2">
                    <ArrowRight size={14} className="not-italic" /> Curriculum Breakdown
                  </h4>
                  <ul className="space-y-2.5">
                    {section.topics?.map((topic, j) => (
                      <li key={j} className="flex items-start gap-3 text-text-secondary/80 text-sm leading-relaxed group/item">
                        <Check size={14} className="mt-1 text-accent/50 shrink-0" />
                        <span className="group-hover:text-text transition-colors">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {section.tools && (
                  <div className="bg-black/20 border border-white/5 rounded-2xl p-5 h-fit">
                    <h4 className="text-text-secondary/40 text-[9px] font-black uppercase tracking-widest mb-4">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {section.tools.map((tool, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-mono text-accent/80 uppercase tracking-wider">
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
    </div>
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
      gsap.from(".hero-reveal", { y: 30, opacity: 0, stagger: 0.1, duration: 1.2, ease: "power4.out" });
      gsap.from(".hero-img-container", { scale: 0.9, opacity: 0, duration: 1.5, ease: "expo.out", delay: 0.3 });
      gsap.utils.toArray('.reveal-section').forEach(s => {
        gsap.from(s, { scrollTrigger: { trigger: s, start: "top 90%" }, y: 30, opacity: 0, duration: 1 });
      });
      gsap.fromTo(".sticky-cta", { y: 100 }, {
        scrollTrigger: { trigger: "body", start: "800px top", toggleActions: "play none none reverse" },
        y: 0, duration: 0.6
      });
    }, containerRef);
    return () => ctx.revert();
  }, [courseData]);

  return (
    <div ref={containerRef} className="bg-bg text-text min-h-screen selection:bg-accent/30 overflow-x-hidden relative font-sans">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FluidBackground />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/40 to-bg" />
      </div>

      <main className="relative z-10 pt-24 md:pt-36 pb-20 px-6 max-w-7xl mx-auto">

        {/* HERO SECTION */}
        <section className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center mb-32 md:mb-48">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="hero-reveal inline-flex items-center gap-2 px-3 py-1 border border-accent/20 bg-accent/5 rounded-full mb-8">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-accent">
                {courseData.heroHighlight || "Engineering Cohort"}
              </span>
            </div>
            <h1 className="hero-reveal text-5xl sm:text-7xl lg:text-[88px] font-bold leading-[0.85] tracking-tighter text-white mb-8">
              {mainTitle} <br />
              <span className="italic font-serif text-accent">{lastWord}</span>
            </h1>
            <p className="hero-reveal text-lg md:text-xl text-text-secondary/70 max-w-xl mb-10 mx-auto lg:mx-0 font-light leading-relaxed">
              {courseData.description}
            </p>
            <div className="hero-reveal flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-10">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-white tracking-tighter">₹{PRICE}</span>
                <span className="text-lg text-white/20 line-through">₹{OLD_PRICE}</span>
              </div>
              <button
                onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-10 py-5 bg-accent text-bg font-black rounded-2xl hover:scale-[1.03] active:scale-95 transition-all uppercase tracking-widest text-[11px] flex items-center justify-center gap-3"
              >
                Enroll Now <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* IMAGE CONTAINER */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
             <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="hero-img-container relative w-full max-w-[480px] lg:max-w-[540px] aspect-square"
             >
                <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full opacity-30 translate-y-10 scale-110" />
                <div className="relative h-full w-full rounded-[48px] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black/40 group">
                    <img 
                      src={courseData.thumbnail} 
                      className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" 
                      alt={courseData.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-60" />
                </div>
             </motion.div>
          </div>
        </section>

        {/* SYLLABUS SECTION */}
        {SYLLABUS.length > 0 && (
          <section ref={syllabusRef} className="reveal-section mb-32 md:mb-48">
             <header className="text-center mb-16 md:mb-20">
                <span className="text-accent text-[10px] tracking-[0.4em] uppercase font-black mb-4 block">The Curriculum</span>
                <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-white leading-tight">
                  Master the Craft<span className="text-accent">.</span>
                </h2>
            </header>

            <div className="max-w-4xl mx-auto">
              {SYLLABUS.map((section, index) => (
                <SyllabusCard key={index} index={index} section={section} isOpen={activeIndex === index} toggle={() => setActiveIndex(activeIndex === index ? null : index)} />
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-16 flex justify-center">
              <button onClick={handleDownloadPDF} className="group flex items-center gap-3 px-8 py-4 rounded-full border border-white/10 hover:border-accent/40 transition-all text-white/60 hover:text-white uppercase text-[10px] tracking-[0.2em] font-black">
                <Download size={16} className="text-accent" /> Download Full Syllabus
              </button>
            </motion.div>
          </section>
        )}

        <div className="reveal-section mb-32 md:mb-48"><ComparisonSection /></div>

        {/* REFINED SMALLER QUOTE SECTION */}
        <section className="reveal-section mb-32 md:mb-48 px-2">
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8 }}
            className="relative py-16 md:py-24 bg-white/[0.03] border border-white/10 rounded-[40px] md:rounded-[60px] text-center overflow-hidden group max-w-5xl mx-auto"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/5 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10 px-6">
              <h2 className="text-3xl md:text-6xl font-bold text-white mb-10 leading-[1.1] tracking-tighter">
                {courseData.heroQuote || "Don't Just Use AI."} <br />
                <span className="text-accent italic font-serif inline-block">Engineer It.</span>
              </h2>
              <button 
                onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} 
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-bg rounded-2xl transition-all hover:bg-accent hover:text-bg active:scale-95 font-black uppercase tracking-tighter text-xs md:text-lg shadow-xl"
              >
                SECURE YOUR SPOT 
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </section>

        <CertificationSection
          userCertificate={currentUserCertificate}
          user={{ ...user, enrollments }}
          data={{
            _id: courseData?._id,
            isEnrolled: courseData?.isEnrolled,
            mainHeading: "Verified",
            highlightedText: "Expertise",
            description: "Receive a professional certification upon successful completion to showcase your skills to the world.",
            certType: courseData.title || "Specialist",
            skillsLearned: CATEGORIES.join(", "),
          }}
        />

        <div className="reveal-section mt-32 md:mt-48"><FAQSection /></div>

        <section ref={enrollmentRef} className="pt-20">
          <PrishEnrollment courseData={courseData} title={courseData.title} price={PRICE} oldPrice={OLD_PRICE} />
        </section>
      </main>

      {/* STICKY CTA */}
      <div className="sticky-cta fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[420px]">
        <div className="bg-bg/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-2.5 flex items-center justify-between shadow-2xl">
          <div className="pl-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white tracking-tighter">₹{PRICE}</span>
              <span className="text-[10px] text-white/20 line-through">₹{OLD_PRICE}</span>
            </div>
          </div>
          <button onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-accent text-bg px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-accent/20 transition-transform active:scale-95">
            Join Cohort
          </button>
        </div>
      </div>

      <style jsx global>{`
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); }
      `}</style>
    </div>
  );
};