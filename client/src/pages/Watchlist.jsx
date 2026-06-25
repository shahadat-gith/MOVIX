import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiBookmark } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import { getWatchlist } from "../api/user";
import MovieCard from "../components/movies/MovieCard";
import SectionSkeleton from "../components/common/SectionSkeleton";
import Button from "../components/common/Button";

const Watchlist = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    getWatchlist()
      .then((res) => {
        setMovies(res.movies || res.watchlist || []);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err.message);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-24 pb-16 flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-surface-light flex items-center justify-center mx-auto mb-6">
            <FiBookmark className="w-8 h-8 text-text-muted" />
          </div>
          <h2 className="text-2xl font-bold font-display text-text mb-2">
            Sign in to view your watchlist
          </h2>
          <p className="text-text-muted mb-6">
            Save movies you want to watch later and never lose track.
          </p>
          <Link to="/auth?mode=login">
            <Button>Sign In</Button>
          </Link>
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
        <div className="flex items-center gap-3 mb-8">
          <FiHeart className="w-6 h-6 text-danger" />
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text">
            My Watchlist
          </h1>
        </div>

        {loading ? (
          <SectionSkeleton count={6} />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-danger mb-4">{error}</p>
            <Button variant="ghost" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-surface-light flex items-center justify-center mx-auto mb-6">
              <FiBookmark className="w-8 h-8 text-text-muted" />
            </div>
            <h2 className="text-xl font-semibold text-text mb-2">
              Your watchlist is empty
            </h2>
            <p className="text-text-muted mb-6">
              Start adding movies you want to watch later.
            </p>
            <Link to="/movies">
              <Button>Browse Movies</Button>
            </Link>
          </div>
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

export default Watchlist;
