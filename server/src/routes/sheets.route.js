import { Router } from "express";
import {
  getSheetDetail,
  getAllSheets,
  toggleQuestionProgress,
  toggleBookmark,
} from "../controllers/sheets.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  sheetIdParamValidator,
  questionProgressValidator,
} from "../validators/index.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getAllSheets);

router
  .route("/:slug")
  .get(sheetIdParamValidator(), validate, getSheetDetail);

router
  .route("/:sheetId/questions/:questionId/toggle")
  .patch(questionProgressValidator(), validate, toggleQuestionProgress);

router
  .route("/:sheetId/questions/:questionId/bookmark")
  .patch(questionProgressValidator(), validate, toggleBookmark);

export default router;
