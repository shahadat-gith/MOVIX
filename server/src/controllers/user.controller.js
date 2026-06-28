import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

import User from "../models/User.js";
import { semanticSearch } from "../services/search.js";

import { generateEmbedding } from "../services/embedding.js";

export const getProfile = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");

  return res.status(200).json({
    success: true,
    user,
  });
};

export const updatePreferences = async (req, res) => {
  const { genres, industries, description } = req.body;

  const updateData = {};

  if (genres || industries || description !== undefined) {
    const embeddingText = `
      Genres: ${(genres || []).join(", ")}
      Industries: ${(industries || []).join(", ")}
      Description: ${description || ""}
    `;

    const embedding = await generateEmbedding(embeddingText);
    console.log(embedding);

    updateData.preferences = {
      genres: genres || [],
      industries: industries || [],
      description: description || "",
      embedding,
    };
  }

  const user = await User.findByIdAndUpdate(req.userId, updateData, {
    new: true,
  }).select("-password");

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
};

export const uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Avatar is required",
    });
  }

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "movix/avatars",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });

  const user = await User.findById(req.userId);

  if (user.avatar?.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  user.avatar = {
    url: result.secure_url,
    public_id: result.public_id,
  };

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    user,
  });
};

export const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const embedding = user.preferences?.embedding;

    if (!embedding?.length) {
      return res.status(400).json({
        success: false,
        message: "User preferences not found",
      });
    }

    const movies = await semanticSearch(embedding);

    return res.status(200).json({
      success: true,
      movies,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations",
    });
  }
};


