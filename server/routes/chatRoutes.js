const express = require('express');
const { getGroqChatCompletion } = require('../controllers/chatController');

const router = express.Router();

// Define chat route
router.post('/chat', getGroqChatCompletion);

module.exports = router;

