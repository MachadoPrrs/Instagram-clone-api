const express = require("express");

const {
  commentPost,
  getAllComments,
} = require("../controllers/commentController");
const { protect } = require("../controllers/authController");

const router = express.Router();

// TODO: AGREGAR VALIDACIONES
router.get("/", protect, getAllComments);
router.post("/", protect, commentPost);

module.exports = router;
