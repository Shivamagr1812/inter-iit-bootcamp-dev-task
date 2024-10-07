const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User"); // Adjust the path as needed

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function registerTest() {
    const username = "testuser";
    const password = "password123";

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        console.log("User registered successfully");
    } catch (error) {
        console.error("Error registering user:", error);
    } finally {
        mongoose.connection.close();
    }
}

registerTest();
