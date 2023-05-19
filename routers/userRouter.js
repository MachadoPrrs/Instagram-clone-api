const express = require("express");
const UploadFiles = require("../uploadFiles/uploadFiles");

const uploadIMG = new UploadFiles("users").upload;

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require("../controllers/authController");

const {
  validateCreate,
  validateLogin,
  validateForgotPassword,
  validateUpdatePassword,
  validateResetPassword,
  validateMe,
  validateDeleteUser,
} = require("../validators/userValidator");

const {
  updateMe,
  deleteMe,
  following,
} = require("../controllers/userController");

const { loginLimiter, createAccountLimiter } = require("../utils/rateLimit");

const router = express.Router();

router.patch("/follow", protect, following);
router.post("/signup", createAccountLimiter, validateCreate, signup);
router.post("/login", loginLimiter, validateLogin, login);
router.get("/logout", logout);

router.post("/forgotPassword", validateForgotPassword, forgotPassword);

router.patch("/resetPassword/:token", validateResetPassword, resetPassword);

router.patch(
  "/updateMyPassword",
  protect,
  validateUpdatePassword,
  updatePassword
);

router.patch(
  "/updateMe",
  protect,
  validateMe,
  uploadIMG.single("profilePicture"),
  updateMe
);

router.delete("/deleteMe", protect, deleteMe);

module.exports = router;
