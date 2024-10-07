const express = require("express");
const router = express.Router();
const { handleChat } = require("../controllers/chatController");

// POST endpoint for chat
router.post("/", handleChat);

// Placeholder for GET endpoint to stream responses (not implemented yet)
router.get("/stream", (req, res) => {
  // TODO: Implement streaming functionality
});

module.exports = router;
