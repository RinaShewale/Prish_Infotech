import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// ✅ AUTH HOOK
import { useAuth } from "../hooks/useAuth";

export const Register = () => {
  const navigate = useNavigate();
  const { handleRegister, handleGoogleLogin } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await handleRegister(formData);

      if (res?.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          navigate("/");
        }, 2500);
      } else {
        setError(res?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.log("Register error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSignUp = async () => {
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

        {/* LEFT SIDE - Branding */}
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
              Join the Community
            </motion.p>
            <h1 className="text-6xl xl:text-7xl font-bold leading-tight tracking-tighter">
              Start your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/50">
                Growth Story.
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-md font-light leading-relaxed">
              Create an account to unlock premium courses, certificates, and expert mentorship.
            </p>
          </div>

          <div className="pt-8 flex flex-col gap-4 border-t border-white/5">
            <div className="flex items-center gap-3 text-gray-400">
              <ShieldCheck className="text-accent" size={20} />
              <span>Secure industry-standard encryption</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <ShieldCheck className="text-accent" size={20} />
              <span>Full access to all free resources</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE - Register Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative group w-full"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-blue-500/20 rounded-[2rem] md:rounded-[2.5rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

          <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 border border-white/10 shadow-2xl">

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div key="register-form" exit={{ opacity: 0, scale: 0.95 }}>
                  <div className="mb-8 text-center lg:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Create Account</h2>
                    <p className="text-gray-400 text-sm">Join Prish Infotech today.</p>
                  </div>

                  {/* ERROR MESSAGE */}
                  <AnimatePresence>
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
                    {/* GOOGLE BUTTON WITH PNG */}
                    <motion.button
                      variants={itemVariants}
                      type="button"
                      onClick={onGoogleSignUp}
                      disabled={isGoogleLoading}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                    >
                      {isGoogleLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            alt="Google Logo" 
                            className="w-5 h-5 object-contain"
                          />
                          Continue with Google
                        </>
                      )}
                    </motion.button>

                    {/* DIVIDER */}
                    <motion.div variants={itemVariants} className="flex items-center gap-4">
                      <div className="h-px bg-white/10 flex-1" />
                      <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] whitespace-nowrap">or register with email</span>
                      <div className="h-px bg-white/10 flex-1" />
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                      {/* USERNAME */}
                      <motion.div variants={itemVariants} className="space-y-2">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Full Name</label>
                        <div className="relative group/input">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-accent transition-colors" size={18} />
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 md:py-4 pl-12 pr-4 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all duration-300 text-sm md:text-base"
                            placeholder="John Doe"
                          />
                        </div>
                      </motion.div>

                      {/* EMAIL */}
                      <motion.div variants={itemVariants} className="space-y-2">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Email Address</label>
                        <div className="relative group/input">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-accent transition-colors" size={18} />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 md:py-4 pl-12 pr-4 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all duration-300 text-sm md:text-base"
                            placeholder="john@example.com"
                          />
                        </div>
                      </motion.div>

                      {/* PASSWORD */}
                      <motion.div variants={itemVariants} className="space-y-2">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Password</label>
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

                      {/* REGISTER BUTTON */}
                      <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-accent hover:bg-accent/90 text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/20 mt-2 text-sm md:text-base"
                      >
                        {isLoading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
                      </motion.button>

                      <motion.p variants={itemVariants} className="text-center text-sm text-gray-400 mt-4">
                        Already have an account?{" "}
                        <Link to="/login" className="text-accent font-semibold hover:text-accent/80 transition-colors">
                          Sign In
                        </Link>
                      </motion.p>
                    </form>
                  </div>
                </motion.div>
              ) : (
                /* SUCCESS STATE */
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-6">
                    <ShieldCheck className="text-accent" size={40} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Welcome to the Team!</h2>
                  <p className="text-gray-400 text-sm md:text-base mb-8">
                    Your account has been created successfully. <br /> Redirecting you to login...
                  </p>
                  <Loader2 className="animate-spin mx-auto text-accent" size={32} />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </div>
    </section>
  );
};