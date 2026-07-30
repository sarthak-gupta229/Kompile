import "dotenv/config";
import mongoose from "mongoose";
import { migrateLoveBabbar } from "./migrateLoveBabbar.js";
import { migrateStriverA2Z } from "./migrateStriverA2Z.js";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to DB");

  await migrateLoveBabbar();
  await migrateStriverA2Z();

  console.log("Migration complete");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
