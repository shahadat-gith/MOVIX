import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX, FiType } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import useRecommendations from "../hooks/useRecommendations";
import useDebounce from "../hooks/useDebounce";
import { searchMoviesByTitle } from "../api/movie";
import MovieCard from "../components/movies/MovieCard";
import SectionSkeleton from "../components/common/SectionSkeleton";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialType = searchParams.get("type") || "ai";
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);
  const debouncedQuery = useDebounce(query, 600);

  // AI search results
  const {
    movies: aiMovies,
    loading: aiLoading,
    error: aiError,
  } = useRecommendations(searchType === "ai" ? debouncedQuery : "");

  // Name search results
  const [nameMovies, setNameMovies] = useState([]);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState(null);

  useEffect(() => {
    if (searchType !== "name" || !debouncedQuery || debouncedQuery.trim().length < 1) {
      setNameMovies([]);
      setNameLoading(false);
      setNameError(null);
      return;
    }

    let mounted = true;
    setNameLoading(true);
    setNameError(null);

    searchMoviesByTitle(debouncedQuery)
      .then((res) => {
        if (mounted) {
          const responseData = res.data || res;
          setNameMovies(responseData.movies || []);
        }
      })
      .catch((err) => {
        if (mounted) {
          setNameError(
            err?.response?.data?.message || err.message || "Search failed"
          );
        }
      })
      .finally(() => {
        if (mounted) setNameLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [debouncedQuery, searchType]);

  const movies = searchType === "ai" ? aiMovies : nameMovies;
  const loading = searchType === "ai" ? aiLoading : nameLoading;
  const error = searchType === "ai" ? aiError : nameError;

  // Sync URL params
  useEffect(() => {
    const params = {};
    if (debouncedQuery.trim()) params.q = debouncedQuery.trim();
    params.type = searchType;
    setSearchParams(params, { replace: true });
  }, [debouncedQuery, searchType, setSearchParams]);

  const handleClear = () => {
    setQuery("");
    setSearchParams({}, { replace: true });
  };

  const handleModeSwitch = (type) => {
    setSearchType(type);
    setQuery("");
    setNameMovies([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 pb-16"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm mb-4 ${
              searchType === "ai"
                ? "bg-primary/10 border-primary/20 text-primary-light"
                : "bg-secondary/10 border-secondary/20 text-secondary-light"
            }`}
          >
            {searchType === "ai" ? (
              <HiOutlineSparkles className="w-4 h-4" />
            ) : (
              <FiType className="w-4 h-4" />
            )}
            <span>
              {searchType === "ai" ? "AI Semantic Search" : "Search by Name"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text mb-2">
            {searchType === "ai" ? "Find Your Next Movie" : "Search Movies"}
          </h1>
          <p className="text-text-muted max-w-xl mx-auto">
            {searchType === "ai"
              ? "Describe what you want to watch in natural language. Our AI understands your taste."
              : "Type a movie title to search by name."}
          </p>
        </div>

        {/* Search Mode Toggle */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => handleModeSwitch("ai")}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                searchType === "ai"
                  ? "bg-primary text-white shadow-glow-primary"
                  : "bg-surface-light/50 text-text-muted hover:text-text border border-border/30"
              }
            `}
          >
            <HiOutlineSparkles className="w-4 h-4 inline-block mr-1.5" />
            AI Search
          </button>
          <button
            onClick={() => handleModeSwitch("name")}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                searchType === "name"
                  ? "bg-secondary text-white shadow-glow-secondary"
                  : "bg-surface-light/50 text-text-muted hover:text-text border border-border/30"
              }
            `}
          >
 
           Search By Name
          </button>
        </div>

        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                searchType === "ai"
                  ? 'Try "mind bending sci fi" or "feel good romantic comedies"...'
                  : "Search for a movie by its title..."
              }
              className="w-full bg-surface border border-border/50 rounded-2xl py-4 pl-12 pr-12 text-text placeholder-text-muted/40 text-base outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              autoFocus
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {!debouncedQuery ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-surface-light flex items-center justify-center mx-auto mb-6">
                <FiSearch className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">
                {searchType === "ai"
                  ? "Describe what you&apos;re looking for"
                  : "Search for a movie by its title"}
              </h3>
              <p className="text-text-muted max-w-md mx-auto">
                {searchType === "ai"
                  ? "Type a description of the movie you want to watch and our AI will find the best matches."
                  : "Type a movie name above and we'll find it for you."}
              </p>
            </motion.div>
          ) : loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-text-muted text-sm">
                  {searchType === "ai"
                    ? "Searching with AI..."
                    : "Searching..."}
                </span>
              </div>
              <SectionSkeleton count={6} />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
                <FiX className="w-6 h-6 text-danger" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">
                Something went wrong
              </h3>
              <p className="text-text-muted">{error}</p>
            </motion.div>
          ) : movies.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <h3 className="text-xl font-semibold text-text mb-2">
                No movies found
              </h3>
              <p className="text-text-muted">
                {searchType === "ai"
                  ? "Try a different description or be more specific."
                  : "Try a different search term."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-text-muted">
                  Found {movies.length} movie{movies.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {movies.map((movie, i) => (
                  <MovieCard key={movie.tmdbId} movie={movie} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Search;
