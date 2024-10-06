const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();  // Ensure this loads your environment variables
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// POST endpoint to handle chat
app.post("/chat", async (req, res) => {
  try {
    const question = req.body.question; // Get the question from request body
    console.log(req.body);
    
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Call generateContent with the prompt directly as a string
    const result = await model.generateContent(question);
    
    // Access the text from the response
    const answer = result.response.text(); 
    res.json({ reply: answer });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET endpoint to stream responses (Optional streaming logic)
app.get("/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Simulate streaming by sending chunks
  res.write("data: Streaming response 1\n\n");
  setTimeout(() => {
    res.write("data: Streaming response 2\n\n");
  }, 1000);

  setTimeout(() => {
    res.write("data: End of stream\n\n");
    res.end();
  }, 2000);
});

// Allow CORS for specific origin (optional)
app.use(cors({
  origin: 'http://localhost:3000', // React app's URL
}));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
