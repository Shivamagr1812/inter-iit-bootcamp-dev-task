const express = require("express");
const router = express.Router();
const { deleteChat, stream, uploadFile, getAllChats } = require("../controllers/chat");
const authenticateUser = require("../middleware/user");
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
  });
  
// Route for streaming
router.post("/",authenticateUser, stream);
router.get("/",authenticateUser, getAllChats);

// Route for file upload
router.post('/upload', authenticateUser,upload.single('file'), uploadFile);

// Route for deleting a chat
router.delete("/",authenticateUser, deleteChat);

module.exports = router;
