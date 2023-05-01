const express = require("express");

const { signup, login, logout } = require("../controllers/authController");
const {
  validateCreate,
  validateLogin,
} = require("../validators/userValidator");

const router = express.Router();

// router.route("/signup").post(signup);.
router.post("/signup", validateCreate, signup);
router.post("/login", validateLogin, login);
router.get("/logout", logout);

module.exports = router;
