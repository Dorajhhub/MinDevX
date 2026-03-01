import React, {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

interface NavbarProps {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
  isSeasonal: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ theme, setTheme, isSeasonal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, [setTheme]);

  const navLinks = [
    { name: "홈", path: "/" },
    { name: "로그인", path: "/login" },
    { name: "회원가입", path: "/signup" },
    { name: "계정", path: "/account" },
  ];

  // Close mobile menu on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-md border-b border-slate-200/50 dark:border-slate-800/50"
          : "bg-transparent"
      }`}
      aria-label="Main navigation"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 gap-3">
            <NavLink
              to="/"
              className="flex items-center gap-3 rounded group focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Home"
            >
              <div className="flex items-center justify-center w-10 h-10 text-xl transition-transform duration-300 shadow-lg rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:scale-110 group-hover:rotate-12">
                🎮
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-800 dark:text-white">
                MinDevX
              </span>
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="items-center hidden space-x-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 relative group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`
                }
                aria-current={
                  location.pathname === link.path ? "page" : undefined
                }
              >
                {link.name}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-1/2 group-hover:left-1/2"></span>
                <span className="absolute bottom-0 right-1/2 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-1/2 group-hover:right-1/2"></span>
              </NavLink>
            ))}

            <div className="w-px h-5 mx-2 bg-slate-200 dark:bg-slate-700"></div>

            <button
              onClick={toggleTheme}
              disabled={isSeasonal}
              className="p-2 text-slate-500 transition-all duration-300 rounded-full hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:rotate-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950"
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              {theme === "light" ? (
                <MoonIcon className="w-6 h-6" />
              ) : (
                <SunIcon className="w-6 h-6 text-yellow-400" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleTheme}
              disabled={isSeasonal}
              className="p-2 text-slate-500 transition-colors rounded-full hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              {theme === "light" ? (
                <MoonIcon className="w-6 h-6" />
              ) : (
                <SunIcon className="w-6 h-6 text-yellow-400" />
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-slate-600 transition-colors rounded-lg dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-7 h-7" />
              ) : (
                <Bars3Icon className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300 md:hidden bg-black/50 backdrop-blur-sm"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        ></div>
      )}
      <div
        className={`md:hidden fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 ease-in-out transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-modal={isMobileMenuOpen}
        role="dialog"
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-slate-600 rounded-lg dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Close menu"
            >
              <XMarkIcon className="w-7 h-7" />
            </button>
          </div>
          <div className="flex-1 px-4 pt-4 pb-8 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-4 rounded-xl text-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`
                }
                onClick={toggleMobileMenu}
                aria-current={
                  location.pathname === link.path ? "page" : undefined
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;