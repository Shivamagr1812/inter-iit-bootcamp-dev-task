const { generateResponse } = require("../services/aiService");
const path = require('path');

const handleChat = async (req, res) => {
    const { prompt } = req.body;

    // Get the uploaded file path if available
    const file = req.file; // This will contain the uploaded file object from multer

    // Ensure that a prompt is provided
    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        // If a file is uploaded, get its path
        const filePath = file ? path.join(__dirname, '../', file.path) : null;

        const aiResponse = await generateResponse(prompt, filePath); // Pass the prompt and file path
        res.json({ response: aiResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { handleChat };
