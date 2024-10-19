const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");

const handleSendChatHistory = (req, res) => {
  console.log("Requested chatHistory");
  const authToken = req.cookies.authToken;

  if (!authToken) {
    console.log("User not logged in to fetch chatHistory");
    return res.status(400).json({ msg: "Login to fetch chat history" });
  }

  jwt.verify(
    authToken,
    process.env.JWT_TOKEN_SECRET,
    async function (err, decoded) {
      if (err) {
        console.log("Error in verifying authToken");
        return res.status(500).json({ msg: "Error fetching in user" });
      }

      const user = await User.findOne({ email: decoded });

      // If no user found
      if (!user) {
        console.log("User not found with provided authToken");
        return res
          .status(400)
          .json({ msg: "Incorrect credentials provided to get chatHistory" });
      }

      // User found - return it's chatHistory
      const chatHistory = (await user.populate("chats")).chats;

      console.log("chatHistory sent successfully");

      res.status(200).json(chatHistory);
    }
  );
};

module.exports = { handleSendChatHistory };
