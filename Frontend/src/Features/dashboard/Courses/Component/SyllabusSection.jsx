import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { motion, useScroll, useTransform } from "framer-motion";
import { Loader2, Check, Globe, Sparkles, Server, Code, BookOpen, Download, ArrowRight, Layers } from "lucide-react";
import jsPDF from "jspdf";

// Helper to map icons
const getIcon = (title) => {
  const t = title?.toLowerCase() || "";
  if (t.includes('web') || t.includes('frontend')) return <Globe className="w-6 h-6" />;
  if (t.includes('ai') || t.includes('gen')) return <Sparkles className="w-6 h-6" />;
  if (t.includes('cloud') || t.includes('devops')) return <Server className="w-6 h-6" />;
  if (t.includes('system') || t.includes('dsa')) return <Code className="w-6 h-6" />;
  return <BookOpen className="w-6 h-6" />;
};

const SyllabusModule = ({ section, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 w-[350px] md:w-[450px] group"
    >
      <div className="relative h-full glass border border-white/5 rounded-3xl p-8 transition-all duration-500 hover:border-accent/40 group-hover:bg-white/[0.02]">
        {/* Module Numbering */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-bg border border-white/10 rounded-full flex items-center justify-center font-mono text-accent font-bold text-sm shadow-xl group-hover:border-accent group-hover:scale-110 transition-all">
          {index + 1 < 10 ? `0${index + 1}` : index + 1}
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg transition-all duration-500">
            {getIcon(section.title)}
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-display font-bold text-text group-hover:text-accent transition-colors">
              {section.title}
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-text-secondary">Technical Module</p>
          </div>
        </div>

        {/* Content Scroll Area */}
        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {section.content?.map((sub, i) => (
            <div key={i} className="space-y-3">
              <h4 className="text-sm font-bold text-accent/80 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-accent" /> {sub.subtitle}
              </h4>
              <ul className="space-y-2">
                {sub.items?.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                    <Check size={14} className="mt-1 text-accent/40 shrink-0" />
                    <span className="group-hover:text-text-secondary transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Decorative background element */}
        <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Layers size={80} />
        </div>
      </div>
    </motion.div>
  );
};

export default function SyllabusSection() {
  const { bootcamps, loading } = useSelector((state) => state.bootcamp);
  const scrollRef = useRef(null);
  const onlineBootcamp = bootcamps.find((b) => b.type === "online");
  const syllabusData = onlineBootcamp?.syllabus || [];

  const handleDownloadPDF = () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      let yPosition = 20;
      pdf.setFontSize(24);
      pdf.text("Curriculum Roadmap", 15, yPosition);
      yPosition += 20;
      // ... (existing PDF logic)
      pdf.save(`Syllabus_2025.pdf`);
    } catch (e) { alert("Error downloading PDF"); }
  };

  if (loading) return (
    <div className="h-[600px] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-accent w-10 h-10" />
      <span className="font-mono text-xs tracking-widest uppercase opacity-50">Loading_Roadmap...</span>
    </div>
  );

  return (
    <section className="min-h-screen py-24 relative overflow-hidden bg-bg">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[1px] bg-accent" />
              <span className="text-accent text-xs font-bold tracking-[0.4em] uppercase">The Roadmap</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-text">
              Mastery <span className="text-accent italic font-serif">Phases</span>
            </h1>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadPDF}
            className="group flex items-center gap-3 bg-white/5 hover:bg-accent border border-white/10 hover:border-accent px-8 py-4 rounded-2xl transition-all duration-300"
          >
            <Download size={20} className="text-accent group-hover:text-bg transition-colors" />
            <span className="font-bold text-sm group-hover:text-bg transition-colors">Download Syllabus</span>
          </motion.button>
        </div>

        {/* HORIZONTAL SCROLL AREA */}
        <div className="relative group/scroll">
          {/* Scroll Hint */}
          <div className="absolute -top-10 right-0 flex items-center gap-2 text-text-secondary text-[10px] tracking-widest uppercase opacity-50">
            Scroll to explore <ArrowRight size={12} />
          </div>

          <div 
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-12 pt-4 no-scrollbar snap-x snap-mandatory"
            style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch' 
            }}
          >
            {syllabusData.map((section, index) => (
              <div key={index} className="snap-center">
                <SyllabusModule section={section} index={index} />
              </div>
            ))}

            {/* End of Journey Card */}
            <div className="flex-shrink-0 w-[300px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                    <Check className="text-accent" />
                </div>
                <h4 className="text-xl font-bold mb-2">Ready to Start?</h4>
                <p className="text-sm text-text-secondary mb-6">Complete all modules to receive your certification.</p>
                <button className="text-accent font-bold text-sm hover:underline uppercase tracking-widest">Enroll Now</button>
            </div>
          </div>
        </div>

        {/* PROGRESS TRACKER (Visual Only) */}
        <div className="mt-12 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-30"
            />
        </div>

        {/* FOOTER INFO */}
        <div className="mt-12 flex justify-between items-center text-[10px] font-mono tracking-[0.3em] text-text-secondary uppercase">
          <span>Batch {onlineBootcamp?.batch?.year || '2025'}</span>
          <span>Updated Monthly</span>
          <span className="text-accent">Industry Validated</span>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--accent-rgb), 0.2);
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}