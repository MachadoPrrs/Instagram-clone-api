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
  validateImage,
  valdiataUpdateImage,
  verifyID,
  validateVideo,
  valdiataUpdateVideo,
} = require("../validators/postValidator");

const router = express.Router();
// GET ALL USERS
router.get("/", protect, getAllPosts);
// GET FEED
router.get("/getFeed", protect, getNewsFeed);
// POST WITH IMAGE
router.post(
  "/image",
  protect,
  uploadIMG.single("image"),
  validateImage,
  createPost
);
// POST WITH VIDEO
router.post(
  "/video",
  protect,
  uploadVIDEO.single("video"),
  validateVideo,
  createPost
);
// GET A POST BY ID
router.get("/:_id", protect, verifyID, getPostById);
// UPDATE A POST WITH IMAGE
router.patch(
  "/patchImage/:_id",
  protect,
  valdiataUpdateImage,
  uploadIMG.single("image"),
  updatePost
);
// UPDATE A POST WITH VIDEO
router.patch(
  "/patchVideo/:_id",
  protect,
  valdiataUpdateVideo,
  uploadVIDEO.single("video"),
  updatePost
);
// LIKE POST
router.patch("/likePost/:_id", protect, verifyID, likePost);
// DELETE POST
router.delete("/:_id", protect, verifyID, deletePost);
// DELETE LIKE
router.delete("/likePost/:_id", protect, verifyID, removeLike);

module.exports = router;
