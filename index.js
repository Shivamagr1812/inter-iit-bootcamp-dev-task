import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";
import {markdown} from "markdown";
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import chat from './models/chat.js';

const app = express();
const port = 3000;
var i=0;
const b=[];
var username='';
var password='';
const db=process.env.MONGODB_CLUSTER;
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const _dirname=dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", async (req, res) => {
   res.sendFile(_dirname+"/main.html");
});
app.get("/login.html",async (req, res) => {
    res.sendFile(_dirname+"/login.html");
});
app.post("/logging",async (req, res) => {
    username=req.body['username'];
    password=req.body['password'];
    chat.find().then((results)=>{
          for (var i=0;i<results.length;i++){
            if (results[i].username==username){ 
                if (results[i].password==password){
                    res.redirect("/chat");
                }
                else{
                    res.send("the entered username or password is incorrect");
                }}}});});
app.get('/chat',async (req, res) => {
    res.render("interface.ejs",{chat:[],username:username});
});
app.get("/register.html",async (req, res) => {
    res.sendFile(_dirname+"/register.html");
});
app.post("/registering",async (req, res) => {
    username=req.body['username'];
    password=req.body['password'];
    insert(username,password);
    res.redirect("/chat");
});
app.get('/main.html', async (req, res) => {
    res.sendFile(_dirname+"/main.html");
    });
app.post("/submit", async (req, res) => {
    var a='';
    var prompt='';
    console.log(req.body);
    if (!req.body['filepath']){
      prompt = req.body['message'];
      const result = await model.generateContent(prompt);
      a=remove_tags(markdown.toHTML(result.response.text()));
    }
    else{
        let name=req.body['filepath'].slice(req.body['filepath'].lastIndexOf("/"));
        const uploadResponse = await fileManager.uploadFile(req.body['filepath'], {
        mimeType: "application/pdf",
        displayName: name,
        });
        console.log(
        `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`,
        );
        const result2 = await model.generateContent([
        {
            fileData: {
            mimeType: uploadResponse.file.mimeType,
            fileUri: uploadResponse.file.uri,
            },
        },
        { text: req.body['message'] },
        ]);
        a= remove_tags(markdown.toHTML(result2.response.text()));
        prompt=req.body['message']+"   "+"File attached:"+name;
    }
    b.push([prompt,a]);
    res.render("interface.ejs",{chat:b,username:username});
});

function remove_tags(r){
    var a=r.replace(/(<([^>]+)>)/ig, '');
    var b=a.replace(/&#39;/g,"'");
    return b;
}

async function insert(u,p){ 
    const c= new chat({
        username:u,
        password:p,
        convo:[]
    });
    c.save().then((result)=>{
        console.log(result);
    });
}

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });

