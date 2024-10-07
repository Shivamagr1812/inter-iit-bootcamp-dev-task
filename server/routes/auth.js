// auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

const router = express.Router();

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

//Registration
router.post('/register', async (req, res) => {
	const { username, email, password, dob } = req.body;

	try {
		//existing user
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: 'Username already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			dob,
		});
		await newUser.save();
		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		console.error('Registration Error:', error);
		if (error.code === 11000) {
			return res.status(400).json({ error: 'Email already in use' });
		}
		res
			.status(500)
			.json({ error: 'Registration failed. Please try again later.' });
	}
});

// User Login
router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: '3h',
		});
		res.cookie('token', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'Strict',
			maxAge: 10800000,
		});
		res.status(200).json({
			message: 'Login successful',
			user: { username: user.username, email: user.email },
		});
	} catch (error) {
		res.status(500).json({ error: 'Login failed' });
	}
});

// User Logout
router.post('/logout', (req, res) => {
	res.clearCookie('token');
	res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
