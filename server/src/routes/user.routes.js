import { Router } from "express";
import { updateBasicInfo, getBasicInfo } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userUpdateBasicInfoValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
let router = Router();

router
  .route("/update-basic-info")
  .put(verifyJWT, userUpdateBasicInfoValidator(), validate, updateBasicInfo);

router.route("/get-basic-info").get(verifyJWT, getBasicInfo);

export default router;
