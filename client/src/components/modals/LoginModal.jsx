import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import Button from "../common/Button";
import Input from "../common/Input";

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const modalRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      toast.success("Welcome back!");
      onClose();
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Close modal if user clicks outside the modal card
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container Card */}
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card md:p-8"
          >
            {/* Close Button Icon */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 text-text-muted hover:text-text rounded-lg p-1 transition-colors hover:bg-surface-light"
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-2xl font-bold font-display text-text">Sign In</h2>
                <p className="text-sm text-text-muted mt-1">Welcome back to MOVIX</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-xl"
                >
                  {error}
                </motion.div>
              )}

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                icon={<FiMail className="w-4 h-4" />}
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  icon={<FiLock className="w-4 h-4" />}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-text-muted hover:text-text transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <Button type="submit" className="w-full" loading={loading}>
                Sign In
              </Button>

              <p className="text-sm text-text-muted text-center">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-primary-light hover:text-primary transition-colors font-medium"
                >
                  Register 
                </button>
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;