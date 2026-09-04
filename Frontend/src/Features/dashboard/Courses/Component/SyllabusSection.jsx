import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Loader2, ChevronDown, Check, ArrowRight, Globe, Sparkles, Server, Code, BookOpen, Download } from "lucide-react";
import jsPDF from "jspdf";

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
        className={`glow-card glass rounded-2xl transition-all duration-500 border border-white/5 ${
          isOpen ? 'bg-white/[0.04] border-accent/30' : 'hover:border-accent/20'
        }`}
      >
        <div className="p-6 md:p-8 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-6" style={{ transform: "translateZ(30px)" }}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-accent text-bg' : 'bg-white/5 text-accent border border-white/10'}`}>
              {getIcon(section.title)}
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
              <div className="pt-8 grid md:grid-cols-2 gap-10 border-t border-white/10" style={{ transform: "translateZ(20px)" }}>
                {section.content?.map((sub, i) => (
                  <div key={i} className="space-y-5">
                    <h4 className="font-serif italic text-accent text-lg flex items-center gap-3">
                      <ArrowRight size={14} className="not-italic" /> {sub.subtitle}
                    </h4>
                    <ul className="space-y-3">
                      {sub.items?.map((item, j) => (
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
  const { bootcamps, loading } = useSelector((state) => state.bootcamp);
  const [activeIndex, setActiveIndex] = useState(0);

  const onlineBootcamp = bootcamps.find((b) => b.type === "online");

  // PDF Download Function
  const handleDownloadPDF = () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      let yPosition = 20;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const maxWidth = pdf.internal.pageSize.getWidth() - 2 * margin;

      // Title
      pdf.setFontSize(24);
      pdf.setFont(undefined, "bold");
      pdf.text("Course Syllabus", margin, yPosition);
      yPosition += 15;

      // Batch Info
      pdf.setFontSize(12);
      pdf.setFont(undefined, "normal");
      pdf.text(`Batch: ${onlineBootcamp?.batch?.year || "2025"}`, margin, yPosition);
      yPosition += 10;

      // Syllabus Content
      const syllabusData = onlineBootcamp?.syllabus || [];
      
      syllabusData.forEach((section, sectionIndex) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        // Section Title
        pdf.setFontSize(14);
        pdf.setFont(undefined, "bold");
        const sectionTitle = `Module ${sectionIndex + 1}: ${section.title}`;
        const splitTitle = pdf.splitTextToSize(sectionTitle, maxWidth);
        pdf.text(splitTitle, margin, yPosition);
        yPosition += splitTitle.length * 6 + 5;

        // Section Content
        pdf.setFontSize(10);
        pdf.setFont(undefined, "normal");

        section.content?.forEach((sub) => {
          // Check page break
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = 20;
          }

          // Subtitle
          pdf.setFont(undefined, "bold");
          pdf.setTextColor(100, 100, 100);
          const splitSubtitle = pdf.splitTextToSize(`• ${sub.subtitle}`, maxWidth - 5);
          pdf.text(splitSubtitle, margin + 5, yPosition);
          yPosition += splitSubtitle.length * 5 + 2;

          // Items
          pdf.setFont(undefined, "normal");
          pdf.setTextColor(0, 0, 0);
          sub.items?.forEach((item) => {
            // Check page break
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }

            const splitItem = pdf.splitTextToSize(`- ${item}`, maxWidth - 10);
            pdf.text(splitItem, margin + 10, yPosition);
            yPosition += splitItem.length * 5 + 1;
          });

          yPosition += 3;
        });

        yPosition += 5;
      });

      // Save PDF
      pdf.save(`Syllabus_${onlineBootcamp?.batch?.year || "2025"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
        <Loader2 className="animate-spin text-accent w-10 h-10" />
        <span className="text-xs font-mono tracking-widest text-text-secondary uppercase">Syncing_Curriculum...</span>
      </div>
    );
  }

  if (!onlineBootcamp) {
    return (
      <div className="text-center py-40 font-mono text-text-secondary">
        // NO_ONLINE_TRACK_INITIALIZED
      </div>
    );
  }

  const syllabusData = onlineBootcamp.syllabus || [];

  return (
    <section className="min-h-screen text-text py-24 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* HEADER */}
        <header className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block px-4 py-1 border border-accent/20 bg-accent/5 mb-6">
                <span className="text-accent text-[10px] tracking-[0.4em] uppercase font-bold">
                    Curriculum
                </span>
            </div>
            <h1 className="text-5xl md:text-[72px] font-display tracking-tighter text-text leading-tight mb-2 ">
              What You'll Study
            </h1>
            <p className="text-lg md:text-2xl font-sans text-text-secondary tracking-tight font-light">
              Structured learning for the Online track
            </p>
          </motion.div>
        </header>

        {/* ACCORDION */}
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

        {/* BATCH INFO & DOWNLOAD */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 flex flex-col items-center gap-6"
        >
          <button 
            onClick={handleDownloadPDF}
            className="group relative glass px-10 py-4 rounded-full font-display font-bold overflow-hidden transition-all hover:scale-105 border border-white/10 cursor-pointer"
          >
            <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity" />
            <span className="relative z-10 flex items-center gap-3">
              <Download size={18} className="text-accent" />
              Download PDF Syllabus
            </span>
          </button>
          
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold opacity-60">
            Updated for {onlineBootcamp?.batch?.year || '2025'} Batch
          </p>
        </motion.div>

      </div>
    </section>
  );
}