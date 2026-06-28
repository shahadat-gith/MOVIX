import { motion } from "framer-motion";

const SearchModeToggle = ({ searchType, setSearchType }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="inline-flex rounded-2xl bg-surface border border-border/40 p-1">
        <button
          type="button"
          onClick={() => setSearchType("title")}
          className="relative px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          {searchType === "title" && (
            <motion.div
              layoutId="search-mode"
              className="absolute inset-0 rounded-xl bg-primary"
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 35,
              }}
            />
          )}

          <span
            className={`relative z-10 ${
              searchType === "title" ? "text-white" : "text-text-muted"
            }`}
          >
            Search by Title
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSearchType("ai")}
          className="relative px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          {searchType === "ai" && (
            <motion.div
              layoutId="search-mode"
              className="absolute inset-0 rounded-xl bg-primary"
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 35,
              }}
            />
          )}

          <span
            className={`relative z-10 ${
              searchType === "ai" ? "text-white" : "text-text-muted"
            }`}
          >
            AI Search
          </span>
        </button>
      </div>
    </div>
  );
};

export default SearchModeToggle;
