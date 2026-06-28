import express from "express";

import {
  searchMovies,
  getHistory,
  getTrending,
  deleteHistoryItem,
  clearHistory,
} from "../controllers/search.controller.js";

const router = express.Router();

router.post("/search", searchMovies);
router.get("/history", getHistory);
router.get("/trending", getTrending);
router.delete("/history/:id", deleteHistoryItem);
router.delete("/history", clearHistory);

export default router;