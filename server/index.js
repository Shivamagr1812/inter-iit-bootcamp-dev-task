import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./db/connectToMongoDB.js";
import protectRoute from "./middleware/protectRoute.js";
import { login, signup, logout } from "./functions/authFunction.js";
import { chat } from "./functions/textGeneration.js";
import { getChatHistory } from "./functions/getChatHistory.js";
dotenv.config();



// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

// POST endpoint to handle chat
app.post("/chat", chat);

// GET endpoint to handle chat
app.get("/stream", getChatHistory);

app.post("/auth/login", login);
app.post("/auth/signup", signup);
app.post("/auth/logout", logout);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT}`);
});
