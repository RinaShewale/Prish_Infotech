import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const user = useSelector((state) => state.auth.user);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    // dispatch(logoutAction()); 
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const navLinks = ["Home", "Courses", "Bootcamp", "Request callback"];
  const pathMap = {
    Home: "/",
    Courses: "/courses",
    Bootcamp: "/bootcamp",
    "Request callback": "/callback",
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled && !mobileMenuOpen ? "py-4 backdrop-blur-md bg-bg/80 shadow-sm" : "py-8 bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-accent flex items-center justify-center">
            <div className="w-4 h-4 bg-accent rounded-sm rotate-45"></div>
          </div>
          <span className="font-display font-medium text-xl tracking-tight">
            Prish<span className="opacity-50 font-normal">Infotech</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-10 text-[13px] font-medium uppercase tracking-[0.2em] text-text-secondary">
          {navLinks.map((item) => (
            <Link key={item} to={pathMap[item]} className="hover:text-accent transition-colors">{item}</Link>
          ))}

          {/* USER PROFILE CIRCLE */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-bold text-lg hover:bg-accent/30 transition-all shadow-lg shadow-accent/5"
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>

              {/* POPUP MENU */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-3 w-44 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
                  >
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-white/5 transition-colors">
                      <User size={16} /> Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-400/5 transition-colors">
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="px-8 py-3 border border-border rounded-full text-[13px] uppercase tracking-widest hover:border-accent">
              Sign In
            </button>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button className="md:hidden p-2 text-text-secondary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full h-screen bg-bg flex flex-col items-center justify-center z-60"
          >
            <div className="flex flex-col items-center gap-8 text-center">
              {navLinks.map((item) => (
                <Link key={item} to={pathMap[item]} onClick={() => setMobileMenuOpen(false)} className="text-3xl font-display font-light">
                  {item}
                </Link>
              ))}

              {/* MOBILE LOGOUT / LOGIN LOGIC */}
              {user ? (
                <div className="flex flex-col items-center gap-4 mt-4">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-2xl">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-widest text-sm"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); navigate("/login"); }} className="mt-4 px-10 py-3 bg-accent text-bg font-bold rounded-full">
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};