const { validateResult } = require("./validateHelper");
const { param, body, check } = require("express-validator");

exports.validateMessageImg = [
  body("sendTo").isMongoId().withMessage("Invalid ID"),
  body("text").notEmpty().withMessage("The message is required"),
  body("image").optional().notEmpty().withMessage("The image is required"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

exports.validateMessageVd = [
  body("sendTo").isMongoId().withMessage("Invalid ID"),
  body("text").notEmpty().withMessage("The message is required"),
  body("video").optional().notEmpty().withMessage("The image is required"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

exports.verifyID = [
  param("_id").isMongoId().withMessage("Invalid id"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];
