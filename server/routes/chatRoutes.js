const express = require('express');
const { fetchChats, pushChat, fetchChatById } = require('../controllers/chatController');
const { protect } = require('../middleware/authMIddleware');

const router = express.Router();

// Apply the protect middleware to all chat routes
router.use(protect);

// Route to fetch all chats for the authenticated user
router.get('/chats', fetchChats);

router.get('/chats/:chatId', fetchChatById);

// Route to push a new chat message for the authenticated user
router.post('/chats', pushChat);

module.exports = router;
