import { FiArrowLeft, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import MovieCard from "../movies/MovieCard";
import SectionSkeleton from "../common/SectionSkeleton";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const SearchResults = ({
  loading,
  error,
  movies,
  searched,
  searchType,
  query,
  onBack,
}) => {
  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-text-muted">
            {searchType === "ai"
              ? "AI is searching for matches..."
              : "Searching..."}
          </span>
        </div>
        <SectionSkeleton count={12} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-6">
          <FiSearch className="w-8 h-8 text-danger" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-text">
          Something went wrong
        </h3>
        <p className="text-text-muted mb-6">{error}</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-surface border border-border/40 text-text hover:border-primary/40 transition-all"
        >
          <FiArrowLeft className="w-4 h-4" />
          Try a new search
        </button>
      </div>
    );
  }

  if (!searched) {
    return null;
  }

  if (!movies.length) {
    return (
      <div className="py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-surface-light flex items-center justify-center mx-auto mb-6">
          <FiSearch className="w-8 h-8 text-text-muted" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-text">
          No movies found
        </h3>
        <p className="text-text-muted mb-2">
          {searchType === "ai"
            ? "Try a different description or be more specific."
            : "No movies match your search. Try different keywords."}
        </p>
        {query && (
          <p className="text-sm text-text-muted/60 mb-6">
            Searched for: &quot;{query}&quot;
          </p>
        )}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-surface border border-border/40 text-text hover:border-primary/40 transition-all"
        >
          <FiArrowLeft className="w-4 h-4" />
          New search
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-surface border border-border/40 text-text-muted hover:text-text hover:border-primary/40 transition-all"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text">
              {searchType === "ai" ? "AI Recommendations" : "Search Results"}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Found {movies.length} movie{movies.length !== 1 ? "s" : ""}
              {query && (
                <>
                  {" "}for &quot;{query}&quot;
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {movies.map((movie, index) => (
          <motion.div key={movie._id} variants={item}>
            <MovieCard movie={movie} index={index} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SearchResults;