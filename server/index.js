const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const ChatM = require('./models/Chat'); 
const User = require('./models/User');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));


app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;


  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }


    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ message: 'Login successful', token, username: user.username }); 
});


app.post('/api/chat', async (req, res) => {
  const { user, prompt } = req.body;

  console.log('Request received:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    user: user,
  });

  if (!user || !prompt) {
    return res.status(400).json({ error: 'User and prompt are required' });
  }

  try {

    const foundUser = await User.findOne({ username: user });
    if (!foundUser) {
      return res.status(404).json({ error: 'User not found' });
    }

   
    const chatHistory = await ChatM.find({ username: foundUser.username }).sort({ timestamp: 1 });
    console.log('Fetched chat history:', chatHistory);

    
    let history = [];
    if (chatHistory.length > 0) {
      history = chatHistory.flatMap(chat => ([
        { role: "user", parts: [{ text: chat.prompt }] },
        { role: "model", parts: [{ text: chat.response }] }
      ]));
    }

    
    const chat = model.startChat({ history });

    const result = await chat.sendMessage(prompt);
    const aiResponse = result.response ? result.response.text().trim() : '';

   
    const chatInstance = new ChatM({
      username: foundUser.username,
      prompt,
      response: aiResponse,
    });
    await chatInstance.save();

    console.log('AI response:', aiResponse);
    res.end(aiResponse); 

  } catch (error) {
    console.error('Error with AI model:', error);
    res.status(500).json({ error: 'Error communicating with the AI model' });
  }
});


app.get('/api/chat/history/:user', async (req, res) => {
  const { user } = req.params;

  if (!user) {
    return res.status(400).json({ error: 'User is required' });
  }

  try {
    const foundUser = await User.findOne({ username: user });
    if (!foundUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const chatHistory = await ChatM.find({ username: foundUser.username }).sort({ timestamp: 1 });

    if (chatHistory.length === 0) {
      return res.status(200).json({ message: 'No chat history found', history: [] });
    }

    const formattedHistory = chatHistory.map(chat => ({
      userMessage: chat.prompt,
      aiResponse: chat.response,
      timestamp: chat.timestamp,
    }));

    console.log('Fetched chat history for user:', foundUser.username, formattedHistory);
    res.status(200).json({ history: formattedHistory });

  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to load chat history' });
  }
});

// File upload route
app.post('/api/file', upload.single('files'), async (req, res) => {
  console.log(req.file, req.body);

  const { user, prompt } = req.body;

  
  if (!prompt || !user) {
    return res.status(400).json({ error: 'User and prompt are required' });
  }

  try {
    const foundUser = await User.findOne({ username: user });
    if (!foundUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const chatHistory = await ChatM.find({ username: foundUser.username }).sort({ timestamp: 1 });
    console.log('Fetched chat history:', chatHistory);

    
    let history = [];
    if (chatHistory.length > 0) {
      history = chatHistory.flatMap(chat => ([
        { role: "user", parts: [{ text: chat.prompt }] },
        { role: "model", parts: [{ text: chat.response }] }
      ]));
    }

    const chat = model.startChat({ history });

    if (req.file) {
      const uploadResult = await fileManager.uploadFile(req.file.path, {
        mimeType: req.file.mimetype,
        displayName: req.file.originalname,
      });
      console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);

    
      const result = await model.generateContent([prompt, {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimetype,
        },
      }]);

      const aiResponse = result.response.text().trim();
      const chatInstance = new ChatM({
        username: user,
        prompt,
        response: aiResponse,
      });
      await chatInstance.save();

      console.log('AI response:', aiResponse);
      return res.json({ message: result.response.text() });
    } else {
      return res.status(400).json({ error: 'File not uploaded' });
    }
  } catch (error) {
    console.error('Error with Google Gemini API:', error);
    return res.status(500).json({ error: 'Error communicating with Google Gemini API' });
  }
});

// Audio file upload route
app.post('/api/audio', upload.single('files'), async (req, res) => {
  console.log(req.file, req.body);

  const { user, prompt } = req.body;

  if (!user || !prompt) {
    return res.status(400).json({ error: 'User and prompt are required' });
  }

  try {
    if (req.file) {
      const uploadResult = await fileManager.uploadFile(req.file.path, {
        mimeType: req.file.mimetype,
        displayName: req.file.originalname,
      });

      const promptToUse = prompt || 'reply to this audio'; 

      const result = await model.generateContent([promptToUse, {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimetype,
        },
      }]);

      const aiResponse = result.response.text().trim();

      const chatInstance = new ChatM({
        username: user,
        prompt: promptToUse,
        response: aiResponse,
      });

      await chatInstance.save();
      console.log('AI response:', aiResponse);

      return res.json({ message: aiResponse });
    } else {
      return res.status(400).json({ error: 'Audio file not uploaded' });
    }
  } catch (error) {
    console.error('Error with audio processing:', error);
    return res.status(500).json({ error: 'Error processing audio file' });
  }
});


app.delete('/api/chat', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      return res.status(404).json({ error: 'User not found' });
    }

   
    const deleteResult = await ChatM.deleteMany({ username: foundUser.username });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: 'No chat history found to delete' });
    }

    res.status(200).json({ message: `Successfully deleted ${deleteResult.deletedCount} chat(s)` });

  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chat history' });
  }
});




app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
