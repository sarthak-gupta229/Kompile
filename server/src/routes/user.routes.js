import { Router } from "express";
import { updateBasicInfo } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userUpdateBasicInfoValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
let router = Router();

router
  .route("/basic-info")
  .put(verifyJWT, userUpdateBasicInfoValidator(), validate, updateBasicInfo);
export default router;
