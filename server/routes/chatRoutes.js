const express = require('express');
const { chatHistory, stream, chat, uploaded } = require('../controllers/chat');
const chatRouter = express.Router();
const multer = require("multer");
const upload = multer({
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
  }); // Set a file size limit

chatRouter.get('/chat-history/:emailId',chatHistory)
chatRouter.get('/stream',stream)
chatRouter.post('/chat', upload.single('file'),chat)
chatRouter.post('/upload', upload.single('file'),uploaded)


module.exports = chatRouter;