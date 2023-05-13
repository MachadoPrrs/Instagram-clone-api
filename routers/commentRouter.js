const express = require("express");

const {
  commentPost,
  getAllComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../controllers/authController");

const router = express.Router();

// TODO: AGREGAR VALIDACIONES
router.get("/", protect, getAllComments);
router.post("/", protect, commentPost);
router.patch("/:_id", protect, updateComment);
router.delete("/:_id", protect, deleteComment);

module.exports = router;
