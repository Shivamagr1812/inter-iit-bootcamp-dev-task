const { generateResponse } = require("../services/aiService");

const handleChat = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const aiResponse = await generateResponse(prompt);
    res.json({ response: aiResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { handleChat };
