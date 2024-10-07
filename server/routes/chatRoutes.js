const express = require('express');
const { getGroqChatCompletion } = require('../controllers/chatController');
const upload = require("../middlewares/upload");
const router = express.Router();

// Define chat route
router.post('/chat/:userId', upload.single('file'),getGroqChatCompletion);

module.exports = router;

