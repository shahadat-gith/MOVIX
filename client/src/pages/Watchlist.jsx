import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiBookmark, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { getWatchlist, removeFromWatchlist } from "../api/user";
import MovieCard from "../components/movies/MovieCard";
import SectionSkeleton from "../components/common/SectionSkeleton";
import Button from "../components/common/Button";

const WatchlistItem = ({ movie, onRemove }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (removing) return;
    setRemoving(true);
    try {
      await removeFromWatchlist(movie._id);
      toast.success("Removed from watchlist");
      onRemove(movie._id);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove");
      setRemoving(false);
    }
  };

  return (
    <div className="relative group">
      <MovieCard movie={movie} index={0} showWatchlist={false} />
      <button
        onClick={handleRemove}
        disabled={removing}
        className={`
          absolute top-2 right-2 z-10 p-2 rounded-lg
          bg-black/70 backdrop-blur-sm text-white/80
          hover:bg-danger hover:text-white
          transition-all duration-200
          opacity-0 group-hover:opacity-100
          ${removing ? "opacity-50 cursor-not-allowed" : ""}
        `}
        title="Remove from watchlist"
      >
        {removing ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <FiTrash2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

const Watchlist = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWatchlist = useCallback(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getWatchlist()
      .then((res) => {
        setMovies(res.movies || []);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err.message);
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const handleRemove = (movieId) => {
    setMovies((prev) => prev.filter((m) => m._id !== movieId));
  };

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
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <FiHeart className="w-6 h-6 text-danger" />
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-text">
              My Watchlist
            </h1>
          </div>
          {movies.length > 0 && (
            <span className="text-sm text-text-muted bg-surface-light px-3 py-1 rounded-full border border-border/30">
              {movies.length} movie{movies.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading ? (
          <SectionSkeleton count={6} />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-danger mb-4">{error}</p>
            <Button variant="ghost" onClick={fetchWatchlist}>
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
            {movies.map((movie) => (
              <WatchlistItem
                key={movie._id}
                movie={movie}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Watchlist;
