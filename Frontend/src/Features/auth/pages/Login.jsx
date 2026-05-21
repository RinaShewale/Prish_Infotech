import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// ✅ AUTH HOOK
import { useAuth } from "../hooks/useAuth";

export const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, handleGoogleLogin } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await handleLogin(formData);
      if (res?.success) {
        navigate("/");
      } else {
        setError(res?.message || "Invalid email or password");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.log("Login Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await handleGoogleLogin();
    } catch (err) {
      setError("Google authentication failed.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-screen bg-[#050505] text-white py-12 md:py-20 px-4 md:px-6 flex items-center justify-center overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[40%] rounded-full bg-accent/10 blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] md:w-[40%] h-[40%] rounded-full bg-accent/5 blur-[80px] md:blur-[120px]" />
        <div className="noise-bg opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        
        {/* LEFT SIDE - Branding (Hidden on Mobile) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col space-y-8"
        >
          <div className="space-y-4">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm uppercase tracking-[0.5em] text-accent font-bold"
            >
              Prish Infotech Portal
            </motion.p>
            <h1 className="text-6xl xl:text-7xl font-bold leading-tight tracking-tighter">
              Skills that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/50">
                shape futures.
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-md font-light leading-relaxed">
              Sign in to continue your journey with our industry-leading mentors.
            </p>
          </div>

          <div className="pt-8 flex items-center gap-6 border-t border-white/5">
            <div>
              <p className="text-2xl font-bold">10k+</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Students</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-bold">50+</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Expert Courses</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE - Login Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative group w-full"
        >
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-[2rem] md:rounded-[2.5rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          
          <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 border border-white/10 shadow-2xl">
            
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-gray-400 text-sm">Please enter your details to sign in.</p>
            </div>

            {/* ERROR MESSAGE */}
            <AnimatePresence mode="wait">
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2"
                    >
                        <AlertCircle size={16} />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-6">
              {/* GOOGLE BUTTON AT TOP */}
              <motion.button
                variants={itemVariants}
                type="button"
                onClick={onGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                {isGoogleLoading ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </>
                )}
              </motion.button>

              {/* DIVIDER */}
              <motion.div variants={itemVariants} className="flex items-center gap-4">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] whitespace-nowrap">or sign in with email</span>
                <div className="h-px bg-white/10 flex-1" />
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                
                {/* EMAIL */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 ml-1">
                    Email Address
                  </label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-accent transition-colors" size={18} />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 md:py-4 pl-12 pr-4 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all duration-300 text-sm md:text-base"
                      placeholder="name@company.com"
                    />
                  </div>
                </motion.div>

                {/* PASSWORD */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                          Password
                      </label>
                      <Link to="/forgot-password" size={18} className="text-[10px] text-accent hover:underline font-bold uppercase tracking-tighter">
                          Forgot?
                      </Link>
                  </div>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-accent transition-colors" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 md:py-4 pl-12 pr-12 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all duration-300 text-sm md:text-base"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>

                {/* SUBMIT BUTTON */}
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent hover:bg-accent/90 text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/20 mt-2 text-sm md:text-base"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Sign In <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>

                {/* REGISTER LINK */}
                <motion.p variants={itemVariants} className="text-center text-sm text-gray-400 mt-4">
                  Don’t have an account?{" "}
                  <Link to="/register" className="text-accent font-semibold hover:text-accent/80 transition-colors">
                    Create Account
                  </Link>
                </motion.p>

              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};