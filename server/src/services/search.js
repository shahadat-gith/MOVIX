import Movie from "../models/Movie.js";

export const semanticSearch = async (embedding) => {
  if (!embedding?.length) {
    throw new Error("Embedding is required for semantic search");
  }

  return await Movie.aggregate([
    {
      $vectorSearch: {
        index: "movix_vector_index",
        path: "embedding",
        queryVector: embedding,
        numCandidates: 200,
        limit: 20
      }
    },
    {
      $project: {
        tmdbId: 1,
        title: 1,
        overview: 1,
        genres: 1,
        cast: 1,
        director: 1,
        voteAverage: 1,
        voteCount: 1,
        popularity: 1,
        releaseDate: 1,
        year: 1,
        runtime: 1,
        tagline: 1,
        posterPath: 1,
        backdropPath: 1,
        homepage: 1,
        status: 1,
        score: {
          $meta: "vectorSearchScore"
        }
      }
    }
  ]);
};