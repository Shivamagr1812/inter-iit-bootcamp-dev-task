const mongoose =require("mongoose");
const { isEmail } = require("validator");


const chatHistorySchema = new mongoose.Schema({
    userQuestion: {
        type: String,
        required: true
    },
    aiAnswer: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now // Automatically sets the current date and time
    }
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "please enter an email"],
        unique: true,
        vlidate: [(isEmail, "Please enter a valid email ID")],
    },
    password: {
        type: String,
        required: [true, "please enter an password"],
        minLength: [8, "Minimum password length is 8 characters"],
    },
    chatHistory: [chatHistorySchema],
})

const User = mongoose.model('User', userSchema);

module.exports = User ;