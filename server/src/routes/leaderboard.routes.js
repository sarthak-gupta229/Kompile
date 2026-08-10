import { Router } from "express";
import {
  leaderboardQueryValidator,
  roomLeaderboardValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getGlobalLeaderboard,
  getRoomLeaderboard,
} from "../controllers/leaderboard.controller.js";

const router = Router();

router
  .route("/leaderboard")
  .get(verifyJWT, leaderboardQueryValidator(), validate, getGlobalLeaderboard);

router
  .route("/rooms/:roomId/leaderboard")
  .get(verifyJWT, roomLeaderboardValidator(), validate, getRoomLeaderboard);

export default router;
