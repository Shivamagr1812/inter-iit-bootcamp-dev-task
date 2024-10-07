const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require('multer');
require("dotenv").config();
const axios = require("axios");
const path = require('path');
const User = require('./models/User.js');
const mongoose = require('mongoose');
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const jwt = require("jsonwebtoken");

const app = express();

// Enable CORS for the frontend URL specified in environment variables
app.use(cors({
  origin: [process.env.FRONTEND], // Allow requests from frontend URL
  credentials: true, // Include credentials like cookies
  methods: ["GET", "POST"] // Allow specific HTTP methods
}));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Parse incoming JSON request bodies
app.use(bodyParser.json());

// Connect to MongoDB using the connection string in environment variables
mongoose.connect(process.env.MONGO_CONNECT);

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filenames with timestamp
  },
});

let clientToken; // Variable to store client token

// Middleware function to check if the user is logged in based on the token
const checkLogin = async () => {
  try {
    if (clientToken) {
      // Decode the token and verify using JWT_SECRET_KEY
      const decoded = await jwt.verify(clientToken, process.env.JWT_SECRET_KEY);
      // Find user in the database using decoded email
      const user = await User.findOne({ email: decoded.email });
      if (user) {
        return decoded.email;
      }
    }
  } catch (error) {
    console.error('Error verifying token:', error);
  }
};

// Initialize multer with storage configuration
const upload = multer({ storage });

// Function to generate AI response based on the question and media file
async function generate(question, mediaPath) {
  const fileManager = new GoogleAIFileManager(process.env.API_KEY);

  // Upload the media file to Google AI file manager
  const uploadResult = await fileManager.uploadFile(
    `${mediaPath}`,
    {
      mimeType: "image/jpeg",
      displayName: " ", 
    },
  );

  // Initialize Google Generative AI model
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  // Generate AI response using the question and uploaded file
  const result = await model.generateContent([
    question,
    {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      },
    },
  ]);

  let output = result.response.text(); // Get the AI response text

  let check = await checkLogin(); // Verify login status

  // If user is logged in, save conversation to user's history
  if (check) {
    let conversation = [{
      role: 'user',
      content: `${question}` + ` (File Uploaded)`
    }, {
      role: 'AI',
      content: output
    }];
    await User.findOneAndUpdate(
      { email: check },
      { $push: { history: { $each: conversation } } },
    );
  }

  return output; // Return AI response
}

// Function to generate AI response based on the question only (no file)
async function askquestion(question) {
  const response = await axios({
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.API_KEY}`,
    method: "post",
    data: {
      "contents": [{
        "parts": [
          { "text": question }
        ]
      }]
    },
  });

  let output = response["data"]["candidates"][0]["content"]["parts"][0]["text"]; // Extract AI response text

  let check = await checkLogin(); // Verify login status

  // If user is logged in, save conversation to user's history
  if (check) {
    let conversation = [{
      role: 'user',
      content: `${question}`
    }, {
      role: 'AI',
      content: output
    }];
    await User.findOneAndUpdate(
      { email: check },
      { $push: { history: { $each: conversation } } },
    );
  }

  return output; // Return AI response
}

// POST endpoint for chat requests
app.post("/chat", upload.single('image'), async (req, res) => {
  try {
    const { question } = req.body;
    clientToken = req.body.clientToken; // Retrieve client token from request body
    
    let relativePath = '';
    if (req.file) {
      relativePath = `./${req.file.path}`; // Get relative path of the uploaded file
    }

    // Generate response based on whether a file was uploaded
    let result = relativePath ? await generate(question, relativePath) : await askquestion(question);

    res.status(200).json({
      status: true,
      answer: result
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "An unknown error occurred"
    });
  }
});

// POST endpoint for user sign-in
app.post('/signin', async (req, res) => {
  try {
    let { email } = req.body;
    let findemail = await User.findOne({ email: email });

    // If the email is not found, create a new user
    if (!findemail) {
      await User.create({ email: email });
    }
    // Sign a JWT token using the user's email
    let token = jwt.sign({ email }, process.env.JWT_SECRET_KEY);

    res.json({ message: "Signed Up successfully", status: true, token: token });
  } catch (error) {
    res.json({ message: "Error in Sign Up", status: false });
  }
});

// GET endpoint to retrieve chat conversation based on client token
app.get("/stream/:clientToken", async (req, res) => {
  try {
    clientToken = req.params.clientToken;
    let email = await checkLogin(); // Verify login

    let user = await User.findOne({ email: email });
    res.json({
      conversation: user.history, // Return user's chat history
      status: true
    });
  } catch (error) {
    res.json({
      error: error
    });
  }
});

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
