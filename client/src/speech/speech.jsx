import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SpeechToText = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();

  // Check if the browser supports speech recognition
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Browser does not support speech recognition.</span>;
  }

  const startListening = () => {
    resetTranscript(); // Reset the transcript each time listening starts
    SpeechRecognition.startListening({ continuous: true }); // Enable continuous listening
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  return (
    <div>
      <h1>Speech to Text</h1>
      <button onClick={startListening}>Start Listening</button>
      <button onClick={stopListening}>Stop Listening</button>
      <p>{transcript}</p>
    </div>
  );
};

export default SpeechToText;
