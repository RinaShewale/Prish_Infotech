import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-4 backdrop-blur-md bg-bg/80 border-b border-border/50"
          : "py-8 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

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
        <div className="hidden md:flex items-center gap-10 text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
          {["Curriculum", "Mentors", "Enterprise", "Journal"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-accent transition-colors"
            >
              {item}
            </a>
          ))}

          <button className="px-6 py-2 border border-border rounded-full text-[10px] uppercase tracking-widest hover:border-accent transition-colors">
            Sign In
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-text-secondary hover:text-text transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-b border-border p-6 md:hidden flex flex-col gap-6"
          >
            {["Curriculum", "Mentors", "Enterprise", "Journal"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-lg font-medium text-text-secondary hover:text-text"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}

            <button className="w-full py-4 rounded-xl bg-accent text-bg font-bold">
              Enroll Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Nav;