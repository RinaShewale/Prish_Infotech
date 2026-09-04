import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, Download, ChevronRight, Layout, Target, Zap } from "lucide-react";
import jsPDF from "jspdf";

const SyllabusSection = () => {
  const { bootcamps, loading } = useSelector((state) => state.bootcamp);
  const [activeTab, setActiveTab] = useState(0);

  const onlineBootcamp = bootcamps.find((b) => b.type === "online");
  const syllabusData = onlineBootcamp?.syllabus || [];

  const handleDownloadPDF = () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.setFontSize(22);
      pdf.text("Course Syllabus", 20, 20);
      let y = 40;
      syllabusData.forEach((s, i) => {
        if (y > 270) { pdf.addPage(); y = 20; }
        pdf.setFontSize(14);
        pdf.text(`${i + 1}. ${s.title}`, 20, y);
        y += 10;
        s.content?.forEach(c => {
          pdf.setFontSize(10);
          pdf.text(`- ${c.subtitle}`, 25, y);
          y += 7;
        });
        y += 5;
      });
      pdf.save("Syllabus.pdf");
    } catch (e) { console.error(e); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <Loader2 className="animate-spin text-accent mb-4" size={32} />
      <p className="text-xs tracking-widest text-text-secondary uppercase">Loading Curriculum</p>
    </div>
  );

  if (!onlineBootcamp) return <div className="py-20 text-center opacity-50 font-mono text-sm">// NO_DATA_FOUND</div>;

  return (
    <section className="py-24 px-6 bg-bg text-text selection:bg-accent selection:text-bg">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-accent text-xs font-bold tracking-[0.4em] uppercase block mb-4"
            >
              Academic Path
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Master the <span className="text-accent italic font-serif">Modern</span> Stack.
            </h2>
          </div>
          
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-all text-sm font-medium group"
          >
            <Download size={16} className="group-hover:text-accent transition-colors" />
            Get PDF Syllabus
          </button>
        </div>

        {/* Explorer Interface */}
        <div className="grid md:grid-cols-[350px_1fr] gap-12 items-start">
          
          {/* Navigation Sidebar */}
          <div className="space-y-2 sticky top-10">
            {syllabusData.map((section, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`w-full text-left group relative p-5 rounded-2xl transition-all duration-300 ${
                  activeTab === idx 
                  ? 'bg-white/5 border border-white/10' 
                  : 'hover:bg-white/[0.02] border border-transparent'
                }`}
              >
                {activeTab === idx && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-accent rounded-r-full"
                  />
                )}
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-mono transition-colors ${activeTab === idx ? 'text-accent' : 'text-text-secondary'}`}>
                    0{idx + 1}
                  </span>
                  <span className={`font-medium tracking-tight transition-colors ${activeTab === idx ? 'text-text' : 'text-text-secondary group-hover:text-text'}`}>
                    {section.title}
                  </span>
                  <ChevronRight size={14} className={`ml-auto transition-transform ${activeTab === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                </div>
              </button>
            ))}
          </div>

          {/* Content Stage */}
          <div className="min-h-[500px] bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Layout size={200} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <div className="flex items-center gap-3 mb-8">
                    <div className="px-3 py-1 rounded-md bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest">
                        Module Detail
                    </div>
                    <div className="h-px flex-1 bg-white/10" />
                </div>

                <h3 className="text-3xl font-bold mb-10 text-text">
                    {syllabusData[activeTab]?.title}
                </h3>

                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
                  {syllabusData[activeTab]?.content?.map((sub, i) => (
                    <div key={i} className="space-y-5">
                      <div className="flex items-center gap-3 text-accent">
                        <Target size={16} />
                        <h4 className="font-bold text-sm uppercase tracking-wider">{sub.subtitle}</h4>
                      </div>
                      
                      <ul className="space-y-3">
                        {sub.items?.map((item, j) => (
                          <li key={j} className="flex items-start gap-3 group">
                            <div className="mt-1.5 shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-accent transition-colors" />
                            </div>
                            <span className="text-text-secondary text-sm leading-relaxed group-hover:text-text transition-colors">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Footer Insight */}
                <div className="mt-16 pt-8 border-t border-white/5 flex items-center gap-4 text-text-secondary">
                    <Zap size={16} className="text-accent" />
                    <p className="text-xs italic font-light">
                        Industry-validated curriculum updated for the {onlineBootcamp?.batch?.year || '2025'} professional standard.
                    </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Simple Bottom Label */}
        <div className="mt-20 text-center">
            <span className="text-[10px] font-mono text-text-secondary tracking-[0.5em] uppercase opacity-30">
                End of Curriculum Overview
            </span>
        </div>
      </div>
    </section>
  );
};

export default SyllabusSection;