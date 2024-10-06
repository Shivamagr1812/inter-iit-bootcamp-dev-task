// const express = require("express");
// const { Groq } = require('groq-sdk');
// const bodyParser = require("body-parser");
// const cors = require("cors");
// require("dotenv").config();

// // Initialize Express app
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// const API_KEY = process.env.API_KEY;
// const groq = new Groq({ apiKey: API_KEY });

// // Function to interact with the Groq API and get chat completion
// async function getGroqChatCompletion(userInput, res) {
//   const chatCompletion = await groq.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content: "Whenever you provide code in your responses, always specify the programming language after the opening triple backticks (```), like ` ```python `, ` ```cpp `, etc."
//       },
//       {
//         role: "user",
//         content: userInput,  // Use the input received from the client
//       },
//     ],
//     model: "llama3-8b-8192",  // Groq model
//     stream: true,
//   });

//   // Stream the response chunks
//   for await (const chunk of chatCompletion) {
//     const content = chunk.choices[0]?.delta?.content;
//     if (content) {
//       console.log(content);
//       res.write(content); // Send chunk to the client
//     }
//   }
//   res.end(); // End the response when done
// }

// app.post('/chat', async (req, res) => {
//   try {
//     const userInput = req.body?.userInput;
//     console.log('incoming /chat req', userInput);
//     if (!userInput) {
//       return res.status(400).json({ error: 'Invalid request body' });
//     }

//     // Call the function to get chat completion from Groq API
//     res.setHeader('Content-Type', 'text/plain'); // Set content type for streaming
//     await getGroqChatCompletion(userInput, res); // Stream response to client

//   } catch (error) {
//     console.error('Error in chat endpoint:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Start the server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });












const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middlewares/errorHandler');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use(chatRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
