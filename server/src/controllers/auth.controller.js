const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const handleSignup = (req, res) => {
  console.log("Signing up...");
  const { name, email, password } = req.body;

  // If required credentials not present
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Credentials required" });
  }

  // Hash the password and store
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({ msg: "Error occured while signing up" });
    }

    // Create User with provided credentials
    await User.create({
      name,
      email,
      password: hash,
    })
      .then(() => {
        res.status(201).json({ msg: "User created successfully" });
      })
      .catch((err) => {
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
    return res.status(400).json({ msg: "Credentials required" });
  }

  // Find User using email
  const user = await User.findOne({ email });

  // If no User found
  if (!user) {
    return res.status(404).json({ msg: "Incorrect Credentials" });
  }
  // Check for password correctness
  else {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ msg: "Error occured while signing in" });
      }

      // Incorrect password provided
      if (!result) {
        return res.status(404).json({ msg: "Password is incorrect" });
      }
      // Correct credentials
      else {
        // Cookie to manage login state
        const authToken = jwt.sign(email, process.env.JWT_TOKEN_SECRET);

        return res
          .cookie("authToken", authToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
          })
          .status(200)
          .json({ msg: "Logged in successfully" });
      }
    });
  }
};

module.exports = { handleSignup, handleLogin };
