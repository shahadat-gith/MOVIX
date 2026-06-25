import User from "../models/User.js";
import Movie from "../models/Movie.js";
import enrichMovies from "../utils/enrichMovies.js";

export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const tmdbIds = user.watchlist || [];

    if (tmdbIds.length === 0) {
      return res.status(200).json({
        success: true,
        movies: [],
        count: 0,
      });
    }

    let movies = await Movie.find(
      { tmdbId: { $in: tmdbIds } },
      { embedding: 0 }
    ).lean();

    movies = await enrichMovies(movies);

    return res.status(200).json({
      success: true,
      movies,
      count: movies.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch watchlist",
    });
  }
};

export const addToWatchlist = async (req, res) => {
  try {
    const { tmdbId } = req.body;

    if (!tmdbId) {
      return res.status(400).json({
        success: false,
        message: "tmdbId is required",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.watchlist.includes(tmdbId)) {
      return res.status(200).json({
        success: true,
        message: "Movie already in watchlist",
        watchlist: user.watchlist,
      });
    }

    user.watchlist.push(tmdbId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Added to watchlist",
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add to watchlist",
    });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const { tmdbId } = req.params;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.watchlist = user.watchlist.filter(
      (id) => id !== Number(tmdbId)
    );
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Removed from watchlist",
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove from watchlist",
    });
  }
};

export const checkInWatchlist = async (req, res) => {
  try {
    const { tmdbId } = req.params;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const inWatchlist = user.watchlist.includes(Number(tmdbId));

    return res.status(200).json({
      success: true,
      inWatchlist,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to check watchlist",
    });
  }
};
