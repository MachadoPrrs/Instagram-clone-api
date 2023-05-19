const { validateResult } = require("./validateHelper");
const { body, check, param } = require("express-validator");

exports.validateCreate = [
  body("username")
    .exists()
    .not()
    .isEmpty()
    .withMessage("Please provide an username"),
  body("password")
    .exists()
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage(
      "Password must be at least 8 characters long and max 20 characters long"
    ),
  body("passwordConfirm")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  body("name").exists().not().isEmpty().withMessage("Please provide a name"),
  body("email")
    .exists()
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("phonenumber")
    .exists()
    .withMessage("Phone number is required")
    .isNumeric()
    .withMessage("Phone number must be a numeric value"),
  body("gender").exists().not().isEmpty().withMessage("Please select a gender"),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

exports.validateLogin = [
  body("password")
    .exists()
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage(
      "Password must be at least 8 characters long and max 20 characters long"
    ),
  body("email")
    .exists()
    .isEmail()
    .withMessage("Please provide a valid email address"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

exports.validateForgotPassword = [
  body("email")
    .exists()
    .isEmail()
    .withMessage("Please provide a valid email address"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];
exports.validateResetPassword = [
  body("passwordConfirm")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

exports.validateMe = [
  body("username")
    .optional()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Invalid username"),
  body("name")
    .optional()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Invalid name"),
  body("email").optional().notEmpty().isEmail().withMessage("Invalid email"),
  body("phonenumber")
    .notEmpty()
    .optional()
    .isMobilePhone("en-US")
    .withMessage("Phone number must be a numeric value"),
  body("gender").optional().notEmpty().withMessage("Invalid gender"),
  body("profilePicture")
    .optional()
    .notEmpty()
    .withMessage("Invalid profile picture"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

exports.validateUpdatePassword = [
  body("password")
    .exists()
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage(
      "Password must be at least 8 characters long and max 20 characters long"
    ),
  body("passwordConfirm")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];
exports.validateDeleteUser = [
  param("/_id").isMongoId().withMessage("Invalid id"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];
