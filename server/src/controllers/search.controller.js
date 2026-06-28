import { generateEmbedding } from "../services/embedding.js";
import {
  semanticSearch,
  saveSearchHistory,
  getRecentSearches,
  getTrendingSearches,
  deleteSearchHistory,
  clearSearchHistory,
} from "../services/search.js";

export const searchMovies = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const embedding = await generateEmbedding(query);

    const movies = await semanticSearch(embedding);

    // Save to global search history
    saveSearchHistory({ query, type: "ai" }).catch(console.error);

    return res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to search movies",
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 15, 50);
    const history = await getRecentSearches(limit);

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch search history",
    });
  }
};

export const getTrending = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const trending = await getTrendingSearches(limit);

    return res.status(200).json({
      success: true,
      trending,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trending searches",
    });
  }
};

export const deleteHistoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteSearchHistory(id);

    return res.status(200).json({
      success: true,
      message: "Search history entry deleted",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete search history entry",
    });
  }
};

export const clearHistory = async (req, res) => {
  try {
    await clearSearchHistory();

    return res.status(200).json({
      success: true,
      message: "Search history cleared",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear search history",
    });
  }
};
