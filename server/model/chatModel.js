




const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['user', 'Gpt-4'],
  },
  content: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: false,
  },
});

const chatSchema = new mongoose.Schema({
  emailId: {
    type: String,
    required: true,
  },
  conversation: [messageSchema],
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
