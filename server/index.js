
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const mongoose = require('mongoose');
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");


mongoose.connect('mongodb+srv://krish12252005:UwIun5sfWpiQs9jr@krish-cluster.vn4ka9f.mongodb.net/chat-app')
.then(console.log('mongoose is connected'))
.catch((e)=>console.log(e));
const app = express();
app.use(cors());
app.use(bodyParser.json());




app.use('/user',userRouter);
app.use('/',chatRouter);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




