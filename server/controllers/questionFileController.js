const { GoogleGenerativeAI } = require('@google/generative-ai');
const {  GoogleAIFileManager } = require('@google/generative-ai/server');
const path = require('path');

const askFileQuestion = async (req, res) => {
  const { file } = req;
  
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
    
    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: 'application/pdf',
      displayName: file.originalname,
    });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
    //   { text: 'Can you summarize this document as a bulleted list?' },
    ]);

    res.status(200).json({ response: result.response.text() });
  } catch (error) {
    console.error('Error uploading or processing file:', error);
    res.status(500).json({ error: 'Failed to process the file.' });
  }
};

module.exports = { askFileQuestion };
