const express = require("express");
const { chatHandler } = require("../controllers/chatController");

const router = express.Router();

// Define the /chat route and connect to the chat handler
router.post('/chat', chatHandler);

module.exports = router;
