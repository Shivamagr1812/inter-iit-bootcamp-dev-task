import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import './fileUpload.css';

// Initialize GoogleGenerativeAI with your API_KEY.
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// Initialize GoogleAIFileManager with your API_KEY.
const fileManager = new GoogleAIFileManager(process.env.API_KEY);

const model = genAI.getGenerativeModel({
  // Choose a Gemini model.
  model: 'gemini-1.5-flash',
});

const FileUpload = ({ handleFileResponse }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const allowedFileTypes = ['text/plain', 'application/pdf', 'image/jpeg', 'image/png'];
  const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && allowedFileTypes.includes(selectedFile.type) && selectedFile.size <= maxSizeInBytes) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Invalid file type or size exceeds 2MB');
      setFile(null);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileContent = event.target.result;

      // Call the Gemini API and process the file
      const response = await fetchGeminiAPI(file, fileContent);
      handleFileResponse(file.name, response);
    };
    // Trigger file reading
    reader.readAsDataURL(file);
  };

  const fetchGeminiAPI = async (file, fileContent) => {
    try {
      // Fix the string interpolation using backticks
      const uploadResponse = await fileManager.uploadFile(`media/${file.name}`, {
        mimeType: file.type,
        displayName: file.name,
      });

      console.log('Upload successful:', uploadResponse);

      const geminiResponse = await genAI.processFile({
        model: model.id,
        prompt: 'Analyze and summarize this file content.',
        fileContent: fileContent,
      });

      return geminiResponse.result;
    } catch (error) {
      console.error('Error processing file:', error);
      return 'Failed to process file.';
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleFileUpload}>Upload File</button> {/* Fixed the typo in the function call */}
    </div>
  );
};

export default FileUpload;
