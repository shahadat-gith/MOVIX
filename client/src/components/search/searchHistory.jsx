import { useEffect, useState } from "react";
import { FiClock, FiSearch, FiTrash2, FiTrendingUp, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

import {
  getTrendingSearches,
  deleteSearchHistoryItem,
  clearAllSearchHistory,
} from "../../api/movie";

import { removeLocalSearch } from "../../utils/searchHistory";

/* ─────────── Trending item chip ─────────── */
const TrendingItem = ({ item, index, onClick }) => (
  <button
    onClick={() => onClick(item)}
    className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/40 bg-surface hover:border-primary/40 hover:bg-primary/5 transition-all"
  >
    <span className="text-xs font-bold text-primary-light/60 w-5 text-right shrink-0">
      #{index + 1}
    </span>
    <FiSearch className="w-4 h-4 text-text-muted shrink-0" />
    <span className="text-sm text-text">{item.query}</span>
    {item.count > 1 && (
      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary-light shrink-0">
        {item.count}
      </span>
    )}
  </button>
);

/* ─────────── History item chip ─────────── */
const HistoryItem = ({ item, onClick, onRemove }) => (
  <div className="group flex items-center overflow-hidden rounded-xl border border-border/40 bg-surface hover:border-primary/40 transition-all">
    <button
      onClick={() => onClick(item)}
      className="flex items-center gap-2 px-4 py-2.5"
    >
      <FiSearch className="w-4 h-4 text-text-muted shrink-0" />
      <span className="text-sm text-text">{item.query}</span>
      <span
        className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
          item.type === "ai"
            ? "bg-primary/20 text-primary-light"
            : "bg-secondary/20 text-secondary-light"
        }`}
      >
        {item.type === "ai" ? "AI" : "Title"}
      </span>
    </button>
    <button
      onClick={() => onRemove(item)}
      className="border-l border-border/40 px-3 py-2.5 text-text-muted hover:text-danger transition-colors"
    >
      <FiX className="w-4 h-4" />
    </button>
  </div>
);

/* ─────────── Main component ─────────── */
const SearchHistory = ({ history, setHistory, onSearch }) => {
  const [trending, setTrending] = useState([]);
  const [activeTab, setActiveTab] = useState("recent");

  useEffect(() => {
    getTrendingSearches(8)
      .then((res) => setTrending(res.trending || []))
      .catch(() => {});
  }, []);

  const trendingItems = trending.filter((t) => t.type === "title");
  const hasTrending = trendingItems.length > 0;
  const hasHistory = history.length > 0;

  if (!hasTrending && !hasHistory) return null;

  /* Handlers */
  const handleTrendingClick = (item) => {
    // Trending items are always title searches — pass as a historyItem-like object
    // so handleSearch uses "title" mode for the search
    onSearch({ query: item.query, type: "title" }, item.query);
  };

  const handleHistoryClick = (item) => {
    onSearch(item, item.query);
  };

  const handleRemove = async (item) => {
    try {
      if (item._id) {
        await deleteSearchHistoryItem(item._id);
      } else {
        setHistory(removeLocalSearch(item.query, item.type));
        return; // local state already updated above
      }
      setHistory((prev) => prev.filter((h) => h._id !== item._id));
      toast.success("Removed");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const handleClear = async () => {
    try {
      await clearAllSearchHistory();
      setHistory([]);
      toast.success("Search history cleared");
    } catch {
      toast.error("Failed to clear history");
    }
  };

  return (
    <div className="mb-10 max-w-4xl mx-auto">
      {/* Tabs */}
      {hasTrending && hasHistory && (
        <div className="flex items-center gap-1 mb-6">
          <button
            onClick={() => setActiveTab("trending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "trending"
                ? "bg-primary/10 text-primary-light border border-primary/20"
                : "text-text-muted hover:text-text border border-transparent"
            }`}
          >
            <FiTrendingUp className="w-4 h-4 inline mr-1.5" />
            Trending
          </button>
          <button
            onClick={() => setActiveTab("recent")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "recent"
                ? "bg-primary/10 text-primary-light border border-primary/20"
                : "text-text-muted hover:text-text border border-transparent"
            }`}
          >
            <FiClock className="w-4 h-4 inline mr-1.5" />
            Recent
          </button>
        </div>
      )}

      {/* Trending */}
      {(activeTab === "trending" || (!hasHistory && hasTrending)) && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="w-5 h-5 text-primary-light" />
            <h2 className="text-lg font-semibold text-text">Trending Searches</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {trendingItems.map((item, i) => (
              <TrendingItem key={item._id || i} item={item} index={i} onClick={handleTrendingClick} />
            ))}
          </div>
        </section>
      )}

      {/* Recent */}
      {(activeTab === "recent" || (!hasTrending && hasHistory)) && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiClock className="w-5 h-5 text-primary-light" />
              <h2 className="text-lg font-semibold text-text">Recent Searches</h2>
            </div>
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-sm text-danger hover:text-red-400 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {history.map((item, i) => (
              <HistoryItem key={item._id || i} item={item} onClick={handleHistoryClick} onRemove={handleRemove} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchHistory;
