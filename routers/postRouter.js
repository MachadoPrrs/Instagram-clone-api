const express = require("express");

const {
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
  getPostById,
} = require("../controllers/postController");

const { protect } = require("../controllers/authController");

const {
  validateDeletePost,
  validateCreatePost,
  validateUpdatePost,
  validateGetById,
} = require("../validators/postValidator");

const router = express.Router();

router.get("/", protect, getAllPosts);
router.post("/", protect, validateCreatePost, createPost);

router.get("/:_id", protect, validateGetById, getPostById);

router.patch("/:_id", protect, validateUpdatePost, updatePost);
router.delete("/:_id", protect, validateDeletePost, deletePost);

module.exports = router;
