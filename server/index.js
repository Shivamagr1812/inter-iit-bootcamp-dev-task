const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const Chat = require('./models/Chat');

dotenv.config();
connectDB();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const app = express();
app.use(cors({
    origin: 'https://inter-iit-bootcamp-dev-task-frontend.vercel.app',
    methods: ['GET', 'POST'],
    credentials: true,
}));

app.use(express.json());
app.get('/', (req, res) => res.send('API is running...'));
app.use("/api/auth", authRoutes);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
// Initialize multer for file uploads
const upload = multer({ dest: 'uploads/' });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // Initial retry delay of 2 seconds

// Function to generate AI response with exponential backoff
async function generateResponseWithRetry(model, fullMessage, retries = MAX_RETRIES, delay = RETRY_DELAY) {
    try {
        const result = await model.generateContent(fullMessage);
        const response = await result.response;
        return await response.text();
    } catch (error) {
        if (error.message.includes("429") && retries > 0) {
            console.warn('Rate limit exceeded. Retrying in ' + delay + ' ms...');
            await new Promise(resolve => setTimeout(resolve, delay));
            return generateResponseWithRetry(model, fullMessage, retries - 1, delay * 2); // Exponential backoff
        } else {
            throw error; // Rethrow error if not a 429 or no retries left
        }
    }
}

// Chat endpoint
app.post("/chat", upload.single('file'), async (req, res) => {
    const { message } = req.body;
    let fullMessage = message || ''; // Start with the message from the user

    // If a file is uploaded, read its content
    if (req.file) {
        const filePath = path.join(__dirname, req.file.path);
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            fullMessage += `\n\nFile content:\n${fileContent}`;
        } catch (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: "Failed to read uploaded file" });
        }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        const text = await generateResponseWithRetry(model, fullMessage);
        
        // Save the chat to the database
        await Chat.create({ userMessage: fullMessage, aiResponse: text });
        
        res.json({ reply: text });
    } catch (error) {
        console.error("Error generating AI response:", error);
        res.status(500).json({ error: "Failed to generate response" });
    } finally {
        // Clean up: delete the uploaded file
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
