import { useState, useEffect, useCallback } from "react";
import { searchMovies } from "../api/movie";
import useDebounce from "./useDebounce";

const useRecommendations = (query) => {
  const debouncedQuery = useDebounce(query, 600);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 3) {
      setMovies([]);
      setLoading(false);
      setError(null);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    searchMovies(debouncedQuery)
      .then((res) => {
        if (mounted) setMovies(res.movies || []);
      })
      .catch((err) => {
        if (mounted) setError(err?.response?.data?.message || err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [debouncedQuery]);

  return { movies, loading, error, query: debouncedQuery };
};

export default useRecommendations;
