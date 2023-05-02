const express = require("express");

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
} = require("../validators/userValidator");
const { updateMe, deleteMe } = require("../controllers/userController");

const router = express.Router();

// router.route("/signup").post(signup);.
router.post("/signup", validateCreate, signup);
router.post("/login", validateLogin, login);
router.get("/logout", logout);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.patch("/updateMyPassword", protect, updatePassword);
router.patch("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);
module.exports = router;
