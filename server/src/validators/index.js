import { body, query } from "express-validator";
import { param } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("confirmPassword")
      .trim()
      .notEmpty()
      .withMessage("Confirm password is required"),
    body("fullName").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Invalid Email"),
    body("password").notEmpty().withMessage("password is required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

const userUpdateBasicInfoValidator = () => {
  return [
    body("firstName").optional({ checkFalsy: true }).trim(),
    body("lastName").optional({ checkFalsy: true }).trim(),
    body("bio")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 200 })
      .withMessage("Bio cannot exceed 200 characters"),
    body("country").optional({ checkFalsy: true }).trim(),
    body("techStack").optional({ checkFalsy: true }),
    body("college").optional({ checkFalsy: true }).trim(),
    body("degree").optional({ checkFalsy: true }).trim(),
    body("branch").optional({ checkFalsy: true }).trim(),
    body("graduationYear")
      .optional({ checkFalsy: true })
      .custom((val) => {
        if (val === "" || val === null || val === undefined) return true;
        const num = Number(val);
        if (isNaN(num) || num < 2000 || num > 2040) {
          throw new Error("Invalid graduation year");
        }
        return true;
      }),
  ];
};

const sheetIdParamValidator = () => [
  param("slug").notEmpty().withMessage("Sheet slug is required"),
];

const questionProgressValidator = () => [
  param("sheetId").isMongoId().withMessage("Invalid sheet ID"),
  param("questionId").isMongoId().withMessage("Invalid question ID"),
];

const createRoomValidator = () => {
  return [
    body("name").notEmpty().withMessage("Room name is required"),
    body("maxMembers")
      .optional()
      .isInt({ min: 2, max: 10 })
      .withMessage("maxMembers must be between 2 and 10"),
  ];
};

const joinRoomValidator = () => {
  return [
    body("inviteCode").trim().notEmpty().withMessage("Invite code is required"),
  ];
};

const roomIdValidator = () => {
  return [param("roomId").isMongoId().withMessage("Invalid room ID")];
};

const leaderboardQueryValidator = () => {
  return [
    query("metric")
      .optional()
      .isIn(["totalQuestions", "leetcodeRating", "codeforcesRating"])
      .withMessage(
        "metric must be one of: totalQuestions, leetcodeRating, codeforcesRating",
      ),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("limit must be between 1 and 100"),
  ];
};
const roomLeaderboardValidator = () => {
  return [
    param("roomId").isMongoId().withMessage("Invalid room ID"),
    query("metric")
      .optional()
      .isIn(["totalQuestions", "leetcodeRating", "codeforcesRating"])
      .withMessage(
        "metric must be one of: totalQuestions, leetcodeRating, codeforcesRating",
      ),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  userUpdateBasicInfoValidator,
  sheetIdParamValidator,
  questionProgressValidator,
  createRoomValidator,
  joinRoomValidator,
  roomIdValidator,
  leaderboardQueryValidator,
  roomLeaderboardValidator,
};
