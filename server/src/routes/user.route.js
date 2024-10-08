const express = require("express");
const { handleSendChatHistory } = require("../controllers/user.controller");

const router = express.Router();

router.get("/chatHistory", handleSendChatHistory);

module.exports = router;
