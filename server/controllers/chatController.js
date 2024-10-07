const Chat = require('../models/Chat');

// /**
//  * Fetch all chats for a specific user.
//  * @param {Object} req 
//  * @param {Object} res 
//  */
const fetchChats = async (req, res) => {
  const userId = req.user.id; // Extract userId from authenticated user
  console.log(`Fetching chats for userId: ${userId}`);

  try {
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// /**
//  * Push a new chat message to the user's chat history.
//  * @param {Object} req 
//  * @param {Object} res 
//  */


const pushChat = async (req, res) => {
  const userId = req.user.id; // Extract userId from authenticated user
  const { chats } = req.body; // Expecting an array of chats

  // Validate input
  if (!chats || !Array.isArray(chats) || chats.length === 0) {
    return res.status(400).json({ message: 'Chats array is required and cannot be empty.' });
  }

  try {
    // Create a new chat session every time regardless of date
    const newChatSession = new Chat({
      userId,
      messages: chats,  // Save the provided chats directly as messages
      createdAt: new Date(),  // Set the current date as the created date
    });

    // Save the new chat session
    await newChatSession.save();

    res.status(201).json(newChatSession);
  } catch (error) {
    console.error('Error in pushChat:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};



// const pushChat = async (req, res) => {
//   const userId = req.user.id; // Extract userId from authenticated user
//   const { chats } = req.body; // Expecting an array of chats

//   // Validate input
//   if (!chats || !Array.isArray(chats) || chats.length === 0) {
//     return res.status(400).json({ message: 'Chats array is required and cannot be empty.' });
//   }

//   try {
//     // Find the latest chat session or create a new one
//     let chat = await Chat.findOne({ userId }).sort({ createdAt: -1 });

//     if (!chat || (new Date() - chat.createdAt) > 24 * 60 * 60 * 1000) { // Example: new chat after 24 hours
//       chat = new Chat({ userId, messages: [] });
//     }

//     // Push all chats into the messages array
//     chat.messages.push(...chats);
//     await chat.save();

//     res.status(201).json(chat);
//   } catch (error) {
//     console.error('Error in pushChat:', error);
//     res.status(500).json({ message: 'Server Error', error: error.message });
//   }
// };

// const pushChat = async (req, res) => {
//   const { userId } = req.params;
//   const { question, response } = req.body;

//   if (!question || !response) {
//     return res.status(400).json({ message: 'Question and response are required.' });
//   }

//   try {
//     // Find the latest chat session or create a new one
//     let chat = await Chat.findOne({ userId }).sort({ createdAt: -1 });

//     if (!chat || (new Date() - chat.createdAt) > 24 * 60 * 60 * 1000) { // Example: new chat after 24 hours
//       chat = new Chat({ userId, messages: [] });
//     }

//     chat.messages.push({ question, response });
//     await chat.save();

//     res.status(201).json(chat);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error: error.message });
//   }
// };


const fetchChatById = async (req, res) => {
  const { chatId } = req.params; // Extract chatId from request parameters
  const userId = req.user.id; // Extract userId from authenticated user

  try {
    // Find the specific chat by ID and ensure it belongs to the authenticated user
    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error fetching chat by ID:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  fetchChats,
  pushChat,
  fetchChatById,
};
