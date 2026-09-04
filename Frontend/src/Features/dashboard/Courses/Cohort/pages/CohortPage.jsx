import React, { useRef, useLayoutEffect, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  ArrowRight, ChevronDown, Check, Download, Globe, Sparkles, Server, Code, BookOpen
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

// Assuming these are external components/hooks
import { FluidBackground } from "../../../Home/components/FluidBackground";
import ComparisonSection from "../../../Home/components/ComparisonSection";
import { FAQSection } from '../../../Home/components/FAQSection';
import CertificationSection from '../component/CertificationSection';
import { PrishEnrollment } from '../component/PrishEnrollment';
import { useCertificate } from '../../hooks/useCertificate';
import { useEnrollment } from "../../hooks/useEnrollment";

gsap.registerPlugin(ScrollTrigger);

const getIcon = (title) => {
  const t = title?.toLowerCase() || "";
  if (t.includes('web')) return <Globe className="w-5 h-5" />;
  if (t.includes('ai')) return <Sparkles className="w-5 h-5" />;
  if (t.includes('server')) return <Server className="w-5 h-5" />;
  return <Code className="w-5 h-5" />;
};

const SyllabusCard = ({ section, isOpen, toggle, index }) => {
  return (
    <motion.div 
      layout
      className={`group relative mb-4 overflow-hidden rounded-[24px] border transition-all duration-500 ${
        isOpen ? 'bg-white/[0.05] border-accent/40 shadow-2xl shadow-accent/5' : 'bg-white/[0.02] border-white/5 hover:border-white/20'
      }`}
    >
      <div 
        onClick={toggle}
        className="p-6 md:p-8 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-accent text-bg scale-110' : 'bg-white/5 text-accent border border-white/10'}`}>
              {getIcon(section.title)}
            </div>
            <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-bg px-1.5 border border-white/10 rounded-md text-accent/60">
              0{index + 1}
            </span>
          </div>
          <div>
            <h3 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white/60'}`}>
              {section.title}
            </h3>
            <p className="text-xs text-text-secondary/40 uppercase tracking-widest mt-1">
              {section.topics?.length || 0} Modules • Practical Lab
            </p>
          </div>
        </div>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.2 : 1 }}
          className={isOpen ? "text-accent" : "text-white/20"}
        >
          <ChevronDown size={24} strokeWidth={1.5} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="px-6 md:px-8 pb-8 pt-2 grid md:grid-cols-2 gap-10 border-t border-white/5 mt-2">
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.3em] text-accent font-black">Curriculum Breakdown</h4>
                <ul className="grid gap-3">
                  {section.topics?.map((topic, j) => (
                    <motion.li 
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: j * 0.05 }}
                      key={j} 
                      className="flex items-start gap-3 text-text-secondary/80 text-sm leading-relaxed group/item"
                    >
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/40 group-hover/item:bg-accent transition-colors" />
                      <span className="group-hover/item:text-text transition-colors">{topic}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-3xl p-6 border border-white/5 self-start">
                <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black mb-4">Mastered Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {section.tools?.map((tool, i) => (
                    <span key={i} className="px-4 py-2 bg-bg border border-white/10 rounded-xl text-[10px] font-mono text-accent/80 uppercase tracking-widest">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const CohortPage = ({ courseData }) => {
  const containerRef = useRef(null);
  const enrollmentRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { user } = useSelector((state) => state.auth);
  const { myCertificates, getMyCertificates } = useCertificate();
  const { enrollments } = useEnrollment();

  useEffect(() => { getMyCertificates(); }, []);

  const PRICE = Math.floor(courseData?.price || 0);
  const OLD_PRICE = Math.floor(courseData?.oldPrice || 0);
  const titleWords = (courseData?.title || "Python Programming").split(' ');
  const firstPart = titleWords[0];
  const restPart = titleWords.slice(1).join(' ');

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Hero Image Parallax
      gsap.to(".hero-img-card", {
        y: -40,
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      // Reveal animations
      gsap.from(".reveal-up", {
        y: 60, opacity: 0, stagger: 0.15, duration: 1.2, ease: "power4.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#0A0A0A] text-text min-h-screen selection:bg-accent/30 overflow-x-hidden font-sans">
      
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <FluidBackground />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(154,117,114,0.1),transparent_50%)]" />
      </div>

      <main className="relative z-10 pt-24 md:pt-40 px-6 max-w-7xl mx-auto">
        
        {/* HERO SECTION - REPLICATING IMAGE DESIGN */}
        <section className="hero-section grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center mb-32 md:mb-56">
          <div className="order-2 lg:order-1">
            <div className="reveal-up inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/80">
                Master Python From Zero to Advanced
              </span>
            </div>
            
            <h1 className="reveal-up text-6xl md:text-[110px] font-bold leading-[0.85] tracking-tighter text-white mb-10">
              {firstPart} <br />
              <span className="italic font-serif text-[#9A7572] font-normal">{restPart}</span>
            </h1>

            <p className="reveal-up text-lg md:text-xl text-text-secondary/60 max-w-xl mb-12 leading-relaxed font-light">
              Master Python programming from the fundamentals to advanced concepts by building real-world applications, working with APIs, databases, automation, and data structures.
            </p>

            <div className="reveal-up flex flex-wrap items-center gap-12">
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-bold text-white tracking-tighter">₹{PRICE}</span>
                <span className="text-xl text-white/20 line-through font-light">₹{OLD_PRICE}</span>
              </div>
              
              <button
                onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-12 py-6 bg-[#9A7572] text-white font-black rounded-2xl overflow-hidden transition-transform active:scale-95"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-3 uppercase tracking-[0.2em] text-[11px]">
                  Enroll Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>

          {/* THEMATIC IMAGE CARD */}
          <div className="order-1 lg:order-2">
            <div className="hero-img-card relative group">
              <div className="absolute -inset-4 bg-accent/20 blur-[100px] rounded-full opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl aspect-[4/5] bg-[#0F0F0F]">
                <img 
                  src={courseData.thumbnail} 
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" 
                  alt="Course Thumbnail" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                
                {/* Floating Tags for UI Interaction */}
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                   <div className="space-y-2">
                      <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-[9px] uppercase tracking-widest text-white/80 w-fit">Live Cohort</div>
                      <div className="text-xl font-bold text-white tracking-tight">Project Based Learning</div>
                   </div>
                   <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                      <Sparkles className="text-bg w-6 h-6" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CURRICULUM SECTION */}
        <section className="mb-40">
          <div className="grid lg:grid-cols-[0.4fr_0.6fr] gap-20">
            <div className="sticky top-32 h-fit space-y-6">
              <span className="text-accent text-[10px] tracking-[0.5em] uppercase font-black">Structure</span>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.9]">
                The <br /><span className="text-accent italic font-serif font-normal">Syllabus</span>
              </h2>
              <p className="text-text-secondary/50 max-w-xs text-sm leading-relaxed">
                An industry-grade path designed to take you from absolute zero to building production-ready architectures.
              </p>
              <button 
                onClick={() => {}} // Handle PDF Download
                className="flex items-center gap-3 text-white/40 hover:text-accent transition-colors text-[10px] font-black uppercase tracking-widest pt-4"
              >
                <Download size={16} /> Get PDF Guide
              </button>
            </div>

            <div className="space-y-4">
              {courseData.syllabus?.map((section, index) => (
                <SyllabusCard 
                  key={index} 
                  index={index} 
                  section={section} 
                  isOpen={activeIndex === index} 
                  toggle={() => setActiveIndex(activeIndex === index ? null : index)} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof / Comparison */}
        <div className="reveal-up"><ComparisonSection /></div>

        {/* ENROLLMENT FINAL CTA */}
        <section ref={enrollmentRef} className="py-20">
          <PrishEnrollment courseData={courseData} title={courseData.title} price={PRICE} oldPrice={OLD_PRICE} />
        </section>

        <CertificationSection
          userCertificate={null}
          user={{ ...user, enrollments }}
          data={{
            _id: courseData?._id,
            isEnrolled: false,
            mainHeading: "Industry-Ready",
            highlightedText: "Certification",
            description: "Validate your engineering skills with a verifiable certificate recognized by top tech firms.",
            certType: "Python Specialist",
            skillsLearned: "Backend, Automation, Data Science",
          }}
        />

        <FAQSection />
      </main>

      {/* STICKY CTA - SMART MOBILE UI */}
      <AnimatePresence>
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[500px]"
        >
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-3 flex items-center justify-between shadow-2xl">
            <div className="pl-6">
              <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-1">Price for you</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-white tracking-tighter">₹{PRICE}</span>
                <span className="text-xs text-white/20 line-through">₹{OLD_PRICE}</span>
              </div>
            </div>
            <button 
              onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-bg h-14 px-10 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors duration-300"
            >
              Start Learning
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:italic&display=swap');
        
        .font-serif {
          font-family: 'Instrument Serif', serif;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: #1F1F1F; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #9A7572; }

        html {
            scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};