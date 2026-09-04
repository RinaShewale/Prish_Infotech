import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, LayoutGroup } from "framer-motion";
import { Loader2, ChevronDown, Check, ArrowRight, Globe, Sparkles, Server, Code, BookOpen, Download, MousePointer2 } from "lucide-react";
import jsPDF from "jspdf";

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
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

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
      className="relative mb-8 group"
    >
      {/* Timeline Connector */}
      <div className="absolute -left-[33px] top-10 bottom-[-32px] w-[2px] bg-white/5 hidden md:block">
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: isOpen ? "100%" : "0%" }}
          className="w-full bg-accent/30 transition-all duration-700"
        />
      </div>

      <div 
        onClick={toggle}
        className={`relative z-10 backdrop-blur-xl rounded-3xl transition-all duration-500 border ${
          isOpen ? 'bg-white/[0.05] border-accent/40 shadow-2xl shadow-accent/5' : 'bg-white/[0.02] border-white/10 hover:border-white/20'
        } cursor-pointer overflow-hidden`}
      >
        <div className="p-6 md:p-10 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Module Number Bubble */}
            <div className="relative">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                isOpen ? 'bg-accent text-black scale-110 shadow-lg shadow-accent/20' : 'bg-white/5 text-accent'
              }`}>
                {getIcon(section.title)}
              </div>
              <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                isOpen ? 'bg-black border-accent text-accent' : 'bg-bg border-white/10 text-text-secondary'
              }`}>
                {index + 1}
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent/50 font-bold mb-1">Module Sequence</p>
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-text">
                {section.title}
              </h3>
            </div>
          </div>
          
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.2 : 1 }} 
            className={`${isOpen ? "text-accent" : "text-text-secondary"} p-2 rounded-full bg-white/5`}
          >
            <ChevronDown size={20} />
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
              <div className="px-6 md:px-10 pb-10">
                <div className="pt-10 grid md:grid-cols-2 gap-x-12 gap-y-10 border-t border-white/5">
                  {section.content?.map((sub, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="space-y-6"
                    >
                      <h4 className="font-medium text-accent flex items-center gap-3 text-sm tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {sub.subtitle}
                      </h4>
                      <ul className="space-y-4">
                        {sub.items?.map((item, j) => (
                          <li key={j} className="flex items-start gap-4 text-text-secondary text-sm group/item">
                            <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:border-accent/50 transition-colors">
                                <Check size={10} className="text-accent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </div>
                            <span className="leading-relaxed group-hover/item:text-text transition-colors">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function SyllabusSection() {
  const { bootcamps, loading } = useSelector((state) => state.bootcamp);
  const [activeIndex, setActiveIndex] = useState(0);

  const onlineBootcamp = bootcamps.find((b) => b.type === "online");

  const handleDownloadPDF = () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      let yPosition = 20;
      const margin = 20;
      const maxWidth = pdf.internal.pageSize.getWidth() - 2 * margin;

      pdf.setFontSize(26);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Detailed Curriculum", margin, yPosition);
      yPosition += 15;

      pdf.setFontSize(11);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Academic Batch: ${onlineBootcamp?.batch?.year || "2025"} | Professional Track`, margin, yPosition);
      yPosition += 20;

      onlineBootcamp?.syllabus?.forEach((section, idx) => {
        if (yPosition > 250) { pdf.addPage(); yPosition = 20; }
        
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont(undefined, 'bold');
        pdf.text(`${idx + 1}. ${section.title}`, margin, yPosition);
        yPosition += 8;

        section.content?.forEach((sub) => {
          pdf.setFontSize(11);
          pdf.setTextColor(80, 80, 80);
          pdf.setFont(undefined, 'italic');
          pdf.text(`> ${sub.subtitle}`, margin + 5, yPosition);
          yPosition += 6;

          sub.items?.forEach(item => {
            if (yPosition > 270) { pdf.addPage(); yPosition = 20; }
            pdf.setFontSize(10);
            pdf.setTextColor(40, 40, 40);
            pdf.setFont(undefined, 'normal');
            pdf.text(`• ${item}`, margin + 10, yPosition);
            yPosition += 5;
          });
          yPosition += 4;
        });
        yPosition += 10;
      });

      pdf.save(`Syllabus_${onlineBootcamp?.batch?.year || "2025"}.pdf`);
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
        <div className="relative">
            <Loader2 className="animate-spin text-accent w-12 h-12" />
            <div className="absolute inset-0 blur-xl bg-accent/20 animate-pulse" />
        </div>
        <span className="text-xs font-mono tracking-[0.5em] text-accent uppercase">Constructing_Nodes...</span>
      </div>
    );
  }

  const syllabusData = onlineBootcamp?.syllabus || [];

  return (
    <section className="py-32 px-6 relative bg-bg overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/3 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <header className="mb-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-accent text-[10px] tracking-[0.3em] uppercase font-black">2025 Curriculum</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Expertise <span className="text-accent">Redefined.</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto font-light leading-relaxed">
              A comprehensive roadmap designed to take you from foundational concepts to professional architectural mastery.
            </p>
          </motion.div>
        </header>

        <div className="relative md:ml-12">
          <LayoutGroup>
            {syllabusData.map((section, index) => (
              <SyllabusCard 
                key={index}
                index={index}
                section={section}
                isOpen={activeIndex === index}
                toggle={() => setActiveIndex(activeIndex === index ? null : index)}
              />
            ))}
          </LayoutGroup>
        </div>

        {/* Action Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-24 text-center border-t border-white/5 pt-16"
        >
          <p className="text-text-secondary text-sm mb-8 flex items-center justify-center gap-2 italic">
            <MousePointer2 size={14} className="text-accent" />
            Click on a module to explore the detailed topics
          </p>
          
          <button 
            onClick={handleDownloadPDF}
            className="group relative overflow-hidden bg-white text-bg px-12 py-5 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5"
          >
            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 flex items-center gap-3 group-hover:text-black transition-colors">
              <Download size={20} />
              Save Curriculum as PDF
            </span>
          </button>
          
          <div className="mt-10 flex items-center justify-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="h-[1px] w-12 bg-white" />
             <span className="text-[10px] uppercase tracking-widest font-bold">Standard Syllabus v4.2.0</span>
             <div className="h-[1px] w-12 bg-white" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}