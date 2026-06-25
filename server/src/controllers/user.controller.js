import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

import User from "../models/User.js";
import enrichMovies from "../utils/enrichMovies.js";
import { semanticSearch } from "../services/search.service.js";

import { generateEmbedding } from "../services/ai.service.js";

export const getProfile = async (req,res) => {
  const user = await User.findById(req.userId)
    .select("-password");

  return res.status(200).json({
    success: true,
    user,
  });
};

export const updateProfile = async (req,res) => {
  const {
    name,
    genres,
    industries,
    description,
  } = req.body;

  const updateData = {};

  if (name) {
    updateData.name = name;
  }

  if (
    genres ||
    industries ||
    description !== undefined
  ) {
    const embeddingText = `
      Genres: ${(genres || []).join(", ")}
      Industries: ${(industries || []).join(", ")}
      Description: ${description || ""}
    `;

    const embedding =
      await generateEmbedding(
        embeddingText
      );

    updateData.preferences = {
      genres: genres || [],
      industries: industries || [],
      description: description || "",
      embedding,
    };
  }

  const user = await User.findByIdAndUpdate(
    req.userId,
    updateData,
    {
      new: true,
    }
  ).select("-password");

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
};







export const uploadAvatar = async (
  req,
  res
) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Avatar is required",
    });
  }

  const result = await new Promise(
    (resolve, reject) => {
      const stream =
        cloudinary.uploader.upload_stream(
          {
            folder: "movix/avatars",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

      streamifier
        .createReadStream(req.file.buffer)
        .pipe(stream);
    }
  );

  const user = await User.findById(
    req.userId
  );

  if (user.avatar?.public_id) {
    await cloudinary.uploader.destroy(
      user.avatar.public_id
    );
  }

  user.avatar = {
    url: result.secure_url,
    public_id: result.public_id,
  };

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    avatar: user.avatar,
  });
};




export const getRecommendations = async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (!user.preferences.embedding.length) {
    return res.status(400).json({
      success: false,
      message: "User preferences not found",
    });
  }

  let movies = await semanticSearch(
    user.preferences.embedding
  );

  movies = await enrichMovies(movies);

  return res.status(200).json({
    success: true,
    movies,
  });
};