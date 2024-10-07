const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMIddleware');


const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route to get current user
router.get('/me', protect, getMe);

module.exports = router;
