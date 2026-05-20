import React, { useRef, useLayoutEffect, useState } from 'react';
import { 
  ArrowRight, CheckCircle2, Sparkles, BrainCircuit, 
  Zap, ChevronRight, Cpu, Layers, MousePointer2, 
  Globe, Code2, Database, Cloud, Terminal 
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

export const FullStackCohortDetails = ({ courseData }) => {
  const containerRef = useRef(null);
  const syllabusRef = useRef(null);
  const enrollmentRef = useRef(null);
  const contentRef = useRef(null);
  const [activeModule, setActiveModule] = useState(0);

  const PRICE = Math.floor(courseData.price);
  const OLD_PRICE = Math.floor(courseData.price * 2.5);

  const SYLLABUS = [
    { 
      phase: "Phase 01", title: "Frontend Engineering", 
      icon: <Code2 className="w-5 h-5" />,
      topics: ["React 19 & Next.js 15 Foundations", "Server Components & Suspense", "Advanced Tailwind & Framer Motion", "State Management (Zustand)"],
      tools: ["Next.js", "React", "Zustand", "Tailwind"],
      duration: "Week 1-4"
    },
    { 
      phase: "Phase 02", title: "Backend Systems", 
      icon: <Database className="w-5 h-5" />,
      topics: ["Node.js Performance Tuning", "PostgreSQL & Prisma Deep Dive", "Redis Caching Strategies", "REST vs GraphQL vs gRPC"],
      tools: ["Prisma", "PostgreSQL", "Redis", "Node.js"],
      duration: "Week 5-8"
    },
    { 
      phase: "Phase 03", title: "Architecture & DevOps", 
      icon: <Cloud className="w-5 h-5" />,
      topics: ["Dockerization & Orchestration", "CI/CD Pipelines", "AWS/Vercel Deployment", "Microservices Design"],
      tools: ["Docker", "AWS", "GitHub Actions", "Kubernetes"],
      duration: "Week 9-11"
    },
    { 
      phase: "Phase 04", title: "System Design", 
      icon: <Terminal className="w-5 h-5" />,
      topics: ["High Availability & Load Balancing", "OAuth2 & JWT Security Patterns", "Database Sharding", "Interview Prep"],
      tools: ["Nginx", "Postman", "Sentry", "NewRelic"],
      duration: "Week 12-14"
    }
  ];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Entrance Animations
      gsap.from(".hero-reveal", { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out" });

      gsap.utils.toArray('.reveal-section').forEach(section => {
        gsap.from(section, {
          scrollTrigger: { trigger: section, start: "top 90%" },
          y: 30, opacity: 0, duration: 0.8, ease: "power2.out"
        });
      });

      // Sticky CTA
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
      
      {/* BACKGROUND BLUEPRINT */}
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
            <div className="hero-reveal flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
              {["React 19", "Node.js", "Docker", "AWS"].map((tag) => (
                <span key={tag} className="px-4 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-[10px] font-black tracking-widest uppercase">{tag}</span>
              ))}
            </div>
            
            <h1 className="hero-reveal text-5xl sm:text-7xl md:text-[100px] font-bold leading-[0.9] tracking-tighter text-white mb-8">
              {mainTitle} <br />
              <span className="italic font-serif text-accent">{lastWord}</span>
            </h1>

            <p className="hero-reveal text-lg md:text-xl text-text-secondary/70 max-w-xl mb-12 font-light leading-relaxed mx-auto lg:mx-0">
              {courseData.description}
            </p>

            <div className="hero-reveal flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-10">
                <div className="text-center md:text-left">
                    <span className="text-[10px] font-bold tracking-widest text-text-secondary/40 uppercase block mb-1">Enrollment Fee</span>
                    <div className="flex items-baseline gap-4">
                        <span className="text-5xl md:text-6xl font-bold text-white tracking-tighter">₹{PRICE}</span>
                        <span className="text-xl text-text-secondary/20 line-through">₹{OLD_PRICE}</span>
                    </div>
                </div>
                <button 
                  onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} 
                  className="w-full sm:w-auto px-10 py-6 bg-accent text-bg font-black rounded-2xl transition-all hover:scale-105 uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl"
                >
                  JOIN COHORT <ArrowRight className="w-5 h-5" />
                </button>
            </div>
          </div>

          <div className="hero-reveal order-1 lg:order-2">
             <div className="relative group max-w-[500px] mx-auto">
                <div className="absolute -inset-4 bg-accent/20 blur-[80px] rounded-full opacity-20 transition-opacity group-hover:opacity-40" />
                <div className="relative rounded-[40px] overflow-hidden border border-white/10 aspect-square bg-black/40 backdrop-blur-3xl shadow-2xl">
                    <img src={courseData.thumbnail} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" alt="Hero" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
                </div>
             </div>
          </div>
        </section>

        {/* COMMAND CENTER SYLLABUS */}
        <section ref={syllabusRef} className="reveal-section mb-32 md:mb-56">
          <header className="mb-16 text-center md:text-left">
                <span className="text-accent text-[10px] font-black tracking-[0.5em] uppercase block mb-4">Course Architecture</span>
                <h2 className="text-5xl md:text-[80px] font-bold text-white tracking-tighter leading-none">The Roadmap</h2>
          </header>

          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
              {SYLLABUS.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleTabChange(idx)}
                  className={`flex-shrink-0 lg:w-full p-7 rounded-[24px] border transition-all duration-500 flex items-center justify-between gap-6 ${
                    activeModule === idx 
                    ? "bg-accent border-accent text-bg shadow-xl" 
                    : "bg-white/[0.03] border-white/5 text-text-secondary hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`${activeModule === idx ? 'text-bg' : 'text-accent'}`}>{item.icon}</div>
                    <div className="text-left">
                        <span className={`text-[9px] font-black uppercase tracking-widest block opacity-40 mb-0.5`}>Phase 0{idx+1}</span>
                        <h3 className="font-bold uppercase text-[11px] md:text-xs tracking-[0.15em] whitespace-nowrap">{item.title}</h3>
                    </div>
                  </div>
                  <ChevronRight className={`hidden md:block w-4 h-4 transition-transform ${activeModule === idx ? "rotate-90" : ""}`} />
                </button>
              ))}
            </div>

            <div className="lg:col-span-8">
              <div className="bg-white/[0.02] border border-white/10 rounded-[40px] md:rounded-[56px] p-8 md:p-16 min-h-[500px] relative overflow-hidden backdrop-blur-3xl">
                <div ref={contentRef} className="relative z-10">
                    <span className="text-accent font-black tracking-[0.6em] uppercase text-[9px] block mb-6">{SYLLABUS[activeModule].duration}</span>
                    <h3 className="text-4xl md:text-6xl font-bold text-white mb-10 tracking-tighter">{SYLLABUS[activeModule].title}</h3>
                    
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <h4 className="text-text-secondary/30 text-[10px] font-black uppercase tracking-[0.4em]">Core Competencies</h4>
                            <ul className="space-y-5">
                                {SYLLABUS[activeModule].topics.map((t, i) => (
                                    <li key={i} className="flex gap-4 text-base md:text-lg text-text-secondary font-light">
                                        <CheckCircle2 className="w-5 h-5 text-accent/40 shrink-0 mt-0.5" />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 h-fit">
                            <h4 className="text-text-secondary/30 text-[10px] font-black uppercase tracking-[0.4em] mb-8">Ecosystem</h4>
                            <div className="flex flex-wrap gap-2.5">
                                {SYLLABUS[activeModule].tools.map((tool, i) => (
                                    <span key={i} className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-[10px] font-mono text-accent uppercase tracking-tighter">{tool}</span>
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
        <div className="reveal-section mb-32 md:mb-56 backdrop-blur-2xl rounded-[60px] border border-white/5 overflow-hidden">
            <ComparisonSection />
        </div>

        {/* REFIXED CTA SECTION */}
        <section className="reveal-section mb-32 md:mb-56 relative py-24 md:py-40 px-6 bg-white/[0.02] border border-white/10 rounded-[40px] md:rounded-[80px] text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-rgb),0.1),transparent_70%)]" />
            <div className="relative z-10 max-w-4xl mx-auto">
                <Sparkles className="w-14 h-14 text-accent mx-auto mb-10 opacity-40 animate-pulse" />
                <h2 className="text-4xl md:text-[90px] font-bold text-white mb-14 leading-[0.9] tracking-tighter">
                    Build Enterprise Software <br/> <span className="text-accent italic font-serif text-5xl md:text-[110px]">Like the 1%</span>
                </h2>
                
                <div className="flex justify-center px-2">
                    <button 
                        onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} 
                        className="group flex items-center justify-center gap-4 px-8 md:px-16 py-6 md:py-9 bg-white text-bg rounded-2xl md:rounded-[36px] transition-all hover:scale-[1.03] active:scale-95 shadow-2xl max-w-full"
                    >
                        <span className="text-base md:text-2xl font-black uppercase tracking-tight md:tracking-widest whitespace-nowrap sm:whitespace-normal">
                            SECURE YOUR SPOT — ₹{PRICE}
                        </span>
                        <ArrowRight className="w-5 h-5 md:w-8 md:h-8 shrink-0 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </section>

        <CertificationSection data={{
            mainHeading: "Secure Your", highlightedText: "Architect Status",
            description: "Proof of your ability to build, scale, and deploy enterprise-grade applications.",
            certType: "Architect", skillsLearned: "MERN Architecture, DevOps Automation, and Cloud Deployment",
        }} />
        
        <div className="reveal-section mt-32 md:mt-56"><FAQSection /></div>

        <section ref={enrollmentRef} className="mb-32 md:mb-48 pt-24">
            <PrishEnrollment courseData={courseData} title={courseData.title} price={PRICE} oldPrice={OLD_PRICE} />
        </section>
      </main>

      {/* STICKY CTA FOOTER */}
      <div className="sticky-cta fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[540px]">
        <div className="bg-bg/60 backdrop-blur-[40px] border border-white/10 rounded-[30px] p-2 flex items-center justify-between shadow-2xl">
          <div className="pl-7">
            <span className="text-[8px] uppercase tracking-[0.3em] text-text-secondary/60 font-black block mb-0.5">Limited Enrollment</span>
            <span className="text-2xl md:text-3xl font-bold text-white tracking-tighter">₹{PRICE}</span>
          </div>
          <button 
            onClick={() => enrollmentRef.current?.scrollIntoView({ behavior: 'smooth' })} 
            className="bg-accent text-bg px-8 md:px-12 py-4 md:py-5 rounded-[22px] font-black text-xs md:text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
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