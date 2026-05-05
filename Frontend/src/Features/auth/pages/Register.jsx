import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate registration process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-screen bg-bg text-text selection:bg-accent/30 py-24 px-6 flex items-center justify-center overflow-hidden">
      {/* Background Ambience */}
      <div className="noise-bg" />
      <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Brand Story */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-accent font-semibold">Start your journey</p>
            <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tight leading-[1.1]">
              Join <br />
              <span className="text-accent">Prish Infotech</span>
            </h1>
            <p className="text-text-secondary max-w-md text-lg leading-relaxed">
              Register now to unlock premium cohort access, mentorship, and industry-ready projects curated for your success.
            </p>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
              <ShieldCheck className="text-accent" size={24} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-text">Data Privacy</p>
              <p className="text-xs text-text-secondary">Enterprise-grade security for your data.</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Register Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass glow-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden border border-white/10 shadow-2xl"
        >
          <div className="gloss-overlay absolute inset-0 rounded-[2.5rem]" />

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div 
                key="form-step"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                className="relative z-10"
              >
                {/* Social Registration */}
                <motion.button
                  variants={itemVariants}
                  type="button"
                  className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-text py-4 rounded-2xl transition-all duration-300 font-medium mb-6"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Register with Google
                </motion.button>

                <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-text-secondary">Or create account</span>
                  <div className="h-px flex-1 bg-white/10" />
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-bold ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={18} />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-text placeholder:text-text-secondary/30 focus:outline-none focus:border-accent focus:bg-accent/5 transition-all"
                      />
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-bold ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={18} />
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-text placeholder:text-text-secondary/30 focus:outline-none focus:border-accent focus:bg-accent/5 transition-all"
                      />
                    </div>
                  </motion.div>

                  {/* Password */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-bold ml-1">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-text placeholder:text-text-secondary/30 focus:outline-none focus:border-accent focus:bg-accent/5 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-accent text-bg py-4 rounded-2xl font-bold uppercase tracking-[0.25em] transition-all hover:shadow-[0_0_25px_rgba(var(--accent-rgb),0.3)] flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Create Account <ArrowRight size={18} className="ml-1" />
                      </>
                    )}
                  </motion.button>

                  <motion.p variants={itemVariants} className="text-center text-sm text-text-secondary">
                    Already registered?{' '}
                    <Link to="/login" className="text-accent font-bold hover:underline underline-offset-4 decoration-accent/30 transition-all">
                      Sign In
                    </Link>
                  </motion.p>
                </form>
              </motion.div>
            ) : (
              /* Success State */
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 text-center py-12 space-y-6"
              >
                <div className="mx-auto w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                  <ShieldCheck className="text-accent" size={44} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-display font-bold">Welcome Aboard!</h2>
                  <p className="text-text-secondary text-lg">
                    Check your email to verify your account. <br />
                    We're excited to have you at Prish Infotech.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="inline-block bg-accent text-bg px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-accent/90 transition-all shadow-xl shadow-accent/20"
                >
                  Go to Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};