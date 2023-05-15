const express = require("express");

const UploadFiles = require("../uploadFiles/uploadFiles");

const {
  sendMessage,
  deleteMessage,
} = require("../controllers/messageController");
const { protect } = require("../controllers/authController");

const uploadIMG = new UploadFiles("messageImg").upload;
const uploadVIDEO = new UploadFiles("messageVd").upload;

const router = express.Router();

router.post("/image", protect, uploadIMG.single("image"), sendMessage);
router.post("/video", protect, uploadVIDEO.single("video"), sendMessage);
router.delete("/:_id", protect, deleteMessage);

module.exports = router;
//! agregar validaciones
