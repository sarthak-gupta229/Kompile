import cron from "node-cron";
import { fetchAndStoreContests } from "../services/contestEvent.service.js";

export const scheduleContestSync = () => {
  // every 6 hours
  cron.schedule("0 */6 * * *", () => {
    fetchAndStoreContests().catch((err) =>
      console.error("Scheduled contest sync failed:", err),
    );
  });
};
