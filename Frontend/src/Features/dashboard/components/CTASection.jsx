import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const CTASection = () => {
  const sectionRef = useRef(null);
  
  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Magnetic logic
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const bX = useSpring(0, { damping: 15, stiffness: 150 });
  const bY = useSpring(0, { damping: 15, stiffness: 150 });

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(clientX - centerX, clientY - centerY);

      if (distance < 150) {
        bX.set((clientX - centerX) * 0.4);
        bY.set((clientY - centerY) * 0.4);
      } else {
        bX.set(0);
        bY.set(0);
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { bX.set(0); bY.set(0); }}
      className="relative w-full py-24 md:py-40 overflow-hidden bg-bg border-t border-border"
    >
      <div className="noise-bg opacity-[0.03]" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          
          {/* UPDATED HEADING: Matches "Crafting Logic" exactly */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-6xl md:text-8xl leading-none tracking-tight mb-8"
          >
            Start Your <br />
            <span className="italic font-serif text-accent">
              Tech Journey
            </span>{" "}
            Today
          </motion.h2>
          
          <p className="font-sans text-text-secondary text-base md:text-xl max-w-xl mx-auto mb-12 opacity-80">
            At Prish Infotech, we bridge the gap between imagination and implementation.
          </p>

          {/* BUTTON CONTAINER */}
          <motion.div style={{ x: bX, y: bY }} className="relative">
            <motion.button
              ref={buttonRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative flex items-center justify-center gap-4 px-8 py-4 md:px-10 md:py-5 rounded-full bg-accent text-bg overflow-hidden transition-all duration-300 shadow-2xl shadow-accent/10 active:scale-95 whitespace-nowrap"
            >
              <motion.div 
                className="absolute inset-0 bg-text"
                initial={{ y: "100%" }}
                animate={{ y: isHovered ? "0%" : "100%" }}
                transition={{ duration: 0.4, ease: "circOut" }}
              />

              <span className="relative z-10 font-display font-bold text-lg md:text-xl tracking-tight">
                Explore Courses
              </span>

              <motion.div 
                animate={{ rotate: isHovered ? 45 : 0 }}
                className="relative z-10 w-8 h-8 md:w-9 md:h-9 rounded-full bg-bg/20 flex items-center justify-center"
              >
                <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
              </motion.div>
            </motion.button>

            <motion.div 
              className="absolute inset-0 bg-accent/20 blur-2xl rounded-full -z-10"
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1.2 : 0.8
              }}
            />
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(146,104,104,0.1), transparent 80%)`
          ),
        }}
      />
    </section>
  );
};