import Movie from "../models/Movie.js";
import SearchHistory from "../models/SearchHistory.js";
import mongoose from "mongoose";

export const semanticSearch = async (embedding) => {
  try {
    if (!Array.isArray(embedding) || embedding.length === 0) {
      return [];
    }

    return await Movie.aggregate([
      {
        $vectorSearch: {
          index: "movix_vector_index",
          path: "embedding",
          queryVector: embedding,
          numCandidates: 100,
          limit: 20,
        },
      },
      {
        $project: {
          embedding: 0,
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findSimilarMovies = async (movieId) => {
  try {
    const movie = await Movie.findById(movieId, { embedding: 1 }).lean();

    if (!movie) {
      return [];
    }

    return await Movie.aggregate([
      {
        $vectorSearch: {
          index: "movix_vector_index",
          path: "embedding",
          queryVector: movie.embedding,
          numCandidates: 100,
          limit: 20,
        },
      },
      {
        $match: { _id: { $ne: new mongoose.Types.ObjectId(movieId) } },
      },
      {
        $limit: 10,
      },
      {
        $project: { embedding: 0 },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const saveSearchHistory = async ({ query, type }) => {
  try {
    if (!query?.trim()) return;

    const normalizedQuery = query.trim();

    if (type === "title") {
      // Title searches: upsert by exact match and increment count
      await SearchHistory.findOneAndUpdate(
        { query: normalizedQuery, type },
        {
          $inc: { count: 1 },
          $set: { lastSearchedAt: new Date() },
        },
        { upsert: true, setDefaultsOnInsert: true },
      ).catch(() => {});
    } else {
      // AI searches: insert as new entry (natural language queries are unique)
      // Limit total AI history entries to prevent unbounded growth
      await SearchHistory.create({
        query: normalizedQuery,
        type,
        lastSearchedAt: new Date(),
      });

      // Keep AI history lean — delete oldest AI entries beyond 100 total
      const aiCount = await SearchHistory.countDocuments({ type: "ai" });
      if (aiCount > 100) {
        const overLimit = aiCount - 100;
        const oldest = await SearchHistory.find({ type: "ai" })
          .sort({ lastSearchedAt: 1 })
          .limit(overLimit)
          .select("_id")
          .lean();

        if (oldest.length) {
          await SearchHistory.deleteMany({
            _id: { $in: oldest.map((o) => o._id) },
          });
        }
      }
    }
  } catch (error) {
    console.error("Failed to save search history:", error);
  }
};

export const getRecentSearches = async (limit = 15) => {
  try {
    return await SearchHistory.find()
      .sort({ lastSearchedAt: -1 })
      .limit(limit)
      .lean();
  } catch (error) {
    console.error("Failed to fetch recent searches:", error);
    return [];
  }
};

export const getTrendingSearches = async (limit = 10) => {
  try {
    return await SearchHistory.find()
      .sort({ count: -1, lastSearchedAt: -1 })
      .limit(limit)
      .lean();
  } catch (error) {
    console.error("Failed to fetch trending searches:", error);
    return [];
  }
};

export const deleteSearchHistory = async (id) => {
  try {
    await SearchHistory.findByIdAndDelete(id);
  } catch (error) {
    console.error("Failed to delete search history:", error);
  }
};

export const clearSearchHistory = async () => {
  try {
    await SearchHistory.deleteMany({});
  } catch (error) {
    console.error("Failed to clear search history:", error);
  }
};
