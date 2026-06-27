import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { GENRES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import Button from "../common/Button";
import Input from "../common/Input";

const INDUSTRIES = [
  "Hollywood",
  "Bollywood",
  "Tollywood",
  "Kollywood",
  "Mollywood",
  "Korean",
  "Japanese",
  "Chinese",
  "European",
  "Anime",
];

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const modalRef = useRef(null);

  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const toggleIndustry = (industry) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        genres: selectedGenres,
        industries: selectedIndustries,
        description,
      });

      toast.success("Account created successfully!");
      onClose();
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Close modal if user clicks outside the modal card container
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container Card */}
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card md:p-8"
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

            {/* Modal Header */}
            <div className="text-center mb-5">
              <h2 className="text-2xl font-bold font-display text-text">
                Create Account
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Join MOVIX and discover movies with AI
              </p>

              {/* Multi-step Visual Indicator */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? "w-6 bg-primary" : "w-2 bg-border"}`} />
                <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? "w-6 bg-secondary" : "w-2 bg-border"}`} />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-xl mb-5"
              >
                {error}
              </motion.div>
            )}

            {step === 1 ? (
              <form onSubmit={handleStep1} className="space-y-4">
                <Input
                  label="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  icon={<FiUser className="w-4 h-4" />}
                  autoComplete="name"
                />

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
                    placeholder="Min. 6 characters"
                    icon={<FiLock className="w-4 h-4" />}
                    autoComplete="new-password"
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

                <Button type="submit" className="w-full">
                  Continue
                </Button>

                <p className="text-sm text-text-muted text-center">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-primary-light hover:text-primary transition-colors font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Favorite Genres
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-1 subtle-scrollbar">
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          selectedGenres.includes(genre)
                            ? "bg-primary/20 border-primary/40 text-primary-light"
                            : "bg-surface-light/50 border-border/30 text-text-muted hover:text-text hover:border-border/50"
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Preferred Industries
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-1 subtle-scrollbar">
                    {INDUSTRIES.map((industry) => (
                      <button
                        key={industry}
                        type="button"
                        onClick={() => toggleIndustry(industry)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          selectedIndustries.includes(industry)
                            ? "bg-secondary/20 border-secondary/40 text-secondary-light"
                            : "bg-surface-light/50 border-border/30 text-text-muted hover:text-text hover:border-border/50"
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Describe Your Taste (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="E.g. I love mind-bending sci-fi with great visuals and emotional depth..."
                    rows={3}
                    className="w-full bg-surface-light/50 border border-border/30 rounded-xl px-4 py-3 text-text placeholder-text-muted/40 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-border/30 text-text-muted hover:text-text hover:bg-surface-light transition-all"
                  >
                    Back
                  </button>
                  <Button type="submit" className="flex-1" loading={loading}>
                    Create Account
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;