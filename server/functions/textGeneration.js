
import { GoogleGenerativeAI } from "@google/generative-ai";
import { text } from "stream/consumers";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const chat = async(req,res) => {
    try {
        const { prompt } = req.body;
        const userId = req.body.userId;

        const user = await User.findOne({ _id:userId });

		if (!user) {
			return res.status(400).json({ error: "username does not exist" });
		}
        const newPrompt = new Message({
            userId:userId,
            sender:"user",
            message:prompt
        });

        if(newPrompt){
            await newPrompt.save();
        }
        else{
            res.status(500).json({ error: "Internal Server Error" });
        }

        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        
        // console.log(result.response.text());
        const data = result.response.text();
        if(data){
            const newGPTresponse = new Message({
                userId:userId,
                sender:"GPT",
                message:data
            });

            if(newGPTresponse){
                await newGPTresponse.save();
            }
            else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
        res.status(201).json({
            text:data
        });
        
    } catch (error) {
        console.log("Error in textGeneration: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
}