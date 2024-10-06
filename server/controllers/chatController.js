const groq = require('../config/config');
const streamResponse = require('../utils/streamResponse');

// Controller function to handle chat requests
async function getGroqChatCompletion(req, res) {
  const userInput = req.body?.userInput;

  if (!userInput) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Whenever you provide code in your responses but not text, always specify the programming language after the opening triple backticks (```), like ` ```python `, ` ```cpp `, etc."
        },
        {
          role: "user",
          content: userInput,  // Use the input received from the client
        }
      ],
      model: "llama3-8b-8192",
      stream: true,
    });

    res.setHeader('Content-Type', 'text/plain'); // Set content type for streaming
    await streamResponse(chatCompletion, res); // Stream response to the client
  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { getGroqChatCompletion };
