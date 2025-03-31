const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.register = async (req, res) => {
    const { username, password } = req.body;
    console.log("Register request received with username:", username); // Log for debugging
    console.log("Register request received with password:", password); // Log for debugging

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered" });
        console.log("User registration successful");
    } catch (error) {
        console.error("Error registering user:", error);

        if (error.code === 11000) {  // MongoDB duplicate key error code
            res.status(409).json({ message: "Username already exists" });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};

// Login User
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
