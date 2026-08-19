import { Router } from "express";
import {
  createMission,
  getMissions,
  toggleMission,
  deleteMission,
} from "../controllers/dailyMission.controller.js";
import {
  createMissionValidator,
  missionIdValidator,
} from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";

let router = Router();

router.route("/").get(verifyJWT, getMissions);

router
  .route("/create")
  .post(verifyJWT, createMissionValidator(), validate, createMission);

router
  .route("/toggle/:missionId")
  .patch(verifyJWT, missionIdValidator(), validate, toggleMission);

router
  .route("/delete/:missionId")
  .delete(verifyJWT, missionIdValidator(), validate, deleteMission);

export default router;
