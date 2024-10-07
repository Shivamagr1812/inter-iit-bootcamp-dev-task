const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const Chat = require('./models/Chat');  // Import Chat model

dotenv.config();
connectDB();

const app = express();
app.use(cors()); // Ensures your frontend can access the backend
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);

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
