import React, { useState } from 'react';

const StartVoiceButton = ({ setQuestion, question }) => {
  const [recognition, setRecognition] = useState(null);
  const [listening, setListening] = useState(false);

  const startRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true; // Keep recognizing until manually stopped
    recognitionInstance.interimResults = true; // Show interim results while speaking
    recognitionInstance.lang = 'en-US'; // Set language

    recognitionInstance.onresult = (event) => {
      let interimTranscript = '';  // To store interim results
      let finalTranscript = '';    // To store finalized results
    
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
    
        if (event.results[i].isFinal) {
          finalTranscript += transcript;  // Append final results
        } else {
          interimTranscript += transcript;  // Append interim results
        }
      }
    
      setQuestion((prevQuestion) => {
        // Trim existing question to avoid trailing spaces
        const trimmedQuestion = prevQuestion.trim();
        
        // Check if a space should be added between the last text and new text
        const space = trimmedQuestion && finalTranscript ? ' ' : '';
    
        // Append the final transcript without leading spaces
        return trimmedQuestion + space + finalTranscript.trim();
      });
    };
    
    

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognitionInstance.onend = () => {
      setListening(false); // Recognition stops after speech ends, but we can restart it
    };

    recognitionInstance.start();
    setListening(true);
    setRecognition(recognitionInstance);
  };

  const stopRecognition = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };

  return (
    <>
      {!listening ? (
        <button className='button' onClick={startRecognition}>Start Voice</button>
      ) : (
        <button className='button' onClick={stopRecognition}>Stop Voice</button>
      )}
    </>
  );
};

export default StartVoiceButton;




