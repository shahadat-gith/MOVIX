import { useEffect, useState } from "react";

import {
  getMovies,
  getMovieById,
  getPopularMovies,
  getTopRatedMovies,
  getLatestMovies,
  getMoviesByGenre,
} from "../api/movie";

const useFetch = (fetchFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError(null);

    fetchFn()
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch((err) => {
        if (mounted) {
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Something went wrong"
          );
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, deps);

  return { data, loading, error };
};



export const useMovies = (page = 1, limit = 20) =>
  useFetch(
    () => getMovies(page, limit),
    [page, limit]
  );

export const useMovieDetails = (tmdbId) =>
  useFetch(
    () => getMovieById(tmdbId),
    [tmdbId]
  );

export const usePopularMovies = () =>
  useFetch(getPopularMovies, []);

export const useTopRatedMovies = () =>
  useFetch(getTopRatedMovies, []);

export const useLatestMovies = () =>
  useFetch(getLatestMovies, []);

export const useMoviesByGenre = (genre) =>
  useFetch(
    () => getMoviesByGenre(genre),
    [genre]
  );