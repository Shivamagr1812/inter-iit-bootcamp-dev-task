const fs = require('fs');
const path = require('path');
const { AssemblyAI } = require('assemblyai');

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY // Use environment variables to store the API key securely
});

const transcribeAudio = async (req, res) => {
  try {
    const audioFile = req.files.audio; // Access the audio file from the request
    if (!audioFile) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    // Create directory if it doesn't exist
    const audioDir = path.join(__dirname, '../Audio'); // Adjust path as necessary
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Save the audio file to the Audio directory
    const audioPath = path.join(audioDir, audioFile.name);
    await audioFile.mv(audioPath); // Save file using express-fileupload or similar middleware

    // Transcribe audio using AssemblyAI
    const config = { audio_url: audioPath }; // Adjust path as needed
    const transcript = await client.transcripts.transcribe(config);

    res.json({ text: transcript.text });
  } catch (error) {
    console.error('Error in transcription:', error);
    res.status(500).send('Failed to transcribe audio.');
  }
};

module.exports = {
  transcribeAudio,
};
