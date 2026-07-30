import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  syncGithubProfile,
  syncLeetcodeProfile,
  syncCodeforcesProfile,
  syncAllProfiles,
  getUserStats,
  getSpecificPlatformData,
} from "../controllers/platform.controller.js";

const router = Router();

router.route("/sync/github").post(verifyJWT, syncGithubProfile);
router.route("/sync/leetcode").post(verifyJWT, syncLeetcodeProfile);
router.route("/sync/codeforces").post(verifyJWT, syncCodeforcesProfile);
router.route("/sync/all").post(verifyJWT, syncAllProfiles);

router.route("/stats").get(verifyJWT, getUserStats);
router.route("/stats/:username").get(getUserStats);

router.route("/:platform").get(verifyJWT, getSpecificPlatformData);
router.route("/:platform/:username").get(getSpecificPlatformData);

export default router;
