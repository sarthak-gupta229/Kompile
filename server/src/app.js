import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "./config/passport.js";
import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import platformRouter from "./routes/platform.routes.js";
import sheetsRouter from "./routes/sheets.route.js";
import roomRoutes from "./routes/room.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import dailyMissionRoutes from "./routes/dailyMission.routes.js";
import companyRouter from "./routes/company.routes.js";

let app = express();

app.set("trust proxy", 1);

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim().replace(/\/$/, ""))
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/platforms", platformRouter);
app.use("/api/v1/sheets", sheetsRouter);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);
app.use("/api/v1/missions", dailyMissionRoutes);
app.use("/api/v1/companies", companyRouter);

app.get("/", (req, res) => {
  res.send("welcome to Kompile");
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
});

export default app;
