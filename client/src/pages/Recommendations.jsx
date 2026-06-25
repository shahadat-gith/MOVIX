import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiTrendingUp,
  FiAlertCircle,
  FiArrowRight,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import useAuth from "../hooks/useAuth";
import { getRecommendations } from "../api/user";
import MovieCard from "../components/movies/MovieCard";
import SectionSkeleton from "../components/common/SectionSkeleton";
import Button from "../components/common/Button";

const Recommendations = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getRecommendations();
        setMovies(data.movies || []);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err.message ||
          "Failed to load recommendations";

        if (err?.response?.status === 400) {
          setError("Please set your preferences first to get recommendations.");
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-secondary/20 animate-pulse" />
            <div className="h-8 w-64 bg-surface-light rounded-lg animate-pulse" />
          </div>
          <SectionSkeleton count={6} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-24 pb-16 flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-surface-light flex items-center justify-center mx-auto mb-6">
            <FiHeart className="w-8 h-8 text-text-muted" />
          </div>
          <h2 className="text-2xl font-bold font-display text-text mb-2">
            Sign in for recommendations
          </h2>
          <p className="text-text-muted mb-6">
            Get AI-powered movie recommendations based on your taste.
          </p>
          <Link to="/auth?mode=login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-24 pb-16 flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-8 h-8 text-danger" />
          </div>
          <h2 className="text-2xl font-bold font-display text-text mb-2">
            {error === "Please set your preferences first to get recommendations."
              ? "Preferences Needed"
              : "Something went wrong"}
          </h2>
          <p className="text-text-muted mb-6">{error}</p>
          {error === "Please set your preferences first to get recommendations." ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth?mode=register">
                <Button variant="outline">Update Preferences</Button>
              </Link>
              <Link to="/movies">
                <Button>Browse Movies</Button>
              </Link>
            </div>
          ) : (
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 pb-16"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary-light text-sm">
              <HiOutlineSparkles className="w-4 h-4" />
              <span>AI Powered</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text flex items-center gap-3">
            <FiTrendingUp className="w-7 h-7 text-secondary" />
            Recommended For You
          </h1>
          <p className="text-text-muted mt-2 max-w-2xl">
            Based on your preferences, our AI has curated these movies just for
            you.
          </p>
        </motion.div>

        {/* Results */}
        {movies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-surface-light flex items-center justify-center mx-auto mb-6">
              <FiHeart className="w-8 h-8 text-text-muted" />
            </div>
            <h2 className="text-xl font-semibold text-text mb-2">
              No recommendations yet
            </h2>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              Update your preferences and explore more movies to get better
              recommendations.
            </p>
            <Link to="/movies">
              <Button>
                Browse Movies
                <FiArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {movies.map((movie, i) => (
              <MovieCard key={movie.tmdbId} movie={movie} index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Recommendations;
