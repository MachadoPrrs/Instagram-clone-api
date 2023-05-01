const { validateResult } = require("./validateHelper");
const { body, check } = require("express-validator");

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
    .withMessage("Passord is required")
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
    .withMessage("Passord is required")
    .isLength({ min: 8, max: 20 })
    .withMessage(
      "Password must be at least 8 characters long and max 20 characters long"
    ),
  body("email")
    .exists()
    .isEmail()
    .withMessage("Please provide a valid email address"),
];
