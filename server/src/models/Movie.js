import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    overview: { type: String, default: "" },
    genres: { type: [String], default: [] },
    keywords: { type: [String], default: [] },
    cast: { type: [String], default: [] },
    director: { type: String, default: "" },
    voteAverage: { type: Number, default: 0 },
    voteCount: { type: Number, default: 0 },
    popularity: { type: Number, default: 0 },
    releaseDate: { type: Date, default: null },
    year: { type: Number, index: true },
    runtime: { type: Number, default: 0 },
    tagline: { type: String, default: "" },
    posterPath: { type: String, required: true },
    backdropPath: { type: String, required: true },
    homepage: { type: String, default: "" },
    status: { type: String, default: "" },
    embedding: { type: [Number], required: true },
  },
  {
    collection: "movies",
    timestamps: true,
    versionKey: false,
    minimize: true,
  },
);

movieSchema.index({ title: "text", overview: "text", tagline: "text" });
movieSchema.index({ genres: 1 });
movieSchema.index({ year: -1 });
movieSchema.index({ popularity: -1 });
movieSchema.index({ voteAverage: -1, voteCount: -1 });

const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);

export default Movie;
