import express from "express";

import {searchMovies} from "../controllers/search.controller.js";

const router = express.Router();

router.post("/search",searchMovies);

export default router;