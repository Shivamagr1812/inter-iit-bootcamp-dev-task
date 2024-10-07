const mongoose = require("mongoose");
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const Chatschema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  role: {
    type: String,
    require: [true, "Please provide role!"],
  },

  parts: {
    type: [
      {
        text: {
          type: String,
        },
      },
    ],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", Chatschema);
