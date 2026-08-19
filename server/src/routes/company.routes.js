import { Router } from "express";
import {
  getAllCompanies,
  getCompanyQuestions,
  getCompanyTopics,
  toggleCompanyQuestionProgress,
} from "../controllers/company.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  companyIdValidator,
  getCompanyQuestionsValidator,
  toggleCompanyQuestionValidator,
} from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

let router = Router();

router.route("/").get(verifyJWT, getAllCompanies);

router
  .route("/:companyId/questions")
  .get(
    verifyJWT,
    getCompanyQuestionsValidator(),
    validate,
    getCompanyQuestions,
  );

router
  .route("/:companyId/topics")
  .get(verifyJWT, companyIdValidator(), validate, getCompanyTopics);

router
  .route("/:companyId/questions/:questionId/toggle")
  .post(
    verifyJWT,
    toggleCompanyQuestionValidator(),
    validate,
    toggleCompanyQuestionProgress,
  );

export default router;
