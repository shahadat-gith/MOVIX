import { generateEmbedding } from "../services/ai.service.js";

import { semanticSearch } from "../services/search.service.js";

export const searchMovies = async (req, res) => {

  const { query } = req.body;

  const embedding = await generateEmbedding(query);

  const movies = await semanticSearch(embedding);

  return res.json({
    success: true,
    count: movies.length,
    movies
  });
};