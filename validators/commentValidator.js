const { validateResult } = require("./validateHelper");
const { param, body, check } = require("express-validator");

exports.verifyID = [
  param("_id").isMongoId().withMessage("Invalid id"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

exports.validateComment = [
  body("post").isMongoId().withMessage("Invalid id"),
  body("text").notEmpty().withMessage("The comment is required"),
  body("taggedUsers")
    .optional()
    .notEmpty()
    .withMessage("The tagged user is required"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

exports.validateUpdate = [
  body("text").optional().notEmpty().withMessage("The comment is required"),
  body("taggedUsers")
    .optional()
    .notEmpty()
    .withMessage("The tagged user is required"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];
