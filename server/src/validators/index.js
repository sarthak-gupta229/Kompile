import { body } from "express-validator";
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

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  userUpdateBasicInfoValidator,
  sheetIdParamValidator,
  questionProgressValidator,
};
