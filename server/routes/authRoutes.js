const { Router } = require('express');
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = Router();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.jwtsecret;

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate the request body
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    // Check if the user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({ msg: 'Password is too short' });
    }

    // Create and save the new user
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userDoc = await User.create({
      email,
      password: hashedPassword,
    });

    // Optionally, you can return the new user document without the password
    const { password: _, ...userData } = userDoc.toObject(); // Remove password from response
    res.status(201).json(userData); // Respond with the newly created user (201 Created)

  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ msg: 'Internal Server Error', error });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      // Logged in
      jwt.sign({ email, id: userDoc._id }, secret, { expiresIn: "3d" }, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json({
          msg: "Logged in successfully",
          id: userDoc._id,
          email,
          token
        });
      });
    } else {
      res.status(400).json({ msg: 'Wrong credentials' });
    }
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ msg: 'Internal Server Error', error });
  }
});

router.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

module.exports = router;
