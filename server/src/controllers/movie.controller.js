import Movie from "../models/Movie.js";
import MovieDetails from "../models/MovieDetails.js";
import enrichMovies from "../utils/enrichMovies.js";

export const getAllMovies = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  let movies = await Movie.find({}, { embedding: 0 })
    .skip(skip)
    .limit(limit)
    .lean();

  movies = await enrichMovies(movies);

  const totalMovies = await Movie.countDocuments();

  return res.status(200).json({
    success: true,
    movies,
    totalMovies,
    currentPage: page,
    totalPages: Math.ceil(totalMovies / limit),
  });
};

export const getMovieById = async (req, res) => {
  const { tmdbId } = req.params;

  const movie = await Movie.findOne(
    { tmdbId: Number(tmdbId) },
    { embedding: 0 }
  ).lean();

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: "Movie not found",
    });
  }

  const details = await MovieDetails.findOne({
    tmdbId: Number(tmdbId),
  }).lean();

  return res.status(200).json({
    success: true,
    movie: {
      ...movie,
      posterPath: details?.posterPath || null,
      backdropPath: details?.backdropPath || null,
      runtime: details?.runtime || null,
      tagline: details?.tagline || "",
    },
  });
};



export const getPopularMovies = async (req, res) => {
  let movies = await Movie.find({}, { embedding: 0 })
    .sort({ popularity: -1 })
    .limit(20)
    .lean();

  movies = await enrichMovies(movies);

  return res.status(200).json({
    success: true,
    movies,
  });
};



export const getTopRatedMovies = async (req, res) => {
  let movies = await Movie.find(
    { voteAverage: { $gt: 0 } },
    { embedding: 0 }
  )
    .sort({
      voteAverage: -1,
      voteCount: -1,
    })
    .limit(20)
    .lean();

  movies = await enrichMovies(movies);

  return res.status(200).json({
    success: true,
    movies,
  });
};



export const getLatestMovies = async (req, res) => {
  let movies = await Movie.find({}, { embedding: 0 })
    .sort({ year: -1 })
    .limit(20)
    .lean();

  movies = await enrichMovies(movies);

  return res.status(200).json({
    success: true,
    movies,
  });
};



export const getMoviesByGenre = async (req, res) => {
  const { genre } = req.params;

  let movies = await Movie.find(
    {
      genres: {
        $regex: genre,
        $options: "i",
      },
    },
    { embedding: 0 }
  )
    .limit(20)
    .lean();

  movies = await enrichMovies(movies);

  return res.status(200).json({
    success: true,
    movies,
  });
};




export const searchMoviesByTitle = async (req, res) => {
  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.status(200).json({
      success: true,
      movies: [],
      count: 0,
    });
  }

  const searchRegex = new RegExp(q.trim(), "i");

  let movies = await Movie.find(
    {
      title: searchRegex,
    },
    {
      embedding: 0,
    }
  )
    .sort({ popularity: -1 })
    .limit(20)
    .lean();

  movies = await enrichMovies(movies);

  return res.status(200).json({
    success: true,
    movies,
    count: movies.length,
  });
};