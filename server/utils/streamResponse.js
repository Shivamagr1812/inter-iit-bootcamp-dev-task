// Utility function to stream Groq API response
async function streamResponse(chatCompletion, res) {
  for await (const chunk of chatCompletion) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      res.write(content); // Send chunk to the client
    }
  }
  res.end(); // End the response
}

module.exports = streamResponse;



