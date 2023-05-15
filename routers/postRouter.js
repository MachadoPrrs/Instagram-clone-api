const express = require("express");
const UploadFiles = require("../uploadFiles/uploadFiles");

const uploadIMG = new UploadFiles("img").upload;
const uploadVIDEO = new UploadFiles("video").upload;

const {
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
  getPostById,
  getNewsFeed,
  likePost,
  removeLike,
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
router.get("/getFeed", protect, getNewsFeed);

router.post("/image", protect, uploadIMG.single("image"), createPost);
router.post("/video", protect, uploadVIDEO.single("video"), createPost);

router.get("/:_id", protect, validateGetById, getPostById);

router.patch(
  "/patchImage/:_id",
  protect,
  validateUpdatePost,
  uploadIMG.single("image"),
  updatePost
);

router.patch(
  "/patchVideo/:_id",
  protect,
  validateUpdatePost,
  uploadVIDEO.single("video"),
  updatePost
);

router.patch("/likePost/:_id", protect, likePost);

router.delete("/:_id", protect, validateDeletePost, deletePost);
router.delete("/likePost/:_id", protect, removeLike);

module.exports = router;
//! añadir validaciones de delete y crear post
