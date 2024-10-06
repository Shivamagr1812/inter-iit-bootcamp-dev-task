const express = require("express");
const handleStream = require("../controllers/stream.controller");

const router = express.Router();

router.post("/", handleStream);

module.exports = router;
