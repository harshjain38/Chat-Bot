import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
});

const BotUser = new mongoose.model("BotUser", usersSchema);
export default BotUser;