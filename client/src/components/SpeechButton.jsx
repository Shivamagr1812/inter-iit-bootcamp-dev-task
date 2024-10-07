import React, { useState, useEffect } from 'react';
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { IoIosPause } from "react-icons/io";


const SpeechButton = ({ text }) => {
  const synth = window.speechSynthesis;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);

  // Function to handle voice playback
  const handleVoiceControl = () => {
    if (synth.speaking) {
      if (isPaused) {
        // Resume if paused
        synth.resume();
        setIsPaused(false);
      } else {
        // Pause if currently speaking
        synth.pause();
        setIsPaused(true);
      }
    } else {
      // Speak the new text
      if (currentUtterance) {
        synth.cancel(); // Stop any ongoing speech
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentUtterance(null);
      };
      synth.speak(utterance);
      setIsSpeaking(true);
      setIsPaused(false);
      setCurrentUtterance(utterance);
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, [synth]);

  return (
    <div className="voice-control">
      <button className='read-ai-btn' onClick={handleVoiceControl}>
        {isSpeaking ? (isPaused ? <HiOutlineSpeakerWave /> : <IoIosPause />) : <HiOutlineSpeakerWave />}
      </button>
      
    </div>
  );
};

export default SpeechButton;
