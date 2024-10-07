const { GoogleGenerativeAI } = require("@google/generative-ai");

const mongoose = require('mongoose');
//const Chat = require("./model/chatModel");


const express = require("express");
const Chat = require("../model/chatModel");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);



const chatHistory=async(req,res)=>{
    const { emailId } = req.params;

    const chatHistory = await Chat.findOne({ emailId });
    if (!chatHistory) {
      return res.status(404).json({ message: 'No chat history found for this user.' });
    }
  
    res.json(chatHistory);
}


const chat= async(req,res)=>{
    const emailId = req.body.emailId; // Extract email ID from the request body
    const question = req.body.question;
    const file = req.file;
  
    // Find or create a chat history for the emailId
    let chatHistory = await Chat.findOne({ emailId });
  
    if (!chatHistory) {
      chatHistory = new Chat({ emailId, conversation: [] });
    }
  
    // Add the user's question to the chat history
    chatHistory.conversation.push({ role: 'user', content: question });
  
    // Process the question and generate a response (you would call your AI model here)
    const responseContent = 'Your response here'; // Replace with actual AI response
  
    // Add Gpt-4's response to the chat history
    chatHistory.conversation.push({ role: 'Gpt-4', content: responseContent });
  
    await chatHistory.save();
  
    res.json({ response: responseContent });
}



const stream=async(req,res)=>{
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
  
    const { question, emailId } = req.query;
  
    if (!question || question.trim() === "") {
      res.write("event: error\n");
      res.write(`data: ${JSON.stringify({ error: 'question cannot be empty' })}\n\n`);
      return res.end();
    }
  
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(question);
      const text = result.response.text();
  
      let responseContent = '';
      const words = text.split(' ').filter(word => !word.includes('*'));;
  
      for (let i = 0; i < words.length; i++) {
        responseContent += words[i] + ' ';
        if (i % 20 === 0 || i === words.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 50));
          res.write(`data: ${JSON.stringify({ content: responseContent })}\n\n`);
        }
      }
  
      // Save the conversation to MongoDB
      let chatHistory = await Chat.findOne({ emailId });
      if (!chatHistory) {
        chatHistory = new Chat({ emailId, conversation: [] });
      }
      chatHistory.conversation.push({ role: 'user', content: question });
      chatHistory.conversation.push({ role: 'Gpt-4', content: responseContent });
      await chatHistory.save();
  
      res.write("event: end\n");
      res.write("data: End of stream\n\n");
      res.end();
    } catch (error) {
      console.error("Error during AI call:", error.message);
      res.write("event: error\n");
      res.write(`data: ${JSON.stringify({ error: "Something went wrong while processing the request" })}\n\n`);
      res.end();
    }
}

const streamResponse = async (res, text) => {
    const words = text.split(' ').filter(word => !word.includes('*'));
    let chunk = '';
  
    for (let i = 0; i < words.length; i++) {
      chunk += words[i] + ' ';
  
      if (i % 20 === 0 || i === words.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 50));
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        chunk = '';
      }
    }
    
    res.write("event: end\n");
    res.write("data: End of stream\n\n");
    res.end();
  };
  const uploaded=async(req,res)=>{
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
      
      // Handle the uploaded file as needed, e.g., store it, process it, etc.
      console.log(`File uploaded: ${req.file.originalname}`);
      res.send('File uploaded successfully');
  }
  module.exports={
    streamResponse,
    chat,
    chatHistory,
    uploaded,
    stream
  }