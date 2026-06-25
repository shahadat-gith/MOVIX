import MovieDetails from "../models/MovieDetails.js";

const enrichMovies = async movies => {
  const tmdbIds = movies.map(
    movie => movie.tmdbId
  );

  const details = await MovieDetails.find({
    tmdbId: { $in: tmdbIds }
  }).lean();

  const detailsMap = new Map(
    details.map(detail => [
      detail.tmdbId,
      detail
    ])
  );

  return movies.map(movie => ({
    ...movie,
    posterPath:
      detailsMap.get(movie.tmdbId)?.posterPath || null,
    backdropPath:
      detailsMap.get(movie.tmdbId)?.backdropPath || null,
    runtime:
      detailsMap.get(movie.tmdbId)?.runtime || null,
    tagline:
      detailsMap.get(movie.tmdbId)?.tagline || ""
  }));
};

export default enrichMovies;