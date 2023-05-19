const express = require("express");

const {
  commentPost,
  getAllComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../controllers/authController");

const {
  verifyID,
  validateComment,
  validateUpdate,
} = require("../validators/commentValidator");

const router = express.Router();

router.get("/", protect, getAllComments);
router.post("/", protect, validateComment, commentPost);
router.patch("/:_id", protect, validateUpdate, updateComment);
router.delete("/:_id", protect, verifyID, deleteComment);

module.exports = router;
