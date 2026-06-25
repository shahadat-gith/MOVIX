import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["ai", "name"],
      default: "ai",
    },
    results: [
      {
        tmdbId: Number,
        title: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

searchHistorySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("SearchHistory", searchHistorySchema);
