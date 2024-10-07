import React, { useEffect, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import '../css/VoiceChat.css';

const VoiceChat = ({ isListening, setIsListening, setQuestion }) => {
    const recognitionRef = useRef(null); // Store the SpeechRecognition instance

    useEffect(() => {
        // Initialize Speech Recognition API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false; // Only provide final results
        recognition.maxAlternatives = 1; // Return the best result
        recognition.continuous = false; // Stop listening after one result

        // When the recognition starts
        recognition.onstart = () => {
            setIsListening(true); // Update parent state to indicate listening
        };

        // When the recognition ends
        recognition.onend = () => {
            setIsListening(false); // Update parent state to indicate stopped
        };

        // Handle errors
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false); // Update parent state on error
        };

        // Handle speech recognition results
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuestion(prev => `${prev} ${transcript}`); // Append the recognized speech to the question state
        };

        recognitionRef.current = recognition; // Store recognition instance in ref
    }, [setQuestion, setIsListening]);

    // Toggle function to start or stop the speech recognition
    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop(); // Stop listening if it's currently active
        } else {
            recognitionRef.current.start(); // Start listening if it's inactive
        }
    };

    return (
        <button
            className={`voice-toggle-btn ${isListening ? 'active' : ''}`} // Add active class conditionally
            onClick={toggleListening} // Use toggleListening function
            aria-label="Toggle Voice Input"
        >
            {isListening ? <FaMicrophoneSlash className="attach-voice-icon"/> : <FaMicrophone className="attach-voice-icon"/>} {/* Toggle icon */}
        </button>
    );
};

export default VoiceChat;
