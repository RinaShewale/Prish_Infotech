import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, User, ArrowRight, CheckCircle2, Calendar, Clock } from "lucide-react";

export const RequestCallback = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section className="relative min-h-screen py-24 px-6 flex items-center justify-center overflow-hidden">
      {/* Background Decor */}
      <div className="noise-bg" />
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm uppercase tracking-[0.3em] text-accent font-medium mb-4">
            Get in Touch
          </h2>
          <h1 className="text-5xl md:text-7xl font-display font-medium leading-tight mb-6">
            Schedule a <br /> 
            <span className="font-serif italic font-light text-text-secondary">Free Call</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-md leading-relaxed mb-10">
            Our academic experts are here to help you navigate your career path. 
            Select a preferred date and time for a personalized consultation.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-accent transition-colors">
                <Phone size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-text-secondary">Direct Support</p>
                <p className="text-text font-medium">+1 (555) 000-0000</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass glow-card p-8 md:p-10 rounded-3xl relative"
        >
          <div className="gloss-overlay absolute inset-0 rounded-3xl" />
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
              
              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <User className="absolute left-0 top-3 text-accent" size={18} />
                  <input
                    type="text" required placeholder="Full Name"
                    className="w-full bg-transparent border-b border-border py-3 pl-8 focus:outline-none focus:border-accent transition-colors placeholder:text-text-secondary/40"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-0 top-3 text-accent" size={18} />
                  <input
                    type="tel" required placeholder="Phone Number"
                    className="w-full bg-transparent border-b border-border py-3 pl-8 focus:outline-none focus:border-accent transition-colors placeholder:text-text-secondary/40"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="relative">
                <Mail className="absolute left-0 top-3 text-accent" size={18} />
                <input
                  type="email" required placeholder="Email Address"
                  className="w-full bg-transparent border-b border-border py-3 pl-8 focus:outline-none focus:border-accent transition-colors placeholder:text-text-secondary/40"
                />
              </div>

              {/* Scheduling Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold flex items-center gap-2">
                    <Calendar size={12} /> Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    min={getTodayDate()} // Prevents selection of past dates
                    className="w-full bg-bg2/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-all text-text-secondary appearance-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold flex items-center gap-2">
                    <Clock size={12} /> Preferred Time
                  </label>
                  <input
                    type="time"
                    required
                    className="w-full bg-bg2/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-all text-text-secondary appearance-none"
                  />
                </div>
              </div>

              {/* Subject Selection */}
              <div className="pt-2">
                <label className="text-[10px] uppercase tracking-widest text-text-secondary mb-2 block">Reason for inquiry</label>
                <div className="relative">
                  <select className="w-full bg-bg2/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-all text-text appearance-none cursor-pointer">
                    <option className="bg-bg2">Full Stack Development Bootcamp</option>
                    <option className="bg-bg2">Data Science Masterclass</option>
                    <option className="bg-bg2">UI/UX Design Course</option>
                    <option className="bg-bg2">Career Counseling</option>
                    <option className="bg-bg2">Other Inquiry</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <ArrowRight size={14} className="rotate-90" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full group mt-4 bg-accent hover:bg-accent/90 text-bg py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-accent/10"
              >
                Request Callback
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          ) : (
            /* Success State */
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 py-12 text-center"
            >
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-accent" />
              </div>
              <h3 className="text-2xl font-display mb-2">Request Received</h3>
              <p className="text-text-secondary">
                We've noted your preferred time. Our team will contact you shortly to confirm your consultation.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-8 text-accent text-sm uppercase tracking-widest font-medium border-b border-accent hover:text-text hover:border-text transition-colors"
              >
                Send another request
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
