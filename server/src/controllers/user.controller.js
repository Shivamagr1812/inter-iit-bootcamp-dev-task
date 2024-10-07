const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");

const handleSendChatHistory = (req, res) => {
  const authToken = req.cookies.authToken;

  if (!authToken) {
    return res.status(400).json({ msg: "Login to fetch chat history" });
  }

  jwt.verify(
    authToken,
    process.env.JWT_TOKEN_SECRET,
    async function (err, decoded) {
      if (err) {
        return res.status(500).json({ msg: "Error fetching in user" });
      }

      const user = await User.findOne({ email: decoded });

      // If no user found
      if (!user) {
        return res
          .status(400)
          .json({ msg: "You are not logged in to store chat" });
      }

      // User found - return it's chatHistory
      const chatHistory = (await user.populate("chats")).chats;

      res.status(200).json(chatHistory);
    }
  );
};

module.exports = { handleSendChatHistory };
