const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");

const handleChat = async (req, res) => {
  // Get Prompt from req.body
  const prompt = req.body.prompt;
  console.log(prompt);

  if (!prompt) {
    return res.status(400).json({ msg: "Provide prompt" });
  }

  const model = new GoogleGenerativeAI(
    process.env.GEMINI_AI_API_KEY
  ).getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);

  res.status(200).json({ response: result.response.text() });
};

const handleChatWithFile = async (req, res) => {
  const prompt = req.body.prompt;
  const file = req.file;

  const fileManager = new GoogleAIFileManager(process.env.GEMINI_AI_API_KEY);
  // Upload file to API Server
  const uploadResult = await fileManager.uploadFile(`${file.path}`, {
    mimeType: file.mimetype,
    displayName: file.originalname,
  });
  // Check if file uploaded successfully
  console.log(
    `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
  );

  // Delete file from local storage after uploading
  fs.unlink(file.path, (err) => {
    if (err) {
      console.log("Error deleting file:", err);
    } else {
      console.log("File deleted successfully");
    }
  });

  // Get response for file + prompt
  const model = new GoogleGenerativeAI(
    process.env.GEMINI_AI_API_KEY
  ).getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    prompt,
    {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      },
    },
  ]);

  // Return result
  res.status(200).json({ response: result.response.text() });
};

module.exports = { handleChat, handleChatWithFile };
