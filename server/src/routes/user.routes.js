import express from "express";

import {
  getProfile,
  getRecommendations,
  updatePreferences,
  uploadAvatar,
} from "../controllers/user.controller.js";

import authenticate from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.get("/recommendations", authenticate, getRecommendations);
router.put("/preferences", authenticate, updatePreferences);
router.post("/avatar", authenticate, upload.single("avatar"), uploadAvatar);

export default router;
