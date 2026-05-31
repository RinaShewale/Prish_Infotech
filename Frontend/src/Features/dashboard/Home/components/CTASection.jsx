import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CTASection = () => {
  const navigate = useNavigate();
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
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                window.scrollTo(0, 0);
                navigate("/courses");
              }}
              className="group relative flex items-center justify-center gap-4 px-10 py-5 md:px-12 md:py-6 rounded-full bg-accent text-bg font-display font-bold text-lg md:text-xl tracking-tight shadow-[0_20px_50px_rgba(230,206,200,0.2)] overflow-hidden"
            >
              <span className="relative z-10">Explore Courses</span>

              <div className="relative z-10 w-9 h-9 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                <ArrowUpRight className="w-6 h-6 text-bg" />
              </div>

              {/* Gloss Shine Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};