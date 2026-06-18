import express from "express";
import healthCheckRouter from "./routes/healthcheck.routes.js";

let app = express();

app.use("/api/v1/healthcheck", healthCheckRouter);

app.get("/", (req, res) => {
  res.send("wlecome to Komplie");
});

export default app;
