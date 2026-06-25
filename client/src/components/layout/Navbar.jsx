import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiSearch, FiLogOut, FiHeart } from "react-icons/fi";
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${
          scrolled
            ? "bg-background/85 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }
      `}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="MOVIX"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="font-display text-xl font-bold">
                MOVIX
              </h1>

              <p className="text-xs text-text-muted -mt-1">
                AI Movie Discovery
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  text-sm font-medium
                  transition-colors duration-200
                  relative py-1
                  ${
                    isActive(link.to)
                      ? "text-primary-light"
                      : "text-text-muted hover:text-text"
                  }
                `}
              >
                {link.label}

                {isActive(link.to) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}

          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/search")}
              className="
                p-2 rounded-lg
                text-text-muted
                hover:text-text
                hover:bg-surface-light
                transition-all
              "
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/watchlist">
                  <button
                    className={`
                      p-2 rounded-lg transition-all
                      ${isActive("/watchlist") ? "text-danger" : "text-text-muted hover:text-text hover:bg-surface-light"}
                    `}
                  >
                    <FiHeart className="w-5 h-5" />
                  </button>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-surface-light transition-all"
                  title="Sign Out"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Button size="sm" onClick={() => setShowLogin(true)}>
                Sign In
              </Button>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="
              md:hidden
              p-2 rounded-lg
              text-text-muted
              hover:text-text
              hover:bg-surface-light
              transition-all
            "
          >
            {mobileOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="
              md:hidden
              border-t border-border
              bg-background/95
              backdrop-blur-xl
            "
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    block px-4 py-2.5 rounded-lg
                    text-sm font-medium
                    transition-all
                    ${
                      isActive(link.to)
                        ? "bg-primary/10 text-primary-light"
                        : "text-text-muted hover:text-text hover:bg-surface-light"
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}

              {user && (
                <>
                  <Link
                    to="/recommended"
                    className={`
                      px-4 py-2.5 rounded-lg
                      text-sm font-medium
                      transition-all
                      flex items-center gap-2
                      ${
                        isActive("/recommended")
                          ? "bg-secondary/10 text-secondary-light"
                          : "text-text-muted hover:text-text hover:bg-surface-light"
                      }
                    `}
                  >
                    <FiHeart className="w-4 h-4" />
                    Recommended For You
                  </Link>

                  <Link
                    to="/watchlist"
                    className={`
                      block px-4 py-2.5 rounded-lg
                      text-sm font-medium
                      transition-all
                      ${
                        isActive("/watchlist")
                          ? "bg-primary/10 text-primary-light"
                          : "text-text-muted hover:text-text hover:bg-surface-light"
                      }
                    `}
                  >
                    Watchlist
                  </Link>

                  <hr className="border-border" />

                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="
                      block w-full text-left px-4 py-2.5 rounded-lg
                      text-sm font-medium
                      text-text-muted hover:text-danger hover:bg-surface-light
                      transition-all
                    "
                  >
                    Sign Out
                  </button>
                </>
              )}

              {!user && (
                <div className="px-4">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setMobileOpen(false);
                      setShowLogin(true);
                    }}
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </nav>
  );
};

export default Navbar;