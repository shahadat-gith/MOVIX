import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiSearch, FiLogOut, FiHeart, FiUser, FiSettings } from "react-icons/fi";
import Button from "../common/Button";
import useAuth from "../../hooks/useAuth";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/movies", label: "Movies" },
  { to: "/recomended", label: "Recomended Movies" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border" : "bg-transparent"}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="MOVIX" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">MOVIX</h1>
              <p className="text-xs text-text-muted -mt-1">AI Movie Discovery</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={`text-sm font-medium transition-colors duration-200 relative py-1 ${isActive(link.to) ? "text-primary-light" : "text-text-muted hover:text-text"}`}>
                {link.label}
                {isActive(link.to) && <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />}
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => navigate("/search")} className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-light transition-all">
              <FiSearch className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 transition-transform active:scale-95 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-text font-medium text-sm border border-border/20">
                    {user.avatar ? <img src={user.avatar.url || "/user.png"} alt={user.name} className="w-full h-full rounded-full object-cover" /> : <FiUser className="w-4 h-4 text-text-muted" />}
                  </div>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-2 w-56 bg-surface border border-border/80 rounded-xl shadow-card backdrop-blur-xl p-1.5 z-50 origin-top-right">
                      <div className="px-3 py-2.5 border-b border-border/50 mb-1">
                        <p className="text-sm font-semibold text-text truncate">{user.name || "User Profile"}</p>
                        <p className="text-xs text-text-muted truncate mt-0.5">{user.email || "user@movix.com"}</p>
                      </div>
                      <div className="md:hidden border-b border-border/50 pb-1 mb-1">
                        {navLinks.map((link) => (
                          <Link key={link.to} to={link.to} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${isActive(link.to) ? "bg-primary/10 text-primary-light" : "text-text-muted hover:text-text hover:bg-surface-light"}`}>
                            {link.label}
                          </Link>
                        ))}
                      </div>
                      <Link to="/watchlist" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive("/watchlist") ? "bg-primary/10 text-primary-light" : "text-text-muted hover:text-text hover:bg-surface-light"}`}>
                        <FiHeart className="w-4 h-4" /> Watchlist
                      </Link>
                      <Link to="/settings" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive("/settings") ? "bg-surface-light text-text" : "text-text-muted hover:text-text hover:bg-surface-light"}`}>
                        <FiSettings className="w-4 h-4" /> Settings
                      </Link>
                      <hr className="border-border/50 my-1" />
                      <button onClick={() => { logout(); navigate("/"); }} className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-danger hover:bg-surface-light transition-all text-left">
                        <FiLogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <div className="hidden md:block">
                  <Button size="sm" onClick={() => setShowLogin(true)}>Sign In</Button>
                </div>
                <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-light transition-all">
                  {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu for Unauthenticated Users Only */}
      <AnimatePresence>
        {mobileOpen && !user && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(link.to) ? "bg-primary/10 text-primary-light" : "text-text-muted hover:text-text hover:bg-surface-light"}`}>
                  {link.label}
                </Link>
              ))}
              <div className="px-4 pt-1">
                <Button className="w-full" onClick={() => { setMobileOpen(false); setShowLogin(true); }}>Sign In</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} />
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }} />
    </nav>
  );
};

export default Navbar;