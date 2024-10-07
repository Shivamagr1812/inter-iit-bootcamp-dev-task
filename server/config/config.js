require("dotenv").config();
const { Groq } = require('groq-sdk');

// Configuration file
const API_KEY = process.env.API_KEY;

const groq = new Groq({ apiKey: API_KEY });

module.exports = groq;
