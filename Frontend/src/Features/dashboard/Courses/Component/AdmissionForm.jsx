import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ArrowRight,
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Phone,
  Building2,
  CheckCircle2,
  Sparkles
} from "lucide-react";

import { useApplication } from "../hooks/useApplication";

const occupations = ["Student", "Working", "Gap Year"];

export default function AdmissionForm() {
  const [occupation, setOccupation] = useState("Student");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { handleCreateApplication } = useApplication();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bootcamp: "codex(Online)",
    graduationYear: 2026,
    contactNumber: "",
    collegeOrCompany: "",
    personalStatement: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await handleCreateApplication({
        ...formData,
        occupation,
      });

      setIsSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 relative">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass rounded-[32px] md:rounded-[48px] border border-white/10 bg-white/[0.02] backdrop-blur-3xl p-6 md:p-16 lg:p-20 shadow-2xl relative overflow-hidden"
          >
            {/* HUD Corner Decorations */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-accent/30 rounded-tl-[32px] md:rounded-tl-[48px]" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-accent/30 rounded-tr-[32px] md:rounded-tr-[48px]" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-accent/30 rounded-bl-[32px] md:rounded-bl-[48px]" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-accent/30 rounded-br-[32px] md:rounded-br-[48px]" />

            <div className="relative z-10">
              <motion.header variants={itemVariants} className="mb-12 md:mb-16">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-[1px] w-8 bg-accent" />
                  <span className="text-accent font-display text-[10px] tracking-[0.4em] uppercase">Registration_Open</span>
                </div>
                <h2 className="font-display text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight leading-none text-white">
                  Apply for <span className="italic font-serif text-accent drop-shadow-[0_0_15px_rgba(230,206,200,0.3)]">Admission</span>
                </h2>
                <p className="text-text/40 font-light tracking-widest uppercase text-[10px] md:text-xs">
                  Limited seats available for the <span className="text-white/60 font-bold">May 15 Cohort</span>
                </p>
              </motion.header>

              <form onSubmit={handleSubmit} className="space-y-12 md:space-y-20">
                {/* OCCUPATION TOGGLE */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <label className="font-display text-[11px] uppercase tracking-[0.3em] text-accent/80 font-bold flex items-center gap-2">
                    <Sparkles size={14} /> Current Status
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {occupations.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setOccupation(opt)}
                        className={`relative px-6 md:px-10 py-3 rounded-full text-xs md:text-sm font-medium transition-all duration-500 border overflow-hidden group ${occupation === opt
                          ? "border-accent text-bg shadow-[0_0_25px_rgba(230,206,200,0.15)]"
                          : "border-white/10 text-text/40 hover:border-white/30"
                          }`}
                      >
                        <span className={`relative z-10 transition-colors duration-500 ${occupation === opt ? "text-bg" : "group-hover:text-text"}`}>
                          {opt}
                        </span>
                        {occupation === opt && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-accent z-0"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* FORM GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-10">
                  <FormInput
                    label="Full Name"
                    placeholder="John Doe"
                    icon={<User size={18} />}
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fullName: e.target.value,
                      })
                    }
                  />
                  <FormInput
                    label="Email Address"
                    type="email"
                    placeholder="john@vault.com"
                    icon={<Mail size={18} />}
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                  />

                  <FormSelect
                    label="Choose Bootcamp"
                    icon={<Briefcase size={18} />}
                    required
                    value={formData.bootcamp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bootcamp: e.target.value,
                      })
                    }
                  >
                    <option className="bg-bg">codex(Online)</option>
                    <option className="bg-bg">coder(Offline)</option>

                  </FormSelect>

                  <FormSelect
                    label="Graduation Year"
                    icon={<GraduationCap size={18} />}
                    value={formData.graduationYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        graduationYear: Number(
                          e.target.value
                        ),
                      })
                    }
                  >
                    {[2024, 2025, 2026, 2027].map(year => (
                      <option key={year} className="bg-bg text-white">{year}</option>
                    ))}
                  </FormSelect>

                  <FormInput
                    label="Contact Number"
                    type="tel"
                    placeholder="+1 (555) 000-000"
                    icon={<Phone size={18} />}
                    required
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      })
                    }
                  />
                  <FormInput
                    label="College / Company"
                    placeholder="University of X"
                    icon={<Building2 size={18} />}
                    required
                    value={formData.collegeOrCompany}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        collegeOrCompany:
                          e.target.value,
                      })
                    }
                  />
                </div>

                {/* TEXTAREA */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <label className="font-display text-xl md:text-2xl text-text/90 flex items-center gap-3">
                    Personal Statement
                    <span className="text-[10px] tracking-widest text-text/30 uppercase font-light">Optional</span>
                  </label>
                  <textarea value={formData.personalStatement}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalStatement:
                          e.target.value,
                      })
                    }
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 focus:outline-none focus:border-accent/50 focus:bg-white/[0.04] transition-all text-text/80 font-light resize-none min-h-[150px] placeholder:text-text/20 shadow-inner"
                    placeholder="Tell us about your goals, experience, or what drives you..."
                  />
                </motion.div>

                {/* SUBMIT BUTTON */}
                <motion.div variants={itemVariants} className="pt-6">
                  <button
                    type="submit"
                    className="group relative w-full md:w-auto flex items-center justify-between md:justify-start gap-8 bg-white text-bg px-8 md:px-10 py-5 rounded-full font-display font-bold text-lg md:text-xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] overflow-hidden"
                  >
                    <span className="relative z-10">Submit Application</span>
                    <div className="relative z-10 w-10 h-10 rounded-full bg-bg flex items-center justify-center text-white group-hover:rotate-45 transition-transform duration-500">
                      <ArrowRight size={20} />
                    </div>
                    {/* Hover Slide Effect */}
                    <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        ) : (
          /* SUCCESS STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-[48px] border border-white/10 bg-white/[0.01] backdrop-blur-3xl p-12 md:p-24 text-center space-y-8"
          >
            <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/40">
              <CheckCircle2 size={48} className="text-accent" />
            </div>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter">APPLICATION <br /><span className="text-accent italic">RECEIVED</span></h2>
            <p className="text-text/60 font-light max-w-md mx-auto leading-relaxed">
              Your credentials have been uploaded to our secure servers. Our admissions team will review your profile and contact you within 48 standard hours.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-accent font-display text-sm tracking-widest uppercase border-b border-accent/30 pb-1 hover:border-accent transition-colors"
            >
              Return to Form
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FormInput = ({
  label,
  placeholder,
  type = "text",
  required,
  icon,
  value,
  onChange,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="flex flex-col gap-4 relative group">
      <label className={`font-display text-lg md:text-xl transition-colors duration-300 ${focused ? "text-accent" : "text-text/70"}`}>
        {label} {required && <span className="text-accent text-xs ml-1 opacity-50">*</span>}
      </label>
      <div className="relative">
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused ? "text-accent" : "text-white/20"}`}>
          {icon}
        </div>
        <input
          value={value}
          onChange={onChange}
          type={type}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent border-b border-white/10 pl-8 py-3 focus:outline-none transition-all text-text/80 placeholder:text-text/10 font-light text-sm md:text-base"
        />
        <motion.div
          className="absolute bottom-0 left-0 h-[1px] bg-accent shadow-[0_0_10px_rgba(230,206,200,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: focused ? "100%" : 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
};

const FormSelect = ({
  label,
  children,
  required,
  icon,
  value,
  onChange,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-4 relative group">
      <label className={`font-display text-lg md:text-xl transition-colors duration-300 ${focused ? "text-accent" : "text-text/70"}`}>
        {label} {required && <span className="text-accent text-xs ml-1 opacity-50">*</span>}
      </label>
      <div className="relative">
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused ? "text-accent" : "text-white/20"}`}>
          {icon}
        </div>
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent border-b border-white/10 pl-8 py-3 focus:outline-none transition-all text-text/80 appearance-none cursor-pointer font-light text-sm md:text-base"
        >
          {children}
        </select>
        <ChevronDown className={`absolute right-0 top-1/2 -translate-y-1/2 transition-transform duration-300 ${focused ? "text-accent rotate-180" : "text-white/20"}`} size={18} />
        <motion.div
          className="absolute bottom-0 left-0 h-[1px] bg-accent"
          initial={{ width: 0 }}
          animate={{ width: focused ? "100%" : 0 }}
        />
      </div>
    </div>
  );
};