import mongoose from "mongoose";

const movieDetailsSchema = new mongoose.Schema(
  {},
  {
    collection: "movieDetails",
    strict: false
  }
);

export default mongoose.model(
  "MovieDetails",
  movieDetailsSchema
);