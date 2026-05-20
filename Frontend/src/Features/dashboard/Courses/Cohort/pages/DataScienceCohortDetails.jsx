import React, { useRef, useLayoutEffect, useState, useMemo, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useCourse } from "../../hooks/useCourse";
import { 
  ArrowRight, CheckCircle2, Sparkles, BrainCircuit, 
  Zap, ChevronRight, Cpu, Layers, MousePointer2, 
  BarChart3, Database, LineChart, Binary 
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Integrated Components
import { FluidBackground } from "../../../components/FluidBackground";
import ComparisonSection from "../../../components/ComparisonSection";
import { FAQSection } from '../../../components/FAQSection';
import CertificationSection from '../component/CertificationSection';
import { PrishEnrollment } from '../component/PrishEnrollment';

gsap.registerPlugin(ScrollTrigger);

export const DataScienceCohortDetails = () => {
  const containerRef = useRef(null);
  const syllabusRef = useRef(null);
  const enrollmentRef = useRef(null);
  const contentRef = useRef(null);
  const heroImageRef = useRef(null);
  
  const [activeModule, setActiveModule] = useState(0);

  // DATA FETCHING LOGIC
  const { handleGetCourses } = useCourse();
  const { courses } = useSelector((state) => state.course);

  useEffect(() => {
    if (!courses?.length) handleGetCourses();
  }, []);

  const course = useMemo(() => {
    const found = courses?.find(
      (c) =>
        c.category?.toLowerCase().includes("data") ||
        c.title?.toLowerCase().includes("data")
    );

    return found || {
      title: "Data Science Mastery",
      price: 3499,
      description: "Master the full lifecycle of data engineering, statistical modeling, and machine learning deployment.",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    };
  }, [courses]);

  const PRICE = Math.floor(course.price);
  const OLD_PRICE = Math.floor(course.price * 2.5);

  const SYLLABUS = [
    { 
      phase: "Phase 01", title: "Foundations & Viz", 
      icon: <BarChart3 className="w-5 h-5" />,
      topics: ["Advanced Python for Data", "Statistical Inference", "Exploratory Data Analysis", "Vectorized Operations"],
      tools: ["NumPy", "Pandas", "Seaborn"],
      duration: "Week 1-3"
    },
    { 
      phase: "Phase 02", title: "ML Engineering", 
      icon: <Binary className="w-5 h-5" />,
      topics: ["Regression Architectures", "Classification Deep-Dive", "Hyperparameter Tuning", "Ensemble Methods"],
      tools: ["Scikit-Learn", "XGBoost"],
      duration: "Week 4-7"
    },
    { 
      phase: "Phase 03", title: "Deep Learning", 
      icon: <BrainCircuit className="w-5 h-5" />,
      topics: ["Neural Network Theory", "CNNs & Computer Vision", "Sequence Modeling (RNNs)", "Optimization Algorithms"],
      tools: ["PyTorch", "TensorFlow"],
      duration: "Week 8-10"
    },
    { 
      phase: "Phase 04", title: "Big Data & MLOps", 
      icon: <Database className="w-5 h-5" />,
      topics: ["Feature Stores", "Model Versioning", "Spark Data Processing", "API Deployment (FastAPI)"],
      tools: ["Apache Spark", "MLFlow", "Docker"],
      duration: "Week 11-14"
    }
  ];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Hero Entrance
      gsap.from(".hero-reveal", { y: 50, opacity: 0, stagger: 0.1, duration: 1.2, ease: "power4.out" });

      // Section Reveals
      gsap.utils.toArray('.reveal-section').forEach(section => {
        gsap.from(section, {
          scrollTrigger: { trigger: section, start: "top 90%" },
          y: 40, opacity: 0, duration: 1, ease: "power3.out"
        });
      });

      // Sticky CTA
      gsap.from(".sticky-cta", {
        scrollTrigger: { trigger: "body", start: "top -5%", toggleActions: "play none none reverse" },
        y: 120, duration: 0.5, ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleTabChange = (index) => {
    if(index === activeModule) return;
    gsap.to(contentRef.current, {
        opacity: 0, x: -20, duration: 0.2,
        onComplete: () => {
            setActiveModule(index);
            gsap.to(contentRef.current, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" });
        }
    });
  };

  const titleWords = course.title.split(' ');
  const mainTitle = titleWords.slice(0, -1).join(' ');
  const lastWord = titleWords.slice(-1);

  return (
    <div ref={containerRef} className="text-text min-h-screen bg-bg selection:bg-accent/30 overflow-x-hidden relative font-sans">
      
      {/* BACKGROUND LAYERS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FluidBackground />
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: `linear-gradient(rgba(var(--accent-rgb), 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb), 0.5) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/20 to-bg" />
      </div>
      
      <main className="relative z-10 pt-28 md:pt-44 pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <section className="grid lg:grid-cols-2 gap-16 items-center mb-36 md:mb-56">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <span className="hero-reveal px-5 py-2 border border-accent/20 bg-accent/5 rounded-full text-[10px] font-black tracking-[0.4em] uppercase text-accent mb-8 inline-block">Data Engineering Cohort</span>
            <h1 className="hero-reveal text-5xl sm:text-7xl md:text-[100px] font-bold leading-[0.85] tracking-tighter text-white mb-10">
              {mainTitle} <br />
              <span className="italic font-serif text-accent">{lastWord}</span>
            </h1>
            <p className="hero-reveal text-lg md:text-2xl text-text-secondary max-w-xl mb-12 font-light leading-relaxed mx-auto lg:mx-0 opacity-80">
              {course.description}
            </p>
            <div className="hero-reveal flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-10">
                <div className="text-center md:text-left">
                    <span className="text-[10px] font-bold tracking-widest text-text-secondary/40 uppercase block mb-2">Registration Open</span>
                    <div className="flex items-baseline gap-4">
                        <span className="text-5xl md:text-7xl font-bold text-white tracking-tighter">₹{PRICE}</span>
                        <span className="text-xl md:text-2xl text-text-secondary/20 line-through">₹{OLD_PRICE}</span>
                    </div>
                </div>
                <button 
                  onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} 
                  className="w-full whitespace-nowrap sm:w-auto px-12 py-7 bg-accent text-bg font-black rounded-3xl hover:scale-105 transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 shadow-[0_25px_60px_-10px_rgba(var(--accent-rgb),0.4)]"
                >
                  JOIN COHORT <ArrowRight className="w-5 h-5" />
                </button>
            </div>
          </div>

          <div className="hero-reveal order-1 lg:order-2">
             <div className="relative group max-w-[550px] mx-auto">
                <div className="absolute -inset-8 bg-accent/20 blur-[120px] rounded-full opacity-30" />
                <div className="relative rounded-[50px] overflow-hidden border border-white/10 aspect-[4/5] bg-black/40 backdrop-blur-3xl shadow-2xl">
                    <img src={course.thumbnail} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" alt={course.title} />
                </div>
             </div>
          </div>
        </section>

        {/* CURRICULUM BLUEPRINT */}
        <section ref={syllabusRef} className="reveal-section mb-36 md:mb-56">
          <header className="mb-16 text-center md:text-left">
                <span className="text-accent text-[10px] font-black tracking-[0.5em] uppercase block mb-4">Course Map</span>
                <h2 className="text-6xl md:text-[90px] font-bold text-white tracking-tighter leading-[0.8]">The Curriculum</h2>
          </header>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
              {SYLLABUS.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleTabChange(idx)}
                  className={`flex-shrink-0 lg:w-full p-7 rounded-[32px] border transition-all duration-500 flex items-center justify-between gap-6 ${
                    activeModule === idx 
                    ? "bg-accent border-accent text-bg shadow-xl" 
                    : "bg-white/[0.03] border-white/5 text-text-secondary hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`${activeModule === idx ? 'text-bg' : 'text-accent'}`}>{item.icon}</div>
                    <h3 className="font-bold uppercase text-[11px] md:text-xs tracking-[0.2em] whitespace-nowrap">{item.title}</h3>
                  </div>
                  <ChevronRight className={`hidden md:block w-5 h-5 ${activeModule === idx ? "rotate-90" : ""}`} />
                </button>
              ))}
            </div>

            <div className="lg:col-span-8">
              <div className="bg-white/[0.01] border border-white/10 rounded-[40px] md:rounded-[64px] p-8 md:p-20 min-h-[500px] relative overflow-hidden backdrop-blur-2xl">
                <div ref={contentRef} className="relative z-10">
                    <span className="text-accent font-black tracking-[0.6em] uppercase text-[10px] block mb-8">{SYLLABUS[activeModule].duration}</span>
                    <h3 className="text-4xl md:text-7xl font-bold text-white mb-12 tracking-tighter leading-[0.9]">{SYLLABUS[activeModule].title}</h3>
                    
                    <div className="grid md:grid-cols-2 gap-16">
                        <div className="space-y-10">
                            <h4 className="text-text-secondary/30 text-[10px] font-black uppercase tracking-[0.4em]">Core Outcomes</h4>
                            <ul className="space-y-5">
                                {SYLLABUS[activeModule].topics.map((t, i) => (
                                    <li key={i} className="flex gap-4 text-lg md:text-xl text-text-secondary font-light">
                                        <CheckCircle2 className="w-6 h-6 text-accent/30 shrink-0 mt-1" />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-8">
                            <h4 className="text-text-secondary/30 text-[10px] font-black uppercase tracking-[0.4em] mb-10">Industry Tools</h4>
                            <div className="flex flex-wrap gap-3">
                                {SYLLABUS[activeModule].tools.map((tool, i) => (
                                    <span key={i} className="px-5 py-3 bg-black/40 border border-white/10 rounded-2xl text-[11px] font-mono text-accent uppercase tracking-widest">{tool}</span>
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
        <div className="reveal-section mb-36 md:mb-56 backdrop-blur-2xl rounded-[60px] border border-white/5 overflow-hidden">
            <ComparisonSection />
        </div>

        {/* CTA CARD */}
        <section className="reveal-section mb-36 md:mb-56 relative py-32 px-6 bg-white/[0.02] border border-white/10 rounded-[60px] md:rounded-[100px] text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-rgb),0.1),transparent_70%)]" />
            <div className="relative z-10">
                <MousePointer2 className="w-16 h-16 text-accent mx-auto mb-10 opacity-40 animate-bounce" />
                <h2 className="text-5xl md:text-[100px] font-bold text-white mb-16 leading-[0.8] tracking-tighter">
                    Don't Just View Data. <br/> <span className="text-accent italic font-serif">Engineer Insight.</span>
                </h2>
                <div className="flex justify-center">
                    <button 
                        onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} 
                        className="group flex items-center justify-center gap-6 px-10 md:px-16 py-7 md:py-9 bg-white text-bg font-black rounded-3xl text-lg md:text-2xl uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95 max-w-full"
                    >
                        <span className="whitespace-nowrap sm:whitespace-normal">JOIN THE COHORT — ₹{PRICE}</span>
                        <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </section>

        <CertificationSection data={{
            mainHeading: "Validate Your", highlightedText: "Expertise",
            description: "Industry-standard certification for Data Science & Engineering.",
            certType: "Specialist", skillsLearned: "MLOps, Deep Learning, and Statistical Modeling",
        }} />
        
        <div className="reveal-section mt-36 md:mt-56"><FAQSection /></div>

        <section ref={enrollmentRef} className="mb-32 md:mb-48 pt-24">
            <PrishEnrollment courseData={course} title={course.title} price={PRICE} oldPrice={OLD_PRICE} />
        </section>
      </main>

      {/* STICKY CTA FOOTER */}
      <div className="sticky-cta fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[540px]">
        <div className="bg-bg/40 backdrop-blur-[40px] border border-white/10 rounded-[35px] p-3 flex items-center justify-between shadow-2xl">
          <div className="pl-8">
            <span className="text-[9px] uppercase tracking-[0.4em] text-text-secondary/40 font-black block mb-1">Limited Access</span>
            <span className="text-3xl md:text-4xl font-bold text-white tracking-tighter">₹{PRICE}</span>
          </div>
          <button 
            onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} 
            className="bg-accent text-bg px-10 md:px-14 py-5 md:py-6 rounded-[28px] font-black text-xs md:text-sm uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-xl"
          >
            Enroll Now
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