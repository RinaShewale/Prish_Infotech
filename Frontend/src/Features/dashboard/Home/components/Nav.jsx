// ======================================================
// 📁 components/layout/navbar/Nav.jsx
// ======================================================

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { preloadRoute } from "../../../../app/AppRouter";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import { useAuth } from "../../../auth/hooks/useAuth";

import {
  logout as logoutAction,
} from "../../../auth/redux/auth.slice";

// Import the enrollment action
import { getMyEnrollments } from "../../../dashboard/Courses/redux/enrollment.slice";

export const Nav = () => {

  // States
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const { handleLogout } = useAuth();

  // Redux
  const { user, authChecked } = useSelector((state) => state.auth);
  const { enrollments = [] } = useSelector((state) => state.enrollment);

  // Load enrollments when user logs in to check for Classroom access
  useEffect(() => {
    if (user) {
      dispatch(getMyEnrollments());
    }
  }, [user, dispatch]);

  const hasEnrollments = (enrollments?.length ?? 0) > 0;

  // Navigation Links - FIXED ORDER: Classroom comes after Bootcamp
  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Courses",
      path: "/courses",
    },
    {
      name: "Bootcamp",
      path: "/bootcamp",
    },
    ...(user?.role === "admin"
      ? [{ name: "Admin", path: "/admin" }]
      : []
    ),
    // Conditionally insert Classroom here
    ...(user && user.role !== "admin" && hasEnrollments 
      ? [{ name: "Classroom", path: "/classroom" }] 
      : []
    ),
    {
      name: "Request Callback",
      path: "/callback",
    },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Prevent body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
  }, [mobileMenuOpen]);

  // Logout handler
  const logoutUser = useCallback(
    async () => {
      try {
        await handleLogout();
        dispatch(logoutAction());
        setMobileMenuOpen(false);
        setDropdownOpen(false);
        navigate("/login");
      } catch (error) {
        console.error("Logout Error:", error);
      }
    },
    [handleLogout, dispatch, navigate]
  );

  const mobileItemStyle =
    "text-2xl font-display font-light text-white hover:text-accent transition-all duration-300";

  if (!authChecked) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] h-24" />
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? "py-4 bg-bg/90 backdrop-blur-md shadow-lg"
          : "py-8 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 z-[110]">
          <div className="w-8 h-8 rounded-full border border-accent flex items-center justify-center">
            <div className="w-4 h-4 bg-accent rounded-sm rotate-45" />
          </div>
          <span className="font-display font-medium text-xl tracking-tight text-white uppercase">
            Prish <span className="opacity-50 font-normal">Infotech</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10 text-[15px] font-medium uppercase tracking-[0.2em] text-text-secondary">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onPointerEnter={() => preloadRoute(item.path)}
              onFocus={() => preloadRoute(item.path)}
              className="hover:text-accent transition-colors"
            >
              {item.name}
            </Link>
          ))}

          {/* User Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 overflow-hidden flex items-center justify-center text-accent font-bold hover:bg-accent/30 transition-all"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-lg font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-48 bg-bg border border-white/10 rounded-xl overflow-hidden shadow-2xl py-2"
                  >
                    {user?.role === "admin" ? (
                      <button
                        onClick={() => {
                          navigate("/admin");
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 transition-colors text-xs uppercase tracking-widest"
                      >
                        <User size={16} className="text-accent" />
                        Admin Dashboard
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 transition-colors text-xs uppercase tracking-widest"
                      >
                        <User size={16} className="text-accent" />
                        My Profile
                      </button>
                    )}
                    <div className="h-[1px] bg-white/5 mx-2 my-1" />
                    <button
                      onClick={logoutUser}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/5 transition-colors text-xs uppercase tracking-widest"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 border border-border rounded-full text-[11px] uppercase tracking-widest hover:border-accent text-white transition-all"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-white z-[110]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full h-screen bg-bg flex flex-col items-center justify-center z-[105]"
          >
            <div className="flex flex-col items-center gap-8 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onPointerEnter={() => preloadRoute(link.path)}
                  onFocus={() => preloadRoute(link.path)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileItemStyle}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <button
                  onClick={logoutUser}
                  className={`${mobileItemStyle} px-8 py-3 rounded-full bg-accent text-black`}
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${mobileItemStyle} px-8 py-3 rounded-full bg-accent text-black`}
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};