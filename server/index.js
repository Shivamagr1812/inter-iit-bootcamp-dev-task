const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require('mongoose');

// Create an instance of Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only text and PDF files are allowed.'));
    }
  }
});

// Database connection
mongoose.connect('mongodb://localhost/27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Google AI Model Initialization
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Import routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

// Use authentication routes
app.use('/api/auth', authRoutes);

// Use chat routes
app.use('/api/chat', chatRoutes);

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const question = req.body.question; 
    console.log(req.body);
    
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const result = await model.generateContent(question);
    const answer = result.response.text(); 
    res.json({ reply: answer }); 
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// File upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const fileContent = req.file.buffer.toString();
    // Integrate file content into chat context
    const result = await model.generateContent(fileContent);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Something went wrong with file processing" });
  }
});

// Streaming response endpoint
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
