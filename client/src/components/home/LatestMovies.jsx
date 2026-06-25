import { useLatestMovies } from "../../hooks/useMovies";
import MovieCard from "../movies/MovieCard";
import SectionSkeleton from "../common/SectionSkeleton";
import { getLatestMovies } from "../../api/movie";

const LatestMovies = () => {
  const { data, loading, error } = useLatestMovies();
  const movies = data?.movies || [];

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-text">
              Latest Releases
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Newest additions to the collection
            </p>
          </div>
        </div>

        {loading ? (
          <SectionSkeleton count={6} />
        ) : error ? (
          <div className="text-center py-12 text-danger">{error}</div>
        ) : movies.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            No latest movies found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {movies.slice(0, 12).map((movie, i) => (
              <MovieCard key={movie.tmdbId} movie={movie} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestMovies;
