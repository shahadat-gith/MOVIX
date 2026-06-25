import api from "../configs/axios";

export const getWatchlist = async () => {
  const response = await api.get("/watchlist");
  return response.data;
};

export const addToWatchlist = async (tmdbId) => {
  const response = await api.post("/watchlist", { tmdbId });
  return response.data;
};

export const removeFromWatchlist = async (tmdbId) => {
  const response = await api.delete(`/watchlist/${tmdbId}`);
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put("/users/profile", data);
  return response.data;
};

export const uploadAvatar = async (formData) => {
  const response = await api.post("/users/avatar", formData);
  return response.data;
};

export const getRecommendations = async () => {
  const response = await api.get("/users/recommendations");
  return response.data;
};
