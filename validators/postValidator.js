const { validateResult } = require("./validateHelper");
const { param, body, check } = require("express-validator");

const customValidateVideo = (value, { req }) => {
  if (!req.file.fieldname === "video") {
    throw new Error("Video file is required");
  }

  return true;
};

const customValidateImage = (value, { req }) => {
  if (!req.file.fieldname === "image") {
    throw new Error("image file is required");
  }

  return true;
};

exports.validateImage = [
  body("image").custom(customValidateImage),
  body("caption")
    .notEmpty()
    .withMessage("The caption is required")
    .isLength({ min: 2 })
    .withMessage("The caption must has 2 or more characters"),
  body("taggedUsers")
    .notEmpty()
    .optional()
    .withMessage("The tagged user is required")
    .isLength({ min: 4 })
    .withMessage("The tagged user must has 4 or more characters"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

exports.validateVideo = [
  body("video").custom(customValidateVideo),
  body("caption")
    .notEmpty()
    .withMessage("The caption is required")
    .isLength({ min: 2 })
    .withMessage("The caption must has 2 or more characters"),
  body("taggedUsers")
    .notEmpty()
    .optional()
    .withMessage("The tagged user is required")
    .isLength({ min: 4 })
    .withMessage("The tagged user must has 4 or more characters"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

exports.valdiataUpdateImage = [
  param("_id").isMongoId().withMessage("Invalid id"),
  body("image").optional().custom(customValidateImage),
  body("caption")
    .optional()
    .notEmpty()
    .withMessage("The caption is required")
    .isLength({ min: 2 })
    .withMessage("The caption must has 2 or more characters"),
  body("taggedUsers")
    .notEmpty()
    .optional()
    .withMessage("The tagged user is required")
    .isLength({ min: 4 })
    .withMessage("The tagged user must has 4 or more characters"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

exports.valdiataUpdateVideo = [
  param("_id").isMongoId().withMessage("Invalid id"),
  body("video").optional().custom(customValidateVideo),
  body("caption")
    .optional()
    .notEmpty()
    .withMessage("The caption is required")
    .isLength({ min: 2 })
    .withMessage("The caption must has 2 or more characters"),
  body("taggedUsers")
    .notEmpty()
    .optional()
    .withMessage("The tagged user is required")
    .isLength({ min: 4 })
    .withMessage("The tagged user must has 4 or more characters"),
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
