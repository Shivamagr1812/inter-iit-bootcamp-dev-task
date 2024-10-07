const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware
const ChatMessage = require('../models/ChatMessage');

// Chat message route (protected by auth middleware)
router.post('/chat', auth, async (req, res) => {
    const { message } = req.body;

    const chatMessage = new ChatMessage({
        user: req.user, // req.user is populated by the auth middleware
        message,
        timestamp: new Date(),
    });

    await chatMessage.save();
    res.json({ success: true, chatMessage });
});

module.exports = router;
