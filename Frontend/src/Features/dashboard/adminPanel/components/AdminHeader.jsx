import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, User, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../auth/hooks/useAuth";
import { logout as logoutAction } from "../../../auth/redux/auth.slice";

const AdminHeader = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleLogout } = useAuth();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutUser = async () => {
    try {
      await handleLogout();
      dispatch(logoutAction());
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <header className="h-16 lg:h-20 border-b border-white/5 px-4 lg:px-8 flex items-center justify-between bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-40">
      
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4 flex-1">
        {/* MENU BUTTON - Now correctly calls toggleSidebar */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleSidebar();
          }}
          className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all active:scale-90"
        >
          <Menu size={24} />
        </button>

        {/* Desktop Search */}
        <div className="relative hidden md:block w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent/50 transition-all"
            placeholder="Command Search..."
          />
        </div>

        {/* Mobile Search Icon */}
        <button onClick={() => setIsSearchOpen(true)} className="md:hidden p-2 text-gray-400">
          <Search size={20} />
        </button>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 text-gray-400 hover:text-white relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-[#050505]"></span>
        </button>

        <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block" />

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-bold">
               {user?.name?.charAt(0) || "A"}
            </div>
            <ChevronDown size={14} className={`text-gray-500 hidden sm:block transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-3 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl py-2 z-50"
              >
                <button onClick={() => navigate("/admin/settings")} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 text-xs uppercase tracking-widest">
                  <User size={16} className="text-accent" /> My Profile
                </button>
                <button onClick={logoutUser} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/5 text-xs uppercase tracking-widest font-bold">
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE SEARCH OVERLAY */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 bg-[#050505] z-[60] flex items-center px-4 gap-4 md:hidden"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input autoFocus className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 text-white focus:outline-none" placeholder="Search..." />
            </div>
            <button onClick={() => setIsSearchOpen(false)} className="p-2 text-gray-400"><X size={24} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default AdminHeader;