import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, QrCode, Award, CheckCircle } from 'lucide-react';

const CertificationSection = ({ data }) => {
  if (!data) return null;

  const features = [
    { icon: <Award className="w-5 h-5 text-accent" />, title: "ISO CERTIFIED", desc: "Global recognition standards" },
    { icon: <Globe className="w-5 h-5 text-accent" />, title: "LINKEDIN READY", desc: "One-click share feature" },
    { icon: <QrCode className="w-5 h-5 text-accent" />, title: "VERIFIABLE", desc: "Unique QR for authenticity" },
    { icon: <CheckCircle className="w-5 h-5 text-accent" />, title: "LIFETIME", desc: "Permanent digital credential" }
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT CONTENT */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">Industry Verified</span>
            </div>
          </div>

          <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-tight tracking-tighter text-left">
            {data.mainHeading} <br />
            <span className="italic font-serif text-accent border-b-2 border-accent/30">{data.highlightedText}</span>
          </h2>

          <p className="text-xl text-text-secondary mb-12 max-w-lg leading-relaxed font-light text-left">
            {data.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-accent/20 transition-colors group text-left">
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300 origin-left">{f.icon}</div>
                <h4 className="text-xs font-bold text-white tracking-widest mb-1 uppercase">{f.title}</h4>
                <p className="text-xs text-text-secondary font-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT CONTENT - DYNAMIC CERTIFICATE */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-accent/10 blur-3xl rounded-full opacity-50" />
          
          <div className="relative bg-[#F9F9F9] rounded-[40px] p-8 md:p-12 shadow-2xl text-black text-left">
            {/* Blue Badge */}
            <div className="absolute top-0 right-12 w-12 h-20 bg-indigo-600 shadow-lg flex items-center justify-center rounded-b-lg">
               <div className="w-8 h-8 rounded-full bg-yellow-400 border-4 border-white/20 flex items-center justify-center">
                 <CheckCircle className="w-4 h-4 text-indigo-900" />
               </div>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white font-black text-2xl">P</div>
              <div>
                <h4 className="text-xs font-black tracking-tighter uppercase">Prish <span className="text-gray-400 font-medium">Infotech</span></h4>
                <p className="text-[8px] tracking-[0.2em] font-bold text-gray-500 uppercase">Engineering League</p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] tracking-[0.3em] font-bold text-gray-400 uppercase">Certificate of Completion</p>
              <h3 className="text-6xl md:text-7xl font-bold tracking-tighter leading-none mb-4">{data.certType}</h3>
              
              <div className="py-4">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">This honor is presented to</p>
                 <p className="text-4xl md:text-5xl font-serif italic text-black">Alexandria Smith</p>
                 <div className="w-full h-px bg-gray-200 mt-4" />
              </div>

              <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                For successfully demonstrating expert-level proficiency in 
                <span className="font-bold text-black"> {data.skillsLearned}</span> during the 2025 Prish Incubator program.
              </p>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row justify-between items-end gap-8">
              <div>
                <p className="text-lg font-bold text-black mb-1">OCT 24, 2025</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Issue Date</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-serif italic text-black mb-1 tracking-tighter leading-none">Adarsh Gupta</p>
                <div className="w-32 h-px bg-gray-200 ml-auto mb-2" />
                <p className="text-[9px] font-black text-black uppercase">Program Director</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default CertificationSection;