import React, { useRef, useLayoutEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, BrainCircuit, Zap, ChevronRight, Cpu, Layers, Globe, MousePointer2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Integrated Components
import { FluidBackground } from "../../../components/FluidBackground";
import ComparisonSection from "../../../components/ComparisonSection";
import { FAQSection } from '../../../components/FAQSection';
import CertificationSection from '../component/CertificationSection';
import { PrishEnrollment } from '../component/PrishEnrollment';

gsap.registerPlugin(ScrollTrigger);

export const AICohortDetails = ({ courseData }) => {
  const containerRef = useRef(null);
  const syllabusRef = useRef(null);
  const enrollmentRef = useRef(null);
  const contentRef = useRef(null);
  const heroImageRef = useRef(null);
  const [activeModule, setActiveModule] = useState(0);

  const PRICE = Math.floor(courseData.price);
  const OLD_PRICE = Math.floor(courseData.price * 2.5);

  const SYLLABUS = [
    { 
      phase: "Phase 01", title: "Foundations of Gen-AI", 
      icon: <BrainCircuit className="w-5 h-5" />,
      topics: ["Attention & Transformers", "Tokenization & Embeddings", "Prompt Engineering Patterns", "Open Source Ecosystem"],
      tools: ["PyTorch", "HuggingFace"],
      duration: "Week 1-3"
    },
    { 
      phase: "Phase 02", title: "RAG & Vector DBs", 
      icon: <Layers className="w-5 h-5" />,
      topics: ["Semantic Search", "Chunking Strategies", "Pinecone & Milvus", "Evaluation (RAGAS)"],
      tools: ["Pinecone", "LangChain"],
      duration: "Week 4-6"
    },
    { 
      phase: "Phase 03", title: "Agentic Workflows", 
      icon: <Zap className="w-5 h-5" />,
      topics: ["LangGraph State Management", "Multi-Agent Systems", "Tool Calling", "Looping Workflows"],
      tools: ["LangGraph", "CrewAI"],
      duration: "Week 7-9"
    },
    { 
      phase: "Phase 04", title: "Production & MLOps", 
      icon: <Cpu className="w-5 h-5" />,
      topics: ["Model Quantization", "Serving with vLLM", "Hallucination Monitoring", "Dockerizing Services"],
      tools: ["vLLM", "Docker"],
      duration: "Week 10-12"
    }
  ];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Entrance for Hero
      gsap.from(".hero-reveal", { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out" });

      // Trigger sections on scroll
      gsap.utils.toArray('.reveal-section').forEach(section => {
        gsap.from(section, {
          scrollTrigger: { trigger: section, start: "top 90%" },
          y: 30, opacity: 0, duration: 0.8, ease: "power2.out"
        });
      });

      // Sticky CTA logic
      gsap.from(".sticky-cta", {
        scrollTrigger: { trigger: "body", start: "top -5%", toggleActions: "play none none reverse" },
        y: 100, opacity: 0, duration: 0.4, ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleTabChange = (index) => {
    if(index === activeModule) return;
    gsap.to(contentRef.current, {
        opacity: 0, x: -10, duration: 0.2,
        onComplete: () => {
            setActiveModule(index);
            gsap.to(contentRef.current, { opacity: 1, x: 0, duration: 0.3 });
        }
    });
  };

  const titleWords = courseData.title.split(' ');
  const mainTitle = titleWords.slice(0, -1).join(' ');
  const lastWord = titleWords.slice(-1);

  return (
    <div ref={containerRef} className="text-text min-h-screen bg-bg selection:bg-accent/30 overflow-x-hidden relative font-sans">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FluidBackground />
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: `linear-gradient(rgba(var(--accent-rgb), 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb), 0.5) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/20 to-bg" />
      </div>
      
      <main className="relative z-10 pt-24 md:pt-44 pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <section className="grid lg:grid-cols-2 gap-12 items-center mb-32 md:mb-56">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <span className="hero-reveal px-4 py-1.5 border border-accent/20 bg-accent/5 rounded-full text-[10px] font-black tracking-[0.3em] uppercase text-accent mb-6 inline-block">Engineering Cohort</span>
            <h1 className="hero-reveal text-5xl sm:text-7xl md:text-[100px] font-bold leading-[0.9] tracking-tighter text-white mb-8">
              {mainTitle} <br />
              <span className="italic font-serif text-accent">{lastWord}</span>
            </h1>
            <p className="hero-reveal text-lg md:text-xl text-text-secondary/70 max-w-xl mb-10 mx-auto lg:mx-0 font-light">
              {courseData.description}
            </p>
            <div className="hero-reveal flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
                <div className="flex items-baseline gap-3">
                    <span className="text-5xl md:text-6xl font-bold text-white tracking-tighter">₹{PRICE}</span>
                    <span className="text-lg text-text-secondary/20 line-through">₹{OLD_PRICE}</span>
                </div>
                <button 
                  onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} 
                  className="w-full sm:w-auto px-10 py-5 bg-accent text-bg font-black rounded-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl"
                >
                  START LEARNING <ArrowRight className="w-4 h-4" />
                </button>
            </div>
          </div>

          <div className="hero-reveal order-1 lg:order-2">
             <div className="relative group max-w-[500px] mx-auto">
                <div className="absolute -inset-4 bg-accent/20 blur-[80px] rounded-full opacity-20" />
                <div className="relative rounded-[40px] overflow-hidden border border-white/10 aspect-[4/5] bg-black/40 backdrop-blur-3xl shadow-2xl">
                    <img src={courseData.thumbnail} className="w-full h-full object-cover grayscale-[0.2]" alt="Hero" />
                </div>
             </div>
          </div>
        </section>

        {/* SYLLABUS SECTION */}
        <section ref={syllabusRef} className="reveal-section mb-32 md:mb-56">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter mb-4">Curriculum</h2>
            <p className="text-text-secondary/50 text-sm md:text-base">A multi-phase roadmap for high-performance AI Engineering.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
              {SYLLABUS.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleTabChange(idx)}
                  className={`flex-shrink-0 lg:w-full p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                    activeModule === idx ? "bg-accent border-accent text-bg" : "bg-white/[0.03] border-white/5 text-text-secondary hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black opacity-40">0{idx + 1}</span>
                    <h3 className="font-bold uppercase text-[11px] tracking-widest whitespace-nowrap">{item.title}</h3>
                  </div>
                  <ChevronRight className={`hidden md:block w-4 h-4 transition-transform ${activeModule === idx ? "rotate-90" : ""}`} />
                </button>
              ))}
            </div>

            <div className="lg:col-span-8">
              <div className="bg-white/[0.02] border border-white/10 rounded-[40px] p-8 md:p-16 min-h-[450px] backdrop-blur-3xl">
                <div ref={contentRef} className="relative z-10">
                    <span className="text-accent font-black tracking-widest uppercase text-[9px] block mb-6">{SYLLABUS[activeModule].duration}</span>
                    <h3 className="text-3xl md:text-6xl font-bold text-white mb-10 tracking-tighter">{SYLLABUS[activeModule].title}</h3>
                    <div className="grid md:grid-cols-2 gap-10">
                        <ul className="space-y-5">
                            {SYLLABUS[activeModule].topics.map((t, i) => (
                                <li key={i} className="flex gap-3 text-base md:text-lg text-text-secondary font-light">
                                    <CheckCircle2 className="w-5 h-5 text-accent/40 shrink-0 mt-0.5" /> {t}
                                </li>
                            ))}
                        </ul>
                        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 h-fit">
                            <h4 className="text-text-secondary/30 text-[9px] font-black uppercase tracking-widest mb-6">Tech Stack</h4>
                            <div className="flex flex-wrap gap-2">
                                {SYLLABUS[activeModule].tools.map((tool, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[10px] font-mono text-accent uppercase tracking-tighter">{tool}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <div className="reveal-section mb-32 md:mb-56">
            <ComparisonSection />
        </div>

        {/* FIXED CTA CARD */}
        <section className="reveal-section mb-32 md:mb-56 relative py-20 md:py-32 px-6 bg-white/[0.02] border border-white/10 rounded-[40px] md:rounded-[80px] text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-rgb),0.1),transparent_70%)] opacity-50" />
            <div className="relative z-10">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-accent/20">
                    <MousePointer2 className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-4xl md:text-[80px] font-bold text-white mb-12 leading-[1] tracking-tighter">
                    Don't Just Use AI.<br/> <span className="text-accent italic font-serif">Engineer It.</span>
                </h2>
                
                {/* BUTTON CONTAINER - RESPONSIVE FIX */}
                <div className="flex justify-center px-2">
                    <button 
                        onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} 
                        className="group flex items-center justify-center gap-4 px-6 md:px-12 py-5 md:py-8 bg-white text-bg rounded-2xl md:rounded-[32px] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl max-w-full"
                    >
                        <span className="text-sm md:text-2xl font-black uppercase tracking-tight md:tracking-widest whitespace-nowrap sm:whitespace-normal">
                            JOIN THE COHORT — ₹{PRICE}
                        </span>
                        <ArrowRight className="w-4 h-4 md:w-6 md:h-6 shrink-0 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>

        <CertificationSection data={{
            mainHeading: "Validate Your", highlightedText: "Expertise",
            description: "Industry-standard certification for the Generative AI era.",
            certType: "Mastery", skillsLearned: "Gen-AI, RAG Architecture, and Agentic Workflows",
        }} />
        
        <div className="reveal-section mt-32 md:mt-56"><FAQSection /></div>

        <section ref={enrollmentRef} className="mb-32 md:mb-48 pt-20">
            <PrishEnrollment courseData={courseData} title={courseData.title} price={PRICE} oldPrice={OLD_PRICE} />
        </section>
      </main>

      {/* STICKY CTA */}
      <div className="sticky-cta fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[500px]">
        <div className="bg-bg/60 backdrop-blur-3xl border border-white/10 rounded-[28px] p-2 flex items-center justify-between shadow-2xl">
          <div className="pl-6">
            <span className="text-[8px] uppercase tracking-[0.2em] text-text-secondary/50 font-black block">Limited Access</span>
            <span className="text-2xl font-bold text-white tracking-tighter">₹{PRICE}</span>
          </div>
          <button 
            onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} 
            className="bg-accent text-bg px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all"
          >
            Enroll
          </button>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};