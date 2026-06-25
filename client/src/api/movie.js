import api from "../configs/axios";

export const getMovies = async (page = 1, limit = 20) => {
  const response = await api.get(
    `/movies?page=${page}&limit=${limit}`
  );

  return response.data;
};

export const getMovieById = async (tmdbId) => {
  const response = await api.get(
    `/movies/${tmdbId}`
  );

  return response.data;
};

export const getPopularMovies = async () => {
  const response = await api.get(
    "/movies/popular"
  );

  return response.data;
};

export const getTopRatedMovies = async () => {
  const response = await api.get(
    "/movies/top-rated"
  );

  return response.data;
};

export const getLatestMovies = async () => {
  const response = await api.get(
    "/movies/latest"
  );

  return response.data;
};

export const getMoviesByGenre = async (genre) => {
  const response = await api.get(
    `/movies/genre/${genre}`
  );

  return response.data;
};

export const searchMovies = async (query) => {
  const response = await api.post("/ai/search", { query });
  return response.data;
};

export const searchMoviesByTitle = async (query) => {
  const response = await api.get(`/movies/search?q=${encodeURIComponent(query)}`);
  return response.data;
};