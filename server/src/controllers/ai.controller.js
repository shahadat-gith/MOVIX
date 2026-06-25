import { generateEmbedding } from "../services/ai.service.js";
import { semanticSearch } from "../services/search.service.js";
import enrichMovies from "../utils/enrichMovies.js";

export const searchMovies = async (req, res) => {
  const { query } = req.body;

  const embedding = await generateEmbedding(query);

  let movies = await semanticSearch(embedding);

  movies = await enrichMovies(movies);

  return res.status(200).json({
    success: true,
    count: movies.length,
    movies,
  });
};