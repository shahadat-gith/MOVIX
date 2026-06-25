import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10 px-4"
      >
        <h1 className="text-8xl sm:text-9xl font-bold font-display text-text mb-2">
          4
          <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
            0
          </span>
          4
        </h1>
        <p className="text-xl sm:text-2xl font-semibold text-text mb-3">
          Page Not Found
        </p>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-all duration-200"
        >
          <FiHome className="w-4 h-4" />
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
