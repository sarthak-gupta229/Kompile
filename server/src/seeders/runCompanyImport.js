import "dotenv/config";
import mongoose from "mongoose";
import { importAllCompanyCsvs } from "./importCompanyQuestions.js";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to DB");

  await importAllCompanyCsvs();

  console.log("Import complete");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
