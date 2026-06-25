import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useMovies } from "../hooks/useMovies";
import { GENRES } from "../constants";
import MovieCard from "../components/movies/MovieCard";
import SectionSkeleton from "../components/common/SectionSkeleton";

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const genreParam = searchParams.get("genre");
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [selectedGenre, setSelectedGenre] = useState(genreParam || null);
  const [page, setPage] = useState(pageParam);
  const { data, loading, error } = useMovies(page, 20);
  const movies = data?.movies || [];
  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    const params = {};
    if (selectedGenre) params.genre = selectedGenre;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [selectedGenre, page, setSearchParams]);

  useEffect(() => {
    if (genreParam) setSelectedGenre(genreParam);
  }, [genreParam]);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre === selectedGenre ? null : genre);
    setPage(1);
  };

  // Filter by genre client-side if genre is selected
  const filteredMovies = selectedGenre
    ? movies.filter((m) => m.genres?.includes(selectedGenre))
    : movies;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 pb-16"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text mb-2">
            Browse Movies
          </h1>
          <p className="text-text-muted">
            Explore our collection of movies
          </p>
        </div>

        {/* Genre Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => handleGenreClick(null)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
              ${
                !selectedGenre
                  ? "bg-primary text-white border-primary shadow-glow-primary"
                  : "bg-surface-light text-text-muted border-border/30 hover:text-text hover:border-primary/30"
              }
            `}
          >
            All
          </button>
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                ${
                  selectedGenre === genre
                    ? "bg-primary text-white border-primary shadow-glow-primary"
                    : "bg-surface-light text-text-muted border-border/30 hover:text-text hover:border-primary/30"
                }
              `}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Movies Grid */}
        {loading ? (
          <SectionSkeleton count={10} />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-danger">{error}</p>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-text mb-2">
              No movies found
            </h3>
            <p className="text-text-muted">
              {selectedGenre
                ? `No movies found for "${selectedGenre}"`
                : "No movies available"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {filteredMovies.map((movie, i) => (
                <MovieCard key={movie.tmdbId} movie={movie} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-surface border border-border/30 text-text-muted hover:text-text hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronLeft className="w-4 h-4" />
                  <span className="text-sm">Previous</span>
                </button>

                <span className="text-sm text-text-muted">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-surface border border-border/30 text-text-muted hover:text-text hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <span className="text-sm">Next</span>
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Movies;
