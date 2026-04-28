import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const CTASection = () => {
  return (
    <section 
      className="relative w-full py-24 md:py-40 overflow-hidden bg-bg border-t border-border"
    >
      {/* Background Noise - Standard according to your CSS */}
      <div className="noise-bg" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-6xl md:text-8xl leading-none tracking-tight mb-8"
          >
            {/* Colors applied sequentially: White -> Accent -> White */}
            <span className="text-white">Start Your</span> <br />
            <span className="italic font-serif text-accent">
              Tech Journey
            </span>{" "}
            <span className="text-white">Today</span>
          </motion.h2>
          
          <p className="font-sans text-text-secondary text-base md:text-xl max-w-xl mx-auto mb-12 opacity-80">
            At Prish Infotech, we bridge the gap between imagination and implementation.
          </p>

          {/* THEMED BUTTON */}
          <motion.button
            whileHover={{ 
              backgroundColor: "#e6cec8", 
              color: "#131014",          
              scale: 1.05
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="group relative flex items-center justify-center gap-4 px-8 py-4 md:px-10 md:py-5 rounded-full bg-accent text-bg font-display font-bold text-lg md:text-xl tracking-tight shadow-xl whitespace-nowrap"
          >
            <span className="relative z-10">
              Explore Courses
            </span>

            {/* Changed to bg-black/10 to get that darker circular look from the image */}
            <div className="relative z-10 w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-bg" />
            </div>
          </motion.button>
        </div>
      </div>
    </section>
  );
};