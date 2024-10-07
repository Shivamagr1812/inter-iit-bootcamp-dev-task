import mongoose from 'mongoose';
const Schema=mongoose.Schema;
const ChatSchema=new Schema({
    username:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    convo:{
        type: Array,
        required:true
    }
},{timestamps:true});
const chat=mongoose.model('chat',ChatSchema);
export default chat;