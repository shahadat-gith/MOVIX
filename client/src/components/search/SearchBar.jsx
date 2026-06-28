import { useState } from "react";
import { FiLoader, FiSearch, FiX } from "react-icons/fi";

const examples = {
  ai: [
    "A mind-bending sci-fi movie with time travel",
    "Feel-good romantic comedy for a cozy night",
    "Dark psychological thriller like Fight Club",
    "Inspiring underdog sports story",
    "Visually stunning animated adventure",
  ],
};

const SearchBar = ({ query, setQuery, searchType, loading, onSearch }) => {
  const [showExamples, setShowExamples] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    onSearch();
  };

  const handleExampleClick = (example) => {
    setQuery(example);
    setShowExamples(false);
    // Pass the query directly to avoid stale state
    onSearch(null, example);
  };

  const placeholder =
    searchType === "ai"
      ? 'Try "mind-bending sci-fi" or "feel-good comedy"...'
      : "Search movies by title...";

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative max-w-3xl mx-auto">
        {/* Search icon */}
        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/60" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-14 rounded-2xl bg-surface border border-border/40 pl-14 pr-36 text-text placeholder:text-text-muted/40 outline-none transition-all duration-200 focus:border-primary/60 focus:ring-2 focus:ring-primary/10 focus:shadow-glow-primary"
        />

        {/* Clear button */}
        {query && !loading && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-28 top-1/2 -translate-y-1/2 p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-light/50 transition-all"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="absolute right-2 top-2 bottom-2 flex items-center gap-2 px-5 rounded-xl bg-primary text-white font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FiLoader className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Searching...</span>
            </>
          ) : (
            <>
              <FiSearch className="w-4 h-4" />
             
            </>
          )}
        </button>
      </div>

      {/* AI suggestions */}
      {searchType === "ai" && !query && (
        <div className="mt-4 max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="text-sm text-text-muted hover:text-primary-light transition-colors"
          >
            {showExamples
              ? "Hide suggestions"
              : "💡 Need inspiration? Try these..."}
          </button>

          {showExamples && (
            <div className="mt-3 flex flex-wrap gap-2">
              {examples.ai.map((example, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  className="px-4 py-2 rounded-xl bg-surface border border-border/30 text-sm text-text-muted hover:text-text hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  {example}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
