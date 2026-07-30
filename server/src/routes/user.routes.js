import { Router } from "express";
import {
  updateBasicInfo,
  getBasicInfo,
  getUserData,
} from "../controllers/user.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userUpdateBasicInfoValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserStats } from "../controllers/platform.controller.js";

let router = Router();

router
  .route("/update-basic-info")
  .put(verifyJWT, userUpdateBasicInfoValidator(), validate, updateBasicInfo);

router.route("/profile/:username").get(getUserData);
router.route("/get-basic-info").get(verifyJWT, getBasicInfo);
router.route("/get-basic-info/:username").get(getBasicInfo);
router.route("/stats").get(verifyJWT, getUserStats);

export default router;
