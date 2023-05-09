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
router.delete("/:_id", protect, validateDeletePost, deletePost);

module.exports = router;
