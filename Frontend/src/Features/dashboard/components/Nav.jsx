import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "Courses", "Bootcamp", "Request call"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled && !mobileMenuOpen
          ? "py-4 backdrop-blur-md bg-bg/80 shadow-sm"
          : "py-8 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-[70]">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full border border-accent flex items-center justify-center transition-transform group-hover:rotate-180 duration-700">
            <div className="w-4 h-4 bg-accent rounded-sm rotate-45"></div>
          </div>
          <span className="font-display font-medium text-xl tracking-tight">
            Prish<span className="opacity-50 font-normal">Infotech</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 text-[13px] font-medium uppercase tracking-[0.2em] text-text-secondary">
          {navLinks.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-accent transition-colors">
              {item}
            </a>
          ))}
          <button className="px-8 py-3 border border-border rounded-full text-[13px] uppercase tracking-widest hover:border-accent transition-colors">
            Sign In
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden p-2 text-text-secondary hover:text-text transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Full Page Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 w-full h-screen bg-bg flex flex-col items-center justify-center z-[60]"
          >
            <div className="flex flex-col items-center gap-8 text-center">
              {navLinks.map((item) => (
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-3xl font-display font-light tracking-tight hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}

              {/* Styled Sign In Button to match screenshot */}
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 px-10 py-3 bg-accent text-bg font-bold rounded-full text-lg shadow-lg"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Nav;