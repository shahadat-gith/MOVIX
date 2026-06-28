import api from "../configs/axios";

export const getMovies = async (page = 1, limit = 20) => {
  const response = await api.get(
    `/movies?page=${page}&limit=${limit}`
  );

  return response.data;
};

export const getMovieById = async (movieId) => {
  const response = await api.get(
    `/movies/${movieId}`
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

export const aiSearch = async (query) => {
  const response = await api.post("/ai/search", { query });
  return response.data;
};

export const searchMoviesByTitle = async (query) => {
  const response = await api.get(`/movies/search?q=${encodeURIComponent(query)}`);
  return response.data;
};



export const fetchSimilarMovies = async(movieId) =>{
  const response = await api.get(`/movies/similar?id=${movieId}`);

  return response.data
}

export const getSearchHistory = async (limit = 15) => {
  const response = await api.get(`/ai/history?limit=${limit}`);
  return response.data;
};

export const getTrendingSearches = async (limit = 10) => {
  const response = await api.get(`/ai/trending?limit=${limit}`);
  return response.data;
};

export const deleteSearchHistoryItem = async (id) => {
  const response = await api.delete(`/ai/history/${id}`);
  return response.data;
};

export const clearAllSearchHistory = async () => {
  const response = await api.delete("/ai/history");
  return response.data;
};