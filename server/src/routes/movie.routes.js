import express from "express";
import {
  getAllMovies,
  getMovieById,
  getPopularMovies,
  getMoviesByGenre,
  getTopRatedMovies,
  getLatestMovies,
  searchMoviesByTitle,
  getSimilarMovies
} from "../controllers/movie.controller.js";

const router = express.Router();

router.get("/", getAllMovies);
router.get("/popular", getPopularMovies);
router.get("/top-rated", getTopRatedMovies);
router.get("/latest", getLatestMovies);
router.get("/genre/:genre", getMoviesByGenre);
router.get("/search", searchMoviesByTitle)
router.get("/similar", getSimilarMovies)

router.get("/:movieId", getMovieById);

export default router;