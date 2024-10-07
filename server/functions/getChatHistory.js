import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const getChatHistory = async(req,res) => {
    try {
        const userId = req.query.userId;

        const user = await User.findOne({ _id:userId });

		if (!user) {
			return res.status(400).json({ error: "user does not exist" });
		}

        const chats = await Message.find({userId:userId}).sort({ createdAt: 1 }).exec();

        if(!chats){
            res.status(500).json({error:"Internal server error"});
        }

        res.status(201).json({
            chats:chats
        });

    } catch (error) {
        console.log("Error in textGeneration: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}