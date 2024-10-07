const groq = require('../config/config');
const streamResponse = require('../utils/streamResponse');
const textExtractionService = require('../utils/textExtraction');
// Controller function to handle chat requests
async function getGroqChatCompletion(req, res) {
  const userInput = req.body?.userInput;

  if (!userInput) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const uploadedFile = req.file; // Access the uploaded file if it exists
  console.log('Incoming /chat req:', userInput, 'Uploaded File:', uploadedFile ? uploadedFile.originalname : 'No file uploaded');

  let extractedText = '';

  // Check if a file was uploaded
  if (uploadedFile) {
    extractedText = await textExtractionService.extractText(uploadedFile);
  }


  // Combine user input with extracted text for AI response
  let combinedInput = userInput;

  if (uploadedFile && extractedText) {
    combinedInput += `\n\nExtracted from file:\n${extractedText}`;
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Whenever you need to provide code with or without text in your responses, always specify the programming language after the opening triple backticks (```), like ` ```python `, ` ```cpp `, etc."
        },
        {
          role: "user",
          content: combinedInput,  // Use the input received from the client
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
