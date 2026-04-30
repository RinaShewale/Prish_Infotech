import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CheckCircle2, ShieldCheck, Award, QrCode, Globe } from "lucide-react";

export const BootcampCertification = () => {
  // 3D Tilt Effect logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Slightly increased rotation range for better depth perception
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-bg">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* LEFT: Content & Value Proposition */}
          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/20"
            >
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Industry Verified</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl font-display leading-[0.95] tracking-tighter"
            >
              Earn Your <br />
              <span className="text-accent italic font-serif underline decoration-accent/20">Digital Legacy</span>
            </motion.h2>

            <p className="text-xl text-text-secondary font-light max-w-lg leading-relaxed">
              Don't just learn. Get recognized. Our certificates are cryptographically signed and easily shareable on LinkedIn, Twitter, and your portfolio.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: <Award />, title: "ISO Certified", desc: "Global recognition standards" },
                { icon: <Globe />, title: "LinkedIn Ready", desc: "One-click share feature" },
                { icon: <QrCode />, title: "Verifiable", desc: "Unique QR for authenticity" },
                { icon: <CheckCircle2 />, title: "LIFETIME", desc: "Permanent digital credential" },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors"
                >
                  <div className="text-accent mb-3">{item.icon}</div>
                  <h4 className="font-bold text-sm uppercase tracking-wider mb-1">{item.title}</h4>
                  <p className="text-xs text-text-secondary leading-tight">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: The 3D Interactive Certificate */}
          <motion.div 
            style={{ 
              rotateX, 
              rotateY, 
              perspective: 1200,
              transformStyle: "preserve-3d" 
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative cursor-default group"
          >
            {/* Holographic Glow behind certificate */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-white/5 to-accent/20 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* MAIN CERTIFICATE CARD */}
            <div 
              style={{ transformStyle: "preserve-3d" }}
              className="relative z-10 bg-[#fbfbfb] rounded-[40px] p-8 md:p-14 text-[#000] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden border-[12px] border-white/50"
            >
              
              {/* Subtle Texture/Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              
              {/* Decorative Holographic Shine */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" 
              />

              {/* Certificate Header */}
              <div className="flex justify-between items-start mb-14" style={{ transform: "translateZ(60px)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform shadow-xl">
                    <span className="text-white font-display font-black text-3xl">P</span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg leading-tight uppercase tracking-tighter">Prish <span className="text-gray-400 font-medium">Infotech</span></p>
                    <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">Engineering League</p>
                  </div>
                </div>

                {/* The Ribbon Element - Highest Depth */}
                <div className="relative transform translate-y-[-20px]" style={{ transform: "translateZ(100px)" }}>
                  <div className="w-14 h-24 bg-[#6366f1] rounded-b-xl flex flex-col items-center pt-5 shadow-2xl">
                     <div className="w-10 h-10 bg-[#ffd700] rounded-full border-4 border-white/30 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-white stroke-[3px]" />
                     </div>
                  </div>
                  <div className="absolute bottom-[-12px] left-0 w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-t-[12px] border-t-[#6366f1]" />
                </div>
              </div>

              {/* Certificate Body */}
              <div className="space-y-6 mb-16" style={{ transform: "translateZ(50px)" }}>
                <div className="space-y-1">
                    <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-gray-400">Certificate of Completion</h3>
                    <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-black">Mastery</h1>
                </div>

                <div className="space-y-2" style={{ transform: "translateZ(30px)" }}>
                    <p className="text-xs uppercase tracking-widest font-bold text-gray-400">This honor is presented to</p>
                    <div className="relative">
                        <h2 className="text-3xl md:text-5xl font-serif italic font-medium text-black border-b-2 border-gray-100 pb-3">
                           Alexandria Smith
                        </h2>
                    </div>
                </div>

                <p className="text-sm md:text-base leading-relaxed text-gray-600 font-medium max-w-xl">
                  For successfully demonstrating expert-level proficiency in <span className="text-black font-bold">MERN Architecture, DevOps Automation, and Generative AI Integration</span> during the 2025 Prish Incubator program.
                </p>
              </div>

              {/* Certificate Footer */}
              <div className="flex justify-between items-end" style={{ transform: "translateZ(40px)" }}>
                <div className="space-y-4">
                  <div className="text-left">
                    <p className="text-lg font-bold text-black leading-none">OCT 24, 2025</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Issue Date</p>
                  </div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-[9px] font-mono text-gray-500">
                    ID: PR-9920-X12
                  </div>
                </div>

                <div className="text-right">
                  <div className="mb-2">
                     <span className="font-serif italic text-2xl text-black/80">Adarsh Gupta</span>
                  </div>
                  <div className="h-[2px] w-40 bg-gray-200 ml-auto mb-2" />
                  <p className="text-xs font-bold uppercase tracking-tighter">Program Director</p>
                  <p className="text-[10px] text-gray-400">Prish Infotech India</p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};