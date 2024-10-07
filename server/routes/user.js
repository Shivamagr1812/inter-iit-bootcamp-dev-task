const express = require("express");
const router = express.Router();
const { registerUser,getUser, loginUser } = require("../controllers/user");
const authenticateUser = require("../middleware/user");
// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);
router.get("/",authenticateUser, getUser);


module.exports = router;
