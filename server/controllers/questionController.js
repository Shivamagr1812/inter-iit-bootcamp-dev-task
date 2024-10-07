





const { GoogleGenerativeAI } = require('@google/generative-ai');

// Async function to handle the question
const askQuestion = async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Invalid question provided.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(question);
    const aiResponse = result.response.text();
    // console.log(`Question: ${question}`);
    // console.log(`AI Response: ${aiResponse}`);

    // Send the AI response back to the frontend
    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to get a response from the API.' });
  }
};

module.exports = { askQuestion };
