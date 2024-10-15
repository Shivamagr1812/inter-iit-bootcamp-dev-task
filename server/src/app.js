const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Access routes
const chatRoute = require("./routes/chat.route");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
// const streamRoute = require("./routes/stream.route");

// Initialize express app
const app = express();
// Middlewares
const corsOptions = {
  origin: process.env.CLIENT_URL,
  method: "GET, POST, PUT, PATCH, DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoute);
app.use("/chat", chatRoute);
app.use("/user", userRoute);
app.get("/test", (req, res) => {
  console.log("Test route is working fine");
  res.status(200).json({ msg: "This is a test response from server" });
});
// app.use("/stream", streamRoute);

module.exports = app;
