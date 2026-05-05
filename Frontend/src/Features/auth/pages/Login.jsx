import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    navigate("/courses");
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-screen bg-bg text-text selection:bg-accent/30 py-24 px-6 flex items-center justify-center overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="noise-bg" />
      <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Brand Message */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-accent font-semibold">Welcome Back</p>
            <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tight leading-tight">
              Sign in to <br />
              <span className="text-accent">Prish Infotech</span>
            </h1>
            <p className="text-text-secondary max-w-md text-lg leading-relaxed">
              Access your cohort dashboard, track enrollments, and continue your learning journey with a single secure login.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <p className="text-sm text-text-secondary flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Secure access to course materials
            </p>
            <p className="text-sm text-text-secondary flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Real-time project dashboards
            </p>
          </div>
        </motion.div>

        {/* Right Side: Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass glow-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden border border-white/10 shadow-2xl"
        >
          <div className="gloss-overlay absolute inset-0 rounded-[2.5rem]" />

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            {/* Google Social Login */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-text py-4 rounded-2xl transition-all duration-300 font-medium mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </motion.button>

            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-text-secondary">Or use email</span>
              <div className="h-px flex-1 bg-white/10" />
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-bold ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-text placeholder:text-text-secondary/30 focus:outline-none focus:border-accent focus:bg-accent/5 transition-all"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-bold">Password</label>
                  <Link to="/" className="text-[10px] uppercase tracking-widest text-accent hover:underline underline-offset-4 transition-all">Forgot?</Link>
                </div>
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

              <motion.div variants={itemVariants} className="flex items-center gap-3 px-1">
                <input 
                  type="checkbox" 
                  id="remember"
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-accent focus:ring-accent" 
                />
                <label htmlFor="remember" className="text-sm text-text-secondary cursor-pointer select-none">Remember this device</label>
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent text-bg py-4 rounded-2xl font-bold uppercase tracking-[0.25em] transition-all hover:shadow-[0_0_25px_rgba(var(--accent-rgb),0.3)] flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Sign In <ArrowRight size={18} className="ml-1" />
                  </>
                )}
              </motion.button>

              <motion.p variants={itemVariants} className="text-center text-sm text-text-secondary">
                Don’t have an account?{' '}
                <Link to="/register" className="text-accent font-bold hover:underline underline-offset-4 decoration-accent/30 transition-all">
                  Create Account
                </Link>
              </motion.p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};