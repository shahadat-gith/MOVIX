import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["ai", "title"],
      required: true,
    },

    count: {
      type: Number,
      default: 1,
      min: 0,
    },

    lastSearchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

searchHistorySchema.index({ lastSearchedAt: -1 });
searchHistorySchema.index({ count: -1 });
searchHistorySchema.index({ query: 1, type: 1 }, { unique: true });

const SearchHistory =
  mongoose.models.SearchHistory ||
  mongoose.model("SearchHistory", searchHistorySchema);

export default SearchHistory;
