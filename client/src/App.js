import React, { useState, useRef,useEffect } from 'react';
import './App.css';
import axios from "axios";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaMicrophone } from 'react-icons/fa';
import { FaVolumeUp } from 'react-icons/fa';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Signin from './page/Signin';
import { BrowserRouter as Router } from 'react-router-dom';
import Logout from './page/Logout.js'


function App() {
  // State variables
  const [question, setQuestion] = useState(''); // User's question
  const [conversation, setConversation] = useState([]); // Chat conversation history
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [buttonTxt, setButtonTxt] = useState("Copy"); // Text for copy button
  const [isListening, setIsListening] = useState(false); // Listening state for voice recognition
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState(null); // Index of the current speaking response
  const [selectedFile, setSelectedFile] = useState(null); // Uploaded file state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state for file uploads
  const recognitionRef = useRef(null); // Reference to speech recognition instance
  const chatEndRef = useRef(null); // Reference to scroll chat container to bottom
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'; // Backend URL for API calls
  const [clientToken, setclientToken] = useState(localStorage.getItem('clientToken')); // Client token for authentication

  // Handle file change and validate file type and size
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']; // Valid file types

    // Validate file type
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Invalid file type. Please select a jpg, jpeg, or png image.');
      setSelectedFile(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB file size limit
    // Validate file size
    if (file.size > maxSize) {
      setErrorMessage('File size too large. Please upload a file smaller than 5MB.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setErrorMessage(''); // Clear error message if validation passes
  };

  // Start voice recognition
  const startSpeechRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true); // Update state when recognition starts
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript); // Set the recognized text as the question
      setIsListening(false); // Stop listening after result is obtained
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false); // Stop listening on error
    };

    recognition.onend = () => {
      setIsListening(false); // Update state when recognition ends
    };

    recognition.start(); // Start recognition
    recognitionRef.current = recognition; // Store recognition instance in ref
  };

  // Speak the AI's response using text-to-speech
  const speakResponse = (text, index) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';
      speechSynthesis.speak(speech);
      setCurrentSpeakingIndex(index); // Track the index of the response being spoken
    } else {
      console.error("Text-to-speech is not supported in this browser.");
    }
  };

  // Stop ongoing speech
  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Stop speech synthesis
    }
  };

  // Send question to the backend and handle response
  const askQuestion = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // Stop recognition if running
      setIsListening(false);
    }

    try {
      if (question.length !== 0 || selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile); // Append selected file
        formData.append('question', question); // Append question
        formData.append('clientToken', clientToken); // Append client token

        // Update conversation state based on input
        if (question && selectedFile) {
          setConversation((prevConvs) => [...prevConvs, { role: 'user', content: question + ` ("File Uploaded")` }]);
        } else if (question && !selectedFile) {
          setConversation((prevConvs) => [...prevConvs, { role: 'user', content: question }]);
        } else {
          setConversation((prevConvs) => [...prevConvs, { role: 'user', content: `"File Uploaded"` }]);
        }

        setQuestion("");
        setSelectedFile(null);
        setLoading(true);

        let response = await axios.post(`${backendUrl}/chat`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });

        setLoading(false);
        setConversation((prevConvs) => [...prevConvs, { role: 'AI', content: response.data.answer }]);
      }
    } catch (error) {
      console.error('There was an error', error);
      setLoading(false);
    }
  };

  // Fetch conversation from the backend on component load
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        let response = await axios.get(`${backendUrl}/stream/${clientToken}`, {
          withCredentials: true,
        });
  
        setConversation(response.data.conversation); // Update conversation state
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    };
  
    if (clientToken) {
      fetchConversation();
    }
  }, [clientToken]);

  // Scroll chat to the bottom when a new message is added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);
  

  return (
    <div className="container">
     {!clientToken?
        <GoogleOAuthProvider clientId={`${process.env.REACT_APP_CLIENT_ID}`}>
       <Router>
          <Signin  setclientToken={setclientToken}/>
        </Router>
      </GoogleOAuthProvider>
           :
           <Logout  setclientToken={setclientToken} setConversation={setConversation} />
        }
      <h1>Chat with me</h1>

      <div className="chat-container">
        {conversation.length !== 0 && conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
            <div className="message-content">
              {msg.role === 'AI' && msg.content.startsWith('```') ? (
                <div>
                  <CopyToClipboard text={msg.content}>
                    <button onClick={() => {
                      setButtonTxt("copied");
                      setTimeout(() => {
                        setButtonTxt("Copy");
                      }, 2000);
                    }} className="copy-button ">{buttonTxt}</button>
                  </CopyToClipboard>
                  <SyntaxHighlighter language="javascript" style={solarizedlight}>
                    {msg.content.replace(/```/g, '')}
                  </SyntaxHighlighter>
                  <br />
                </div>
              ) : (
                <span>{msg.content}
                  <FaVolumeUp
                    onClick={() => {
                      if (currentSpeakingIndex === index) {
                        stopSpeech(); 
                        setCurrentSpeakingIndex(null);
                      } else {
                        speakResponse(msg.content, index); 
                      }
                    }}
                    size={15}
                    color={currentSpeakingIndex === index ? "red" : "green"} 
                  />

                </span>

              )}
            </div>
            <br />
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <textarea
        className="textarea"
        rows="4"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <br />

      <div className="ask">
        <button className="button" onClick={askQuestion} disabled={loading || isListening}>
          {loading ? 'Loading...' : 'Ask'}
        </button>


        <button className="voice-button" onClick={startSpeechRecognition} disabled={isListening}>
          <FaMicrophone size={27} color="red" />
          {isListening ? 'Listening...' : 'Start Voice Chat'}
        </button>

        <div>
          <input type="file" onChange={handleFileChange} />
        </div>
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}


    </div>
  );
}

export default App;
