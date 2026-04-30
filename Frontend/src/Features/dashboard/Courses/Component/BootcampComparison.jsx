import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, 
  Terminal, 
  Cpu, 
  Network, 
  ArrowDownRight, 
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

const comparisonData = [
  {
    title: "System Architecture",
    description: "Build production-grade distributed systems with Redis, Kafka, and Microservices.",
    detail: "Move beyond single-server setups. Learn how to handle 100k+ concurrent requests and implement circuit breakers.",
    icon: <Layers className="w-5 h-5 md:w-6 md:h-6" />,
    legacy: "Basic CRUD & To-do list tutorials",
    color: "from-blue-500/20"
  },
  {
    title: "Senior Code Audits",
    description: "Deep-dive 1-on-1 PR reviews focusing on clean code, patterns, and scalability.",
    detail: "Industry veterans review your logic, not just your syntax. We focus on SOLID principles and design patterns.",
    icon: <Terminal className="w-5 h-5 md:w-6 md:h-6" />,
    legacy: "Automated grading & community forums",
    color: "from-purple-500/20"
  },
  {
    title: "Cloud-Native Ops",
    description: "Real CI/CD pipelines, Docker orchestration, and AWS/GCP deployment strategies.",
    detail: "Stop 'deploying' by dragging files. Build automated pipelines that test, lint, and deploy to Kubernetes.",
    icon: <Cpu className="w-5 h-5 md:w-6 md:h-6" />,
    legacy: "Localhost-only 'Resume Filler' projects",
    color: "from-emerald-500/20"
  },
  {
    title: "The Ecosystem",
    description: "Direct engineering pipeline to internal Prish projects and partner hiring desks.",
    detail: "Access a private network of CTOs and lead engineers looking for specialized talent, not generalists.",
    icon: <Network className="w-5 h-5 md:w-6 md:h-6" />,
    legacy: "Generic career tips & cold LinkedIn apps",
    color: "from-amber-500/20"
  },
];

const studentAvatars = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop",
];

export default function BootcampComparison() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section 
      className="relative w-full py-16 md:py-24 px-4 sm:px-6 bg-bg overflow-hidden cursor-default text-text"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Background Spotlight - Hidden on touch devices to save perf */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 opacity-20 md:opacity-30 hidden md:block"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(var(--accent-rgb), 0.15), transparent 80%)`
        }}
      />

      {/* Background Grid */}
      <div className="absolute inset-0 grid grid-cols-10 md:grid-cols-20 opacity-[0.03] pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="border-r border-text h-full" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-16 gap-6 md:gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.9] md:leading-[0.85] mb-6">
              THE <span className="text-accent italic font-serif">EVOLUTION</span> <br className="hidden sm:block" /> 
              OF LEARNING.
            </h2>
            <p className="text-text-secondary text-base md:text-lg font-light max-w-md">
              Tap any card to see how we bridge the gap between "Student" and "Senior Engineer."
            </p>
          </motion.div>
          
          <div className="hidden lg:block text-right">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-[10px] tracking-[0.5em] uppercase font-bold text-accent block mb-2"
            >
              System Online
            </motion.div>
            <div className="h-px w-32 bg-accent/30 ml-auto" />
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {comparisonData.map((item, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              key={idx}
              className={`group relative glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 cursor-pointer transition-all duration-500 flex flex-col h-full overflow-hidden ${
                activeIndex === idx ? 'ring-1 ring-accent/50 bg-accent/[0.02]' : 'hover:border-accent/30'
              }`}
            >
              {/* Gradient Overlay */}
              <div className={`absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b ${item.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6 md:mb-8">
                    <motion.div 
                    animate={activeIndex === idx ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-bg border border-white/10 flex items-center justify-center group-hover:border-accent/50 transition-all duration-500"
                    >
                        <div className="text-accent">{item.icon}</div>
                    </motion.div>

                    <div className="block sm:hidden">
                         {activeIndex === idx ? (
                            <CheckCircle2 className="w-5 h-5 text-accent" />
                            ) : (
                            <ArrowDownRight className="w-5 h-5 text-white/20" />
                        )}
                    </div>
                </div>

                <h3 className="font-display text-xl md:text-2xl font-bold mb-3 md:mb-4 tracking-tight">
                  {item.title}
                </h3>
                
                <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-4 md:mb-6">
                  {item.description}
                </p>

                <AnimatePresence>
                  {activeIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs md:text-sm text-accent/80 pb-6 border-l-2 border-accent/30 pl-4 italic">
                        {item.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-auto relative z-10">
                <div className="pt-4 md:pt-6 border-t border-white/5 group-hover:border-accent/20 transition-colors">
                  <div className="flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-text-secondary/50 mb-2 md:mb-3 group-hover:text-accent/60">
                    <AlertCircle className="w-3 h-3 text-red-500/50" /> Legacy Method
                  </div>
                  <p className="text-xs md:text-sm text-text-secondary/30 italic line-through decoration-white/10 group-hover:text-text-secondary/60 transition-colors">
                    {item.legacy}
                  </p>
                </div>
              </div>

              {/* Desktop-only Icon */}
              <div className="absolute top-8 right-8 hidden sm:block">
                {activeIndex === idx ? (
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-white/5 group-hover:text-accent/40 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Pill */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-10 md:mt-16 flex justify-center px-2"
        >
            <div className="glass py-3 md:py-4 px-5 md:px-8 rounded-2xl md:rounded-full border border-white/10 flex flex-col sm:flex-row items-center gap-4 md:gap-6 shadow-2xl hover:border-accent/40 transition-all group w-full sm:w-auto">
                <div className="flex -space-x-2 md:-space-x-3">
                    {studentAvatars.map((src, i) => (
                        <div 
                          key={i} 
                          className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-bg bg-text-secondary/20 overflow-hidden"
                        >
                            <img src={src} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <p className="text-[11px] sm:text-xs md:text-sm font-medium tracking-wide text-center sm:text-left">
                        Only <span className="text-accent font-bold uppercase">12 spots left</span> for the upcoming Q3 Cohort.
                    </p>
                    <ChevronRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform hidden sm:block" />
                </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
}