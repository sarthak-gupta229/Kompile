import { Router } from "express";
import {
  getContestEvents,
  syncContestEvents,
  getTodayContests,
} from "../controllers/contestEvent.controller.js";

const router = Router();

router.get("/contests", getContestEvents);

router.post("/contests/sync", syncContestEvents);

router.route("/contests/today").get(getTodayContests);

export default router;
