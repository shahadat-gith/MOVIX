import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {},
  {
    collection: "movies",
    strict: false
  }
);

export default mongoose.model(
  "Movie",
  movieSchema
);