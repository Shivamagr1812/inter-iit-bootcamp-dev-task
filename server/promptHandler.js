const { geminiModel } = require("./config/genaimodel");
// const fs = require("fs");
async function getResponseText(prompt) {
  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}
const chat = geminiModel.startChat({
  history: [],
  generationConfig: {
    maxOutputTokens: 500,
  },
});

async function getMultiResponse(prompt) {
  console.log("User: ", prompt);
  try {
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const text = response.text();
    console.log("AI: ", text);
    return text;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
}
async function getResponse(prompt, res, history = []) {
  try {
    const conversationSession = geminiModel.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });
    const result = await conversationSession.sendMessageStream(prompt);
    let text = "";
    for await (const chunk of result.stream) {
      const chunkText = await chunk.text();
      console.log("AI: ", chunkText);
      res.write(JSON.stringify({ data: chunkText }));
      res.flush();
      text += chunkText;
    }
    console.log("text is : ",text);
    return text;
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
}

// function fileToGenerativePart(path, mimeType) {
//   return {
//     inlineData: {
//       data: Buffer.from(fs.readFileSync(path)).toString("base64"),
//       mimeType,
//     },
//   };
// }

function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType,
    },
  };
}
async function filePrompt (prompt, file, mimeType, res, finalHistory = []) {

  console.log("Processing file prompt...");
    try {
      
      const imageParts = [fileToGenerativePart(file, mimeType)];
      console.log(file);

      console.log(imageParts);
      const result = await geminiModel.generateContentStream([prompt, ...imageParts]);
      console.log("result : ",result);
      let text = "";
      for await (const chunk of result.stream) {
        const chunkText = await chunk.text();
        console.log("AI: ", chunkText);
        res.write(JSON.stringify({ data: chunkText }));
        res.flush();
        text += chunkText;
      }
      console.log("text is : ",text);
      return text;
    } catch (err) {
      console.log(err);
      res.json({ success: false });
    }
};
// const filePrompt = async (prompt, file, mimeType) => {
//   console.log("hello");
//   const imageParts = [fileToGenerativePart(file, mimeType)];

//   // Call the generative model with the prompt and file parts
//   const result = await geminiModel.generateContent([prompt, ...imageParts]);
//   const response = await result.response;
//   console.log(response.text());

//   return response.text();
// };


module.exports = {
  getResponseText,
  getMultiResponse,
  getResponse,
  filePrompt,
};
