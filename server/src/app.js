import express from "express";
import cors from "cors";

import aiRoutes from "./routes/ai.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import watchlistRoutes from "./routes/watchlist.routes.js";

import errorHandler from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "MOVIX API Running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/movies", movieRoutes);


app.use("/api/ai", aiRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.use(errorHandler);

export default app;