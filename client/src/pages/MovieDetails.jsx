import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiStar,
  FiClock,
  FiCalendar,
  FiArrowLeft,
  FiHeart,
} from "react-icons/fi";
import { BACKDROP_BASE, POSTER_BASE } from "../constants";
import { formatRuntime, formatVoteAverage } from "../utils/formatter";
import { useMovieDetails } from "../hooks/useMovies";
import useWatchlist from "../hooks/useWatchlist";
import useAuth from "../hooks/useAuth";
import Badge from "../components/common/Badge";
import Glow from "../components/common/Glow";
import Button from "../components/common/Button";
import SimilarMovies from "../components/movies/SimilarMovies";

const WatchlistAction = ({ movieId }) => {
  const { user } = useAuth();
  const { inWatchlist, loading, checking, toggleWatchlist } =
    useWatchlist(movieId);

  if (!user) return null;
  if (checking) return null;

  return (
    <Button
      variant={inWatchlist ? "danger" : "primary"}
      size="md"
      icon={FiHeart}
      loading={loading}
      onClick={toggleWatchlist}
      className="mb-6"
    >
      {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
    </Button>
  );
};

const MovieDetails = () => {
  const { id } = useParams();
  const { data, loading, error } = useMovieDetails(id);
  const movie = data?.movie || data;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-[50vh] bg-surface-light rounded-2xl" />
            <div className="h-8 bg-surface-light rounded w-1/3" />
            <div className="h-4 bg-surface-light rounded w-2/3" />
            <div className="h-24 bg-surface-light rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text mb-2">Error</h2>
          <p className="text-text-muted mb-4">{error}</p>
          <Link
            to="/"
            className="text-primary-light hover:text-primary transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text mb-2">Movie not found</h2>
          <Link
            to="/"
            className="text-primary-light hover:text-primary transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdropPath
    ? `${BACKDROP_BASE}${movie.backdropPath}`
    : null;
  const posterUrl = movie.posterPath
    ? `${POSTER_BASE}${movie.posterPath}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Backdrop Hero */}
      <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />

        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-24 left-4 sm:left-8 z-10 flex items-center gap-2 px-4 py-2 rounded-xl bg-background/50 backdrop-blur-md border border-border/30 text-text hover:text-primary-light transition-all"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </Link>

        {/* Glow effects */}
        <Glow
          color="primary"
          size="xl"
          className="absolute bottom-0 left-1/4"
        />
        <Glow
          color="secondary"
          size="lg"
          className="absolute top-1/3 right-1/4"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-40 sm:-mt-48 mb-16">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0 w-full md:w-72 lg:w-80"
          >
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-border/30">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-light">
                  <span className="text-text-muted">No Poster</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 pt-0 md:pt-16 lg:pt-20"
          >
            {/* Title & Tagline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-text mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-base sm:text-lg text-primary-light/80 italic mb-4">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {movie.voteAverage && (
                <div className="flex items-center gap-1.5">
                  <FiStar className="w-5 h-5 text-accent fill-accent" />
                  <span className="text-lg font-bold text-text">
                    {formatVoteAverage(movie.voteAverage)}
                  </span>
                  {movie.voteCount && (
                    <span className="text-xs text-text-muted">
                      ({movie.voteCount.toLocaleString()})
                    </span>
                  )}
                </div>
              )}

              {movie.runtime && (
                <div className="flex items-center gap-1.5 text-text-muted">
                  <FiClock className="w-4 h-4" />
                  <span className="text-sm">
                    {formatRuntime(movie.runtime)}
                  </span>
                </div>
              )}

              {movie.year && (
                <div className="flex items-center gap-1.5 text-text-muted">
                  <FiCalendar className="w-4 h-4" />
                  <span className="text-sm">{movie.year}</span>
                </div>
              )}
            </div>

            {/* Watchlist Button */}
            <WatchlistAction movieId={movie._id} />

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <Link key={genre} to={`/movies?genre=${genre}`}>
                    <Badge variant="default">{genre}</Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Overview */}
            {movie.overview && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Overview
                </h3>
                <p className="text-text/90 leading-relaxed text-base">
                  {movie.overview}
                </p>
              </div>
            )}

            {/* Director & Cast */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {movie.director && (
                <div>
                  <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Director
                  </h3>
                  <p className="text-text font-medium">{movie.director}</p>
                </div>
              )}

              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Cast
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.cast.slice(0, 6).map((actor) => (
                      <span
                        key={actor}
                        className="text-xs px-2.5 py-1 rounded-full bg-surface-light text-text-muted border border-border/30"
                      >
                        {actor}
                      </span>
                    ))}
                    {movie.cast.length > 6 && (
                      <span className="text-xs text-text-muted">
                        +{movie.cast.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Keywords */}
            {movie.keywords && movie.keywords.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Keywords
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {movie.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary-light border border-primary/20"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Similar Movies */}

      <SimilarMovies movieId={movie._id || movie.id} />
    </motion.div>
  );
};

export default MovieDetails;
