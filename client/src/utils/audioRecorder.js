// src/components/AudioRecorder.js
import '../styles/InputSection.css';
import React, { useEffect, useState } from 'react';

const AudioRecorder = ({ onAudioRecorded }) => {
  const [isListening, setIsListening] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  useEffect(() => {
    const initializeMediaRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          setAudioChunks((prev) => [...prev, event.data]);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          onAudioRecorded(audioBlob);
          setAudioChunks([]);
        };
      } catch (err) {
        console.error('Error initializing MediaRecorder:', err);
      }
    };

    initializeMediaRecorder();

    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaRecorder]);

  const startListening = () => {
    if (mediaRecorder) {
      setAudioChunks([]); // Clear previous audio chunks
      mediaRecorder.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsListening(false);
    }
  };

  return (
    <div>
      <button className="button speech-button" onClick={isListening ? stopListening : startListening}>
        {isListening ? '🛑 Stop' : '🎤 Speak'}
      </button>
    </div>
  );
};

export default AudioRecorder;
