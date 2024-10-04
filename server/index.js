const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();


const { GoogleGenerativeAI } = require('@google/generative-ai');
// Initialize the Gemini AI Client with API Key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);


// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

async function run(prompt) {
  const text = " (Please note that you are being used as an API in a chat application with limited features. Provide simple and straightforward responses to prompts to ensure they can be easily parsed into JSON.)";
  const finalPrompt = prompt + text;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(finalPrompt );
    const response = await result.response;
    const text = await response.text();  // Ensure to await text() since it returns a promise
    
    // Format the text to improve readability
    const formattedText = text
      .replace(/(\*\*|__)(.*?)\1/g, '$2')  // Bold text
      .replace(/\*(.*?)\*/g, '$1')  // Italics
      .replace(/\n/g, ' ');  // Line breaks
    
    return formattedText; // Return formatted text
} catch (error) {
    console.error("Error generating response:", error);
    throw new Error("Failed to generate response");
}
}

// POST endpoint to handle chat
app.post("/chat", async (req, res) => {
  // TODO: Implement the chat functionality
  const { prompt } = req.body;

  if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
  }

  // Call the AI model to generate a response
  run(prompt)
      .then((aiResponse) => {
          res.json({ response: aiResponse });
      })
      .catch((error) => {
          res.status(500).json({ error: error.message });
      });
});

// GET endpoint to handle chat
app.get("/stream", async (req, res) => {
  // TODO: Stream the response back to the client
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
