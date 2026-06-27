import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { POSTER_BASE } from "../../constants/index";
import { formatVoteAverage } from "../../utils/formatter";
import { FiStar, FiClock, FiHeart } from "react-icons/fi";
import useWatchlist from "../../hooks/useWatchlist";
import useAuth from "../../hooks/useAuth";

const WatchlistButton = ({ movieId }) => {
  const { user } = useAuth();
  const { inWatchlist, loading, toggleWatchlist } = useWatchlist(movieId);

  if (!user) return null;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlist();
      }}
      disabled={loading}
      className={`
        absolute bottom-2 right-2 z-10 p-2 rounded-lg backdrop-blur-sm
        transition-all duration-200
        ${inWatchlist
          ? "bg-danger/90 text-white shadow-lg shadow-danger/30"
          : "bg-black/60 text-white/80 hover:text-danger hover:bg-black/80 opacity-0 group-hover:opacity-100"
        }
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
      title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <FiHeart
          className={`w-4 h-4 transition-transform duration-200 ${inWatchlist ? "fill-current scale-110" : ""}`}
        />
      )}
    </button>
  );
};

const MovieCard = ({ movie, index = 0, showWatchlist = true }) => {
  const posterUrl = movie.posterPath
    ? `${POSTER_BASE}${movie.posterPath}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/movie/${movie._id}`}
        className="group block relative"
      >
        {/* Card Container */}
        <div className="relative rounded-xl overflow-hidden bg-surface border border-border/50 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:-translate-y-1">
          {/* Poster Image */}
          <div className="relative aspect-[2/3] overflow-hidden">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-light">
                <span className="text-text-muted text-sm">No Poster</span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Rating Badge */}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
              <FiStar className="w-3.5 h-3.5 text-accent fill-accent" />
              <span className="text-xs font-semibold text-white">
                {formatVoteAverage(movie.voteAverage)}
              </span>
            </div>

            {/* Year */}
            {movie.year && (
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-xs font-medium text-text-muted">
                  {movie.year}
                </span>
              </div>
            )}

            {/* Watchlist Button */}
            {showWatchlist && <WatchlistButton movieId={movie._id} />}

            {/* Hover Info Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-lg backdrop-blur-sm">
                View Details
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="p-3 space-y-1.5">
            <h3 className="text-sm font-semibold text-text truncate group-hover:text-primary-light transition-colors duration-200">
              {movie.title}
            </h3>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {movie.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-light text-text-muted border border-border/30"
                  >
                    {genre}
                  </span>
                ))}
                {movie.genres.length > 2 && (
                  <span className="text-[10px] text-text-muted">
                    +{movie.genres.length - 2}
                  </span>
                )}
              </div>
            )}

            {movie.runtime && (
              <div className="flex items-center gap-1 text-text-muted">
                <FiClock className="w-3 h-3" />
                <span className="text-[11px]">{movie.runtime} min</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
