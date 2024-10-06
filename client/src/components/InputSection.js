// src/components/InputSection.js
import React, { useState } from 'react';
import TextareaInput from './TextareaInput';
import FileUpload from './FileUpload';
import AudioRecorder from './AudioRecorder';
import '../styles/InputSection.css';

const InputSection = ({ question, setQuestion, askQuestion, loading }) => {
  const [file, setFile] = useState(null); // Add state for the file

  const handleAskQuestion = () => {
    // Call the askQuestion function passed in
    askQuestion();

    // Reset the file after asking the question
    setFile(null);
  };

  return (
    <div className="input-section">
      <TextareaInput question={question} setQuestion={setQuestion} />
      <div className="button-section">
        <div className="ask-speech">
          <button className="ask-button button" onClick={handleAskQuestion} disabled={loading}>
            {loading ? 'Loading...' : 'Ask'}
          </button>
          <AudioRecorder setQuestion={setQuestion} />
        </div>
        <FileUpload file={file} setFile={setFile} /> {/* Pass file and setFile to FileUpload */}
      </div>
    </div>
  );
};

export default InputSection;
