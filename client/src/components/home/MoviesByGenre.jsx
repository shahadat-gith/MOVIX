import { useState } from "react";
import { useMoviesByGenre } from "../../hooks/useMovies";
import MovieCard from "../movies/MovieCard";
import { GENRES } from "../../constants";
import SectionSkeleton from "../common/SectionSkeleton";

const MoviesByGenre = () => {
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0]);
  const { data, loading, error } = useMoviesByGenre(selectedGenre);
  const movies = data?.movies || [];

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-background via-surface/10 to-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-text">
            Browse by Genre
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Explore movies by your favorite genres
          </p>
        </div>

        {/* Genre Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                ${
                  selectedGenre === genre
                    ? "bg-primary text-white border-primary shadow-glow-primary"
                    : "bg-surface-light text-text-muted border-border/30 hover:text-text hover:border-primary/30 hover:bg-surface"
                }
              `}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Movies Grid */}
        {loading ? (
          <SectionSkeleton count={6} />
        ) : error ? (
          <div className="text-center py-12 text-danger">{error}</div>
        ) : movies.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            No movies found for &quot;{selectedGenre}&quot;
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {movies.slice(0, 12).map((movie, i) => (
              <MovieCard key={movie._id} movie={movie} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MoviesByGenre;
