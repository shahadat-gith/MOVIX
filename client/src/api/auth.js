import api from "../configs/axios";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async ({ name, email, password, genres, industries, description }) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
    genres: genres || [],
    industries: industries || [],
    description: description || "",
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};
