const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); 
const { GoogleGenerativeAI } = require("@google/generative-ai");
const https = require("https")

const app = express();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/chat", async (req, res) => {
  try {
    const question = req.body.question; 
    console.log(req.body);
    
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    //  prompt directly as a string
    const result = await model.generateContent(question);
    
    
    const answer = result.response.text(); 
    res.json({ reply: answer }); 
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Streaming response
app.get('/stream-chat', async (req, res) => {
  try {
    const question = req.query.question; 

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    const result = await model.generateContent(question);

    const streamResponse = result.response.text().split(' ');
    for (let i = 0; i < streamResponse.length; i++) {
      res.write(streamResponse[i]);
      res.write(' ');
      await new Promise((resolve) => setTimeout(resolve, 200)); 
    }

    res.end();
  } catch (error) {
    console.error('Error during streaming:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
