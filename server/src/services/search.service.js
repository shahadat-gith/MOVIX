import Movie from "../models/Movie.js";

export const semanticSearch = async (embedding) => {

  const movies = await Movie.aggregate([
      {
        $vectorSearch: {
          index: "movie_vector_index",
          path: "embedding",
          queryVector: embedding,
          numCandidates: 100,
          limit: 20
        }
      },
      {
        $project: {
          embedding: 0
        }
      }
    ]);

  return movies;
};