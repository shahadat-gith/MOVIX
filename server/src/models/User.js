import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      url: {
        type: String,
        default: "",
      },

      public_id: {
        type: String,
        default: "",
      },
    },

    preferences: {
      genres: {
        type: [String],
        default: [],
      },

      industries: {
        type: [String],
        enum: [
          "Hollywood",
          "Bollywood",
          "Tollywood",
          "Kollywood",
          "Mollywood",
          "Korean",
          "Japanese",
          "Chinese",
          "European",
          "Anime",
        ],
        default: [],
      },

      description: {
        type: String,
        default: "",
      },

      embedding: {
        type: [Number],
        default: [],
      },
    },

    watchlist: [
      {
        type: Number, // tmdbId
      },
    ],

    searchHistory: [
      {
        query: String,

        searchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },{timestamps: true,});

export default mongoose.model("User", userSchema);
