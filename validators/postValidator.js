const { validateResult } = require("./validateHelper");
const { param, body } = require("express-validator");

exports.validateCreatePost = [
  body("image").notEmpty().withMessage("The image is required"),
  body("caption")
    .notEmpty()
    .withMessage("The caption is required")
    .isLength({ min: 2 })
    .withMessage("The caption must has 2 or more characters"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];
exports.validateUpdatePost = [
  param("_id").isMongoId().withMessage("Invalid id"),
  body("image").optional().notEmpty().withMessage("The image is required"),
  body("caption")
    .optional()
    .notEmpty()
    .withMessage("The caption is required")
    .isLength({ min: 2 })
    .withMessage("The caption must has 2 or more characters"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

exports.validateDeletePost = [
  param("_id").isMongoId().withMessage("Invalid id"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];