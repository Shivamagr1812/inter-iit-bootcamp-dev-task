import React, { useEffect, useState } from 'react';
import '../styles/InputSection.css';

const InputSection = ({ question, setQuestion, askQuestion, loading }) => {
  const [isListening, setIsListening] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  useEffect(() => {
    let stream = null;

    const initializeMediaRecorder = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          setAudioChunks((prev) => [...prev, event.data]);
        };

        recorder.onstop = () => {
          const chunks = audioChunks;
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          sendAudioToServer(audioBlob);
          setAudioChunks([]);
        };
      } catch (err) {
        console.error('Error initializing MediaRecorder:', err);
        alert('Please allow microphone access to use the voice feature.');
      }
    };

    initializeMediaRecorder();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); // Run on mount

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

  const sendAudioToServer = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');

    try {
      const response = await fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setQuestion(data.text); // Set the transcribed text
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  return (
    <div className="input-section">
      <textarea
        className="textarea"
        rows="4"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <div>
        <button className="ask-button button" onClick={askQuestion} disabled={loading}>
          {loading ? 'Loading...' : 'Ask'}
        </button>
        <button className="button speech-button" onClick={isListening ? stopListening : startListening}>
          {isListening ? '🛑 Stop' : '🎤 Speak'}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
