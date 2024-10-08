const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");

const handleLoggedInUser = async (
  res,
  prompt,
  sessionToken,
  authToken,
  result
) => {
  console.log("authToken recieved");

  if (!sessionToken) {
    console.log("SessionToken not provided to store chat");
    return res
      .json(400)
      .json({ msg: "sessionToken not provided to store chat" });
  }

  // Find user with authToken
  jwt.verify(
    authToken,
    process.env.JWT_TOKEN_SECRET,
    async function (err, decoded) {
      if (err) {
        console.log("Error occured while finding user with authToken");
        return res.status(500).json({ msg: "Error fetching in user" });
      }

      const user = await User.findOne({ email: decoded });

      // If no user found
      if (!user) {
        console.log("No user found");
        return res
          .status(400)
          .json({ msg: "You are not logged in to store chat" });
      }
      // User found - Create and save chat
      // Find existing chat using sessionToken
      let chat = await Chat.findOne({ sessionToken, user: user._id });

      // If no existing chat found
      if (!chat) {
        // Create a new chat
        console.log("Creating new chat");
        chat = new Chat({
          messages: [],
          user: user._id,
          sessionToken,
        });
      }

      // Push new messages - prompt, response of ai
      chat.messages.push({ role: "user", content: prompt });
      chat.messages.push({ role: "ai", content: result.response.text() });

      // save the chat
      await chat.save();

      // If it's a new chat, add it to users chat array and save
      if (!user.chats.includes(chat._id)) {
        user.chats.push(chat._id);
        await user.save();
      }

      res.status(200).json({ response: result.response.text() });
    }
  );
};

const handleChat = async (req, res) => {
  // Get Prompt from req.body
  const { prompt, sessionToken } = req.body;
  const authToken = req.cookies.authToken;

  console.log("Prompt:", prompt);

  if (!prompt) {
    return res.status(400).json({ msg: "Provide prompt" });
  }

  const model = new GoogleGenerativeAI(
    process.env.GEMINI_AI_API_KEY
  ).getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);

  // If user not logged in
  if (!authToken) {
    console.log("authToken not provided");
    return res.status(200).json({ response: result.response.text() });
  } else {
    await handleLoggedInUser(res, prompt, sessionToken, authToken, result);
  }
};

const handleChatWithFile = async (req, res) => {
  const { prompt, sessionToken } = req.body;
  const authToken = req.cookies.authToken;
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
      return res.status(500).json({ msg: "Server error in deleting file" });
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

  // If user not logged in
  if (!authToken) {
    console.log("authToken not provided");
    res.status(200).json({ response: result.response.text() });
  } else {
    await handleLoggedInUser(res, prompt, sessionToken, authToken, result);
  }
};

module.exports = { handleChat, handleChatWithFile };
