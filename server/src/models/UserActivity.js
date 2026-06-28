import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "search",
        "view",
        "watchlist_add",
        "watchlist_remove",
        "recommendation_click",
        "like",
        "rating",
      ],
      required: true,
      index: true,
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      default: null,
      index: true,
    },

    query: {
      type: String,
      default: "",
    },

    searchType: {
      type: String,
      enum: ["ai", "title"],
      default: null,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userActivitySchema.index({ user: 1, createdAt: -1 });
userActivitySchema.index({ user: 1, type: 1 });
userActivitySchema.index({ user: 1, movie: 1 });

const UserActivity =
  mongoose.models.UserActivity ||
  mongoose.model("UserActivity", userActivitySchema);

export default UserActivity;
