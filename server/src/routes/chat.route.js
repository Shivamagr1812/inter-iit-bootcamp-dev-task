const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary/cloudinaryConfig");
const path = require("path");
const {
  handleChat,
  handleChatWithFile,
} = require("../controllers/chat.controller");

const router = express.Router();

// Confing multer for storing file
const storage = new multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Preserve the original file extension
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: (req, file) => {
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);

//     return {
//       folder: "uploads",
//       public_id: `${name}-${Date.now()}`,
//       allowed_formats: ["jpg", "png", "jpeg", "pdf"],
//     };
//   },
// });

const upload = multer({ storage: storage });

router.post("/", handleChat);
router.post("/file", upload.single("file"), handleChatWithFile);

module.exports = router;
