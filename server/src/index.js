import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/index.js";
import { fetchAndStoreContests } from "./services/contestEvent.service.js";
import { scheduleContestSync } from "./jobs/contestSync.job.js";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });

    fetchAndStoreContests().catch((err) =>
      console.error("Initial contest sync failed:", err),
    );
    scheduleContestSync();
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });
