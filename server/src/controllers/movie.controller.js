import Movie from "../models/Movie.js";

export const getAllMovies = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [movies, totalMovies] = await Promise.all([
      Movie.find({}, { embedding: 0 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Movie.countDocuments()
    ]);

    return res.status(200).json({
      success: true,
      movies,
      totalMovies,
      currentPage: page,
      totalPages: Math.ceil(totalMovies / limit)
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch movies"
    });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findById(
      movieId,
      { embedding: 0 }
    ).lean();

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    return res.status(200).json({
      success: true,
      movie
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch movie"
    });
  }
};

export const getPopularMovies = async (req, res) => {
  try {
    const movies = await Movie.find({}, { embedding: 0 })
      .sort({ popularity: -1 })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      movies
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch popular movies"
    });
  }
};

export const getTopRatedMovies = async (req, res) => {
  try {
    const movies = await Movie.find(
      {
        voteAverage: {
          $gt: 0
        }
      },
      {
        embedding: 0
      }
    )
      .sort({
        voteAverage: -1,
        voteCount: -1
      })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      movies
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch top rated movies"
    });
  }
};

export const getLatestMovies = async (req, res) => {
  try {
    const movies = await Movie.find({}, { embedding: 0 })
      .sort({ year: -1 })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      movies
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest movies"
    });
  }
};

export const getMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params;

    const movies = await Movie.find(
      {
        genres: {
          $regex: genre,
          $options: "i"
        }
      },
      {
        embedding: 0
      }
    )
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      movies
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch movies"
    });
  }
};

export const searchMoviesByTitle = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q?.trim()) {
      return res.status(200).json({
        success: true,
        movies: [],
        count: 0
      });
    }

    const movies = await Movie.find(
      {
        title: new RegExp(q.trim(), "i")
      },
      {
        embedding: 0
      }
    )
      .sort({ popularity: -1 })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      movies,
      count: movies.length
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to search movies"
    });
  }
};