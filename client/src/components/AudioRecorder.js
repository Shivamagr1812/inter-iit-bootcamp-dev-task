// src/components/AudioRecorder.js
import React, { useState } from 'react';
import { transcribeAudio } from '../utils/api'; // Adjust this import based on your utils folder structure

const AudioRecorder = ({ setQuestion }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.start();
      setIsRecording(true);

      recorder.ondataavailable = (event) => {
        setAudioChunks((prevChunks) => [...prevChunks, event.data]);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        handleAudioRecorded(audioBlob);
      };
    } catch (error) {
      console.error('Error accessing audio stream:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Handle the recorded audio
  const handleAudioRecorded = async (audioBlob) => {
    try {
      const data = await transcribeAudio(audioBlob);
      setQuestion(data.text);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  return (
    <div className="">
      {isRecording ? (
        <button onClick={stopRecording} className=" speech-button button stop-button ">
          Stop Rec.
        </button>
      ) : (
        <button onClick={startRecording} className=" speech-button button record-button">
          Start Rec.
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;
