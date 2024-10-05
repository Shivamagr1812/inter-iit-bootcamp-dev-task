// Import the required dependencies
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { formatCodeBlocks } = require("../utils/formatHelper");

// Initialize the Generative AI client with API Key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const generateResponse = async (prompt) => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content based on the prompt
    const result = await model.generateContent(prompt);

    // Wait until the response is fully retrieved
    const response = await result.response;
    const text = await response.text(); // Fully await the response text

    // Use the formatCodeBlocks function after the text is fully received
    // const formattedText = formatCodeBlocks(text);

    // Optionally log the formatted text (for debugging purposes)
    console.log("Formatted Text:", text);

    // Return the formatted response
    return text;

  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error("Failed to generate response");
  }
};

module.exports = { generateResponse };
