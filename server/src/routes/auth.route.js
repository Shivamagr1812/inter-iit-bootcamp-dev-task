const express = require("express");
const {
  handleSignup,
  handleLogin,
  handleLogout,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.get("/logout", handleLogout);

module.exports = router;
