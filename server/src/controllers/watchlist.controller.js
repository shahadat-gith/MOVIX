import mongoose from "mongoose";
import User from "../models/User.js";
import Movie from "../models/Movie.js";

export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.watchlist?.length) {
      return res.status(200).json({
        success: true,
        movies: [],
        count: 0
      });
    }

    const movies = await Movie.find(
      { _id: { $in: user.watchlist } },
      { embedding: 0 }
    ).lean();

    return res.status(200).json({
      success: true,
      movies,
      count: movies.length
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch watchlist"
    });
  }
};

export const addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "movieId is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movie ID"
      });
    }

    const movie = await Movie.exists({ _id: movieId });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $addToSet: {
          watchlist: new mongoose.Types.ObjectId(movieId)
        }
      },
      {
        new: true
      }
    ).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Added to watchlist",
      watchlist: user.watchlist
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to add to watchlist"
    });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movie ID"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $pull: {
          watchlist: new mongoose.Types.ObjectId(movieId)
        }
      },
      {
        new: true
      }
    ).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Removed from watchlist",
      watchlist: user.watchlist
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove from watchlist"
    });
  }
};

export const checkInWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movie ID"
      });
    }

    const user = await User.findById(req.userId).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const objId = new mongoose.Types.ObjectId(movieId);
    const inWatchlist = user.watchlist?.some(
      (id) => id.toString() === objId.toString()
    ) || false;

    return res.status(200).json({
      success: true,
      inWatchlist
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to check watchlist"
    });
  }
};