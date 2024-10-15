const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const handleSignup = async (req, res) => {
  console.log("Signing up...");
  const { name, email, password } = req.body;

  // If required credentials not present
  if (!name || !email || !password) {
    console.log("Credentials not provided for signup");
    return res.status(400).json({ msg: "Credentials required !" });
  }

  // Check for already registered user with email
  const user = await User.findOne({ email });

  if (user) {
    console.log("Already registered user found with provided email");
    return res.status(400).json({ msg: "User already registered with email" });
  }

  // Hash the password and store user
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      console.log("Error occured while hashing password");
      return res.status(500).json({ msg: "Error occured while signing up" });
    }

    // Create User with provided credentials
    await User.create({
      name,
      email,
      password: hash,
    })
      .then(() => {
        console.log("User signup successfull");
        res.status(201).json({ msg: "User registered successfully" });
      })
      .catch((err) => {
        console.log("Error occured in creating new user");
        res
          .status(500)
          .json({ msg: "Error occured while signing up", err: err });
      });
  });
};

const handleLogin = async (req, res) => {
  console.log("Logging in...");
  const { email, password } = req.body;

  // Credentials not provided
  if (!email || !password) {
    console.log("Credentials not provided for login");
    return res.status(400).json({ msg: "Credentials required" });
  }

  // Find User using email
  const user = await User.findOne({ email });

  // If no User found
  if (!user) {
    console.log("User not found with provided email");
    return res.status(404).json({ msg: "Incorrect credentials provided" });
  }

  // Check for password correctness
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      console.log("Error occured in comparing the password");
      return res.status(500).json({ msg: "Error occured while logging in" });
    }

    // Incorrect password provided
    if (!result) {
      console.log("Incorrect password provided for login");
      return res.status(404).json({ msg: "Password is incorrect" });
    }
    // Correct credentials
    // Cookie to manage login state
    const authToken = jwt.sign(email, process.env.JWT_TOKEN_SECRET);

    console.log("Logged in successfully");

    return res
      .cookie("authToken", authToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
        domain: ".gptee-steel.vercel.app/",
      })
      .status(200)
      .json({ msg: "Logged in successfully" });
  });
};

const handleLogout = (req, res) => {
  console.log("Logging out");
  const authToken = req.cookies.authToken;

  if (!authToken) {
    return res.status(400).json({ msg: "Login first to logout" });
  }

  res
    .clearCookie("authToken")
    .status(200)
    .json({ msg: "Logged out successfully" });
};

module.exports = { handleSignup, handleLogin, handleLogout };
