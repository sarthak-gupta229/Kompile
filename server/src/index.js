import app from "./app.js";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

//basic_configs
app.use(express.json({ limit: "16kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  }),
);
app.use(express.static("public"));
app.use(cookieParser());

//CORS_configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Contnet-Type", "Authorization"],
  }),
);

const PORT = process.env.PORT || 8000;

connectDB()
  .then(
    app.listen(PORT, () => {
      console.log(`Server running on port :${PORT}`);
    }),
  )
  .catch((error) => {
    console.log(error);
  });


