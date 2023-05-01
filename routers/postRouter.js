const express = require("express");
const { getAllPosts, createPost } = require("../controllers/postController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/").get(protect, getAllPosts).post(protect, createPost);

module.exports = router;
