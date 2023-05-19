const express = require("express");

const UploadFiles = require("../uploadFiles/uploadFiles");

const {
  sendMessage,
  deleteMessage,
} = require("../controllers/messageController");
const { protect } = require("../controllers/authController");
const {
  validateMessageImg,
  verifyID,
  validateMessageVd,
} = require("../validators/messageValidator");

const uploadIMG = new UploadFiles("messageImg").upload;
const uploadVIDEO = new UploadFiles("messageVd").upload;

const router = express.Router();

router.post(
  "/image",
  protect,
  uploadIMG.single("image"),
  validateMessageImg,
  sendMessage
);
router.post(
  "/video",
  protect,
  uploadVIDEO.single("video"),
  validateMessageVd,
  sendMessage
);
router.delete("/:_id", protect, verifyID, deleteMessage);

module.exports = router;
