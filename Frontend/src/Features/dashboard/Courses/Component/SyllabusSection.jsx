import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronDown, Sparkles, Server, Globe, Code, Brain, Layout, Download, Check, Loader2, ArrowRight } from 'lucide-react';

// 1. SYLLABUS DATA
const syllabusData = [
  {
    title: "Fullstack Web Development",
    icon: <Globe className="w-5 h-5" />,
    content: [
      {
        subtitle: "Frontend Mastery",
        items: ["React.js & Next.js 14 (App Router)", "TypeScript Fundamentals", "Tailwind CSS & Framer Motion", "State Management (Zustand)", "Performance Optimization"]
      },
      {
        subtitle: "Backend & Databases",
        items: ["Node.js Architecture", "PostgreSQL with Prisma ORM", "Redis Caching", "NextAuth Security", "WebSockets"]
      }
    ]
  },
  {
    title: "AI and Generative AI",
    icon: <Sparkles className="w-5 h-5" />,
    content: [
      {
        subtitle: "LLM Integration",
        items: ["OpenAI & Anthropic APIs", "Prompt Engineering Patterns", "Vector Databases (Pinecone)", "RAG Architecture", "LangChain Agents"]
      }
    ]
  },
  {
    title: "Cloud & DevOps",
    icon: <Server className="w-5 h-5" />,
    content: [
      {
        subtitle: "Infrastructure",
        items: ["Docker Containerization", "AWS (EC2, S3, Lambda)", "CI/CD Pipelines", "Nginx Reverse Proxy", "Prometheus Monitoring"]
      }
    ]
  },
  {
    title: "System Design & DSA",
    icon: <Code className="w-5 h-5" />,
    content: [
      {
        subtitle: "Scalable Architecture",
        items: ["Microservices vs Monoliths", "Load Balancing", "Database Sharding", "CAP Theorem", "Distributed Systems"]
      }
    ]
  }
];

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
        className={`glow-card glass rounded-2xl transition-all duration-500 ${
          isOpen ? 'bg-card-hover/60 border-accent/30' : 'hover:border-accent/20'
        }`}
      >
        <div className="p-6 md:p-8 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-6" style={{ transform: "translateZ(30px)" }}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-accent text-bg' : 'bg-bg2 text-accent'}`}>
              {section.icon}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-accent/60 font-bold mb-1 block">Module 0{index + 1}</span>
              <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight text-text">
                {section.title}
              </h3>
            </div>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className={isOpen ? "text-accent" : "text-text-secondary"}>
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
              <div className="pt-8 grid md:grid-cols-2 gap-10 border-t border-border/50" style={{ transform: "translateZ(20px)" }}>
                {section.content.map((sub, i) => (
                  <div key={i} className="space-y-5">
                    <h4 className="font-serif italic text-accent text-lg flex items-center gap-3">
                      <ArrowRight size={14} className="not-italic" /> {sub.subtitle}
                    </h4>
                    <ul className="space-y-3">
                      {sub.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-text-secondary text-sm leading-relaxed group/item">
                          <Check size={14} className="mt-1 text-accent/50 group-hover/item:text-accent transition-colors shrink-0" />
                          <span className="group-hover:text-text transition-colors">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function SyllabusSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);
    // Logic to simulate PDF generation
    setTimeout(() => {
      setLoading(false);
      alert("Curriculum PDF download started.");
    }, 1800);
  };

  return (
    <div className=" min-h-screen text-text py-24 px-6 relative overflow-hidden  selection:text-text">
      {/* Background Effects from your CSS */}
      <div className="" />
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px]  rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* HEADER - Matches your Image exactly using your Theme fonts/colors */}
        <header className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-[72px] font-display font-bold tracking-tighter text-text leading-tight mb-2"
          >
            What You'll Study
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl font-sans text-text-secondary tracking-tight font-light"
          >
            Five Months Of Structured, Practical Engineering
          </motion.p>
        </header>

        {/* ACCORDION LIST */}
        <div className="perspective-1000">
          {syllabusData.map((section, index) => (
            <SyllabusCard 
              key={index}
              index={index}
              section={section}
              isOpen={activeIndex === index}
              toggle={() => setActiveIndex(activeIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* DOWNLOAD SECTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 flex flex-col items-center gap-6"
        >
          <button 
            onClick={handleDownload}
            disabled={loading}
            className="group relative glass px-10 py-4 rounded-full font-display font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-20 transition-opacity" />
            <span className="relative z-10 flex items-center gap-3">
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
              )}
              {loading ? "Preparing PDF..." : "Download Full Syllabus"}
            </span>
          </button>
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold opacity-60">
            Updated for 2025 Cohort
          </p>
        </motion.div>
      </div>
    </div>
  );
}