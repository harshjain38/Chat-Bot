import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./models/userModel.js";
import Chat from "./models/chatModel.js";

const app = express();
const port = 8000;
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(cors());

dotenv.config({ path: './config.env' });

const db=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(db,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('Connection Successful!'));

const configuration = new Configuration({
  organization: process.env.CHATGPT_API_ORG,
  apiKey: process.env.CHATGPT_API_KEY
});
const openai = new OpenAIApi(configuration);

//Routes

app.post("/login", (req, res)=> {
  const { email, password} = req.body;
  User.findOne({ email: email}, (err, user) => {
    if(user){
      if(password === user.password ) {
        res.send({message: "Login Successfull", user: user});
      } 
      else{
        res.send({ message: "Incorrect Password"});
      }
    } 
    else{
      res.send({message: "User not registered"});
    }
  });
}); 

app.post("/", async (req, res) => {
  const { chats } = req.body;

  try{
    await Chat.create({
      role: chats[chats.length -1].role,
      message: chats[chats.length -1].content
    });
  }
  catch(err){
    console.log(err);
  }

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "assistant",
        content: "Say this is a test",
      },
      ...chats,
    ],
  });

  try{
    await Chat.create({
      role: result.data.choices[0].message.role,
      message: result.data.choices[0].message.content
    });
  }
  catch(err){
    console.log(err);
  }

  res.json({
    output: result.data.choices[0].message,
  });
});

app.post("/register", (req, res)=> {
  const { name, email, password} = req.body
  User.findOne({email: email}, async (err, user) => {
    if(user){
      res.send({message: "User already registerd"});
    } 
    else{
      try{
        await User.create({
          name: name,
          email: email,
          password: password
        });
        res.send({ message: "Successfully Registered, Please login now." });
      }
      catch(err){
        console.log(err);
      }
    }
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
