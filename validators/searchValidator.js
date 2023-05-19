const { validateResult } = require("./validateHelper");
const { query } = require("express-validator");

exports.validateSearch = [
  query("s").notEmpty().withMessage("The term of search is required"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];
