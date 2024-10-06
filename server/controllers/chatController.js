const { groq } = require('../config/config');

// Function to interact with the Groq API and get chat completion
const getGroqChatCompletion = async (userInput) => {
  return await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: userInput,
      },
    ],
    model: "llama3-8b-8192",  // Groq model
  });
};

const chatHandler = async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('Incoming /chat request:', userInput);

    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Call Groq API to get the chat completion
    const response = await getGroqChatCompletion(userInput);

    // Extract content from the response
    const content = response?.choices?.[0]?.message?.content;
    
    if (!content) {
      return res.status(500).json({ error: 'Failed to get chat response' });
    }

    // Send all data at once to the client
    res.status(200).json({ message: content });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { chatHandler };
