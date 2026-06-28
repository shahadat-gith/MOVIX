import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { aiSearch, searchMoviesByTitle, getSearchHistory } from "../api/movie";

import SearchBar from "../components/search/SearchBar";
import SearchModeToggle from "../components/search/SearchModeToggle";
import SearchHistory from "../components/search/SearchHistory";
import SearchResults from "../components/search/SearchResults";

import {
  getLocalSearchHistory,
  saveLocalSearch,
} from "../utils/searchHistory";

const Search = () => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("ai");

  const [movies, setMovies] = useState([]);
  const [history, setHistory] = useState([]);

  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    try {
      const res = await getSearchHistory(15);
      setHistory(res.history || []);
    } catch {
      // Fallback to localStorage
      setHistory(getLocalSearchHistory());
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleSearch = async (historyItem = null, overrideQuery = null) => {
    const searchQuery =
      overrideQuery || (historyItem ? historyItem.query : query);
    const type = historyItem ? historyItem.type : searchType;

    if (!searchQuery.trim() || loading) return;

    if (historyItem || overrideQuery) {
      setQuery(searchQuery);
      if (historyItem) setSearchType(type);
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      let res;

      if (type === "ai") {
        res = await aiSearch(searchQuery);
      } else {
        res = await searchMoviesByTitle(searchQuery);
      }

      setMovies(res.movies || []);

      // Update history after search
      saveLocalSearch(searchQuery, type);
      loadHistory();
    } catch (error) {
      console.error(error);
      setMovies([]);
      setError(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-24 pb-16"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              {searchType === "ai" ? "AI-Powered Discovery" : "Title Search"}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold font-display text-text mb-3"
          >
            {searchType === "ai"
              ? "Find Your Next Favorite Movie"
              : "Search Movies"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-text-muted max-w-2xl mx-auto text-lg"
          >
            {searchType === "ai"
              ? "Describe what you want to watch in natural language — our AI understands your taste."
              : "Search through thousands of movies instantly by title."}
          </motion.p>
        </div>

        {/* Search Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <SearchModeToggle
            searchType={searchType}
            setSearchType={(type) => {
              setSearchType(type);
              setSearched(false);
              setMovies([]);
              setError("");
            }}
          />
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <SearchBar
            query={query}
            setQuery={setQuery}
            searchType={searchType}
            loading={loading}
            onSearch={handleSearch}
          />
        </motion.div>

        {/* Search History & Trending */}
        <AnimatePresence mode="wait">
          {!searched && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SearchHistory
                history={history}
                setHistory={setHistory}
                onSearch={handleSearch}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {searched && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SearchResults
                loading={loading}
                error={error}
                movies={movies}
                searched={searched}
                searchType={searchType}
                query={query}
                onBack={() => {
                  setSearched(false);
                  setMovies([]);
                  setError("");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Search;
