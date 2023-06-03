import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    role:{
        type: String,
        enum: ['user','assistant'],
        required: true
    },
    message:{
        type: String,
        required: true
    },
    messageAt:{
        type: Date,
        default: Date.now
    }
});

const Chat = new mongoose.model("Chat", chatSchema);

export default Chat;