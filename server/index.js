require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const jwt = require("jsonwebtoken");
const { user_structure } = require("./types");
const { User, Chat } = require("./db");
const bcrypt = require("bcrypt");
const { userMiddleware } = require("./middlewares");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const multer = require("multer");
const storage = multer.memoryStorage();
const path = require('path');
const tmp = require('tmp'); // Import tmp library
const fs = require('fs'); // Import fs module

const secret = process.env.SECRET;


// Multer
const upload = multer({ storage: storage });

require("dotenv").config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Client paths
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


// Signup route
app.post("/signup", async (req, res) => {
  if (!user_structure.safeParse(req.body).success) {
    return res
      .status(400)
      .json({ message: "Email/password not in correct format" });
  }
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ email: email, password: hashedPassword });
  const token = jwt.sign({ email: email }, secret, {
    expiresIn: "12h",
  });  
  res.json({ message: "User created successfully" , token});
});

// Signin route
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(password, user.password).then(result => result);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ email: user.email }, secret, {
    expiresIn: "12h",
  });
  res.json({ message: "Signin successful", token });
});

// POST endpoint to handle chat
app.post("/chat", userMiddleware, async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return res.json({ response: result.response.text() });
  } catch (error) {
    return res.status(500).json({ response: prompt });
  }
});

app.post("/stream", userMiddleware, upload.single('file'), checkfile, async (req, res) => {
  try {
    let result;
    let uploadResponse = null;

    if (!req.file || req.file === "null") {
      result = await model.generateContentStream([{ text: req.body.prompt }]);
    } else {
      // Create a temporary file
      const tempFile = tmp.fileSync({ postfix: `.${req.file.originalname.split('.').pop()}` });

      // Write the file buffer to the temporary file
      fs.writeFileSync(tempFile.name, req.file.buffer);

      // Upload the temporary file
      uploadResponse = await fileManager.uploadFile(tempFile.name, {
        mimeType: req.file.mimetype,
        displayName: req.file.originalname,
      });

      // Remove the temporary file after uploading
      fs.unlinkSync(tempFile.name);

      result = await model.generateContentStream([
        {
          fileData: {
            mimeType: uploadResponse.file.mimeType,
            fileUri: uploadResponse.file.uri,
          }
        },
        { text: req.body.prompt },
      ]);
    }

    let i = 0;

    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    response = "";

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      const jsonChunk = JSON.stringify({ chunk: chunkText }) + "\n"; // NDJSON format
      res.write(jsonChunk);
      response += chunkText;  
      i++;
    }

    res.end();

    Chat.create({
      user: req.email,
      role: "user",
      text: req.body.prompt,
      fileName: req.file ? req.file.originalname : null,
    });

    Chat.create({
      user: req.email,
      role: "model",
      text: response,
      fileName: null
    });    

    if (uploadResponse) {
      // Delete the file.
      await fileManager.deleteFile(uploadResponse.file.name);

      console.log(`Deleted ${uploadResponse.file.displayName}`);
    }
  } catch (error) {
    console.error("Failed to generate content stream:", error);
    res.status(500).json({ response: "Something went wrong" });
  }

});

app.post("/history", userMiddleware, async (req, res) => {
  const chats = await Chat.find({ user: req.email }).sort({ createdAt: 1 });
  res.json(chats.map((chat) => {return {role: chat.role, content: chat.text, fileName: chat.fileName}}));
});


function checkfile(req, res, next) {

  if (!req.file || req.file === "null") {
    console.log('No file received');
    next();
    return;
  }

  const allowedFileTypes = [
    'application/pdf',
    'application/x-javascript',
    'text/javascript',
    'application/x-python',
    'text/x-python',
    'text/plain',
    'text/html',
    'text/css',
    'text/md',
    'text/csv',
    'text/xml',
    'text/rtf'
  ];

  const file = req.file;

  const fileExtension = file.originalname ? file.originalname.split('.').pop() : null;

  const fileType = fileExtension === 'pdf' ? 'application/pdf' :
    fileExtension === 'js' ? 'application/x-javascript' :
      fileExtension === 'py' ? 'application/x-python' :
        fileExtension === 'txt' ? 'text/plain' :
          fileExtension === 'html' ? 'text/html' :
            fileExtension === 'css' ? 'text/css' :
              fileExtension === 'md' ? 'text/md' :
                fileExtension === 'csv' ? 'text/csv' :
                  fileExtension === 'xml' ? 'text/xml' :
                    fileExtension === 'rtf' ? 'text/rtf' :
                      null;

  if (fileType && allowedFileTypes.includes(fileType) && file.size < 5000000) {
    req.fileType = fileType;
    console.log('Valid file type or extension ', fileExtension);
    next();
  } else {
    console.log('Invalid file type and extension ', fileType, file.size);
    return res.status(400).json({ response: "Invalid file type or extension" });
  }
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
