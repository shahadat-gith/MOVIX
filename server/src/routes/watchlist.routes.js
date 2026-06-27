import express from "express";

import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkInWatchlist
} from "../controllers/watchlist.controller.js";

import authenticate from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getWatchlist);

router.post("/", authenticate, addToWatchlist);

router.delete("/:movieId", authenticate, removeFromWatchlist);

router.get("/check/:movieId", authenticate, checkInWatchlist);

export default router;