import { generateEmbedding } from "../services/embedding.js";
import { semanticSearch } from "../services/search.js";

export const searchMovies = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Query is required"
      });
    }

    const embedding = await generateEmbedding(query);

    const movies = await semanticSearch(embedding);

    return res.status(200).json({
      success: true,
      count: movies.length,
      movies
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to search movies"
    });
  }
};