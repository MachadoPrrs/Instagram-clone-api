const express = require("express");

const {
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
} = require("../controllers/postController");

const { protect } = require("../controllers/authController");

const {
  validateDeletePost,
  validateCreatePost,
  validateUpdatePost,
} = require("../validators/postValidator");

const router = express.Router();

//TODO AGREGAR VALIDACIONES
router.get("/", protect, getAllPosts);
router.post("/", protect, validateCreatePost, createPost);

router.patch("/:_id", protect, validateUpdatePost, updatePost);
router.delete("/:_id", protect, validateDeletePost, deletePost);

module.exports = router;
