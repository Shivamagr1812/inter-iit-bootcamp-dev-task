const { Groq } = require('groq-sdk');
require("dotenv").config();

const API_KEY = process.env.API_KEY;

const groq = new Groq({ apiKey: API_KEY });

module.exports = { groq };
