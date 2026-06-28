import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { fetchSimilarMovies } from "../../api/movie";

import MovieCard from "./MovieCard";
import SectionSkeleton from "../common/SectionSkeleton";

const SimilarMovies = ({ movieId }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;

    const loadSimilarMovies = async () => {
      setLoading(true);

      try {
        const res = await fetchSimilarMovies(movieId);

        setMovies(res.movies || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSimilarMovies();
  }, [movieId]);

  if (loading) {
    return (
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-text mb-6">
          Similar Movies
        </h2>

        <SectionSkeleton count={6} />
      </section>
    );
  }

  if (!movies.length) {
    return null;
  }

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-text">
              Similar Movies
            </h2>

            <p className="text-text-muted mt-1">Movies you might also enjoy</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {movies.map((movie, index) => (
            <MovieCard key={movie._id} movie={movie} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default SimilarMovies;
