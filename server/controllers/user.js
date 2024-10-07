const User = require("../models/User");
const logger = require("../utils/logger");
const bcrypt = require("bcryptjs"); // Uncomment if using bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Uncomment if using JWT for token creation
require("dotenv").config();

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Create a new user
    // const user = new User({ username, email, password }); // Save hashed password
    console.log("req.body:", req.body); // Debugging log

    const user = await User.create({ username, email, password }); 
    console.log("New user created:", user); // Debugging log

    res.status(201).json({ userId: user._id, username: user.username });
  } catch (err) {
    logger.error(err); // Log the error for debugging
    res.status(500).json({ error: "Server error, unable to register" });
  }
};

// Login route
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password); // Ensure password is hashed
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create a JWT token (ensure you have the user.createJWT() method defined)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // Set token expiration
    });

    // Set the token as a cookie with security options
    res.cookie("token", token, {
      httpOnly: true, // Inaccessible to JavaScript on the frontend
      secure: true, // Enable secure in production
      sameSite: 'None', // Prevents CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // Set cookie to expire in 1 day
    });

    res.status(200).json({ userId: user._id, username: user.username });
  } catch (err) {
    logger.error(err); // Log the error for debugging
    res.status(500).json({ error: "Server error, unable to login" });
  }
};

// Get user
const getUser = async (req, res) => {
  try {
    const userID = req.user.userId
    const user = await User.findOne({ _id : userID }); 
    console.log("Fetched users:", user); 
    console.log(user.username);
    res.status(200).json({ username: user.username });
  } catch (err) {
    logger.error(err); 
    res.status(500).json({ error: "Server error, unable to fetch users" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser
};
