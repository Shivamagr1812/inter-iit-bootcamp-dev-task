import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // Or any other theme you prefer
import { MdContentCopy } from "react-icons/md";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import FileUpload from './fileUpload';
import '../css/Chat.css';
import VoiceChat from './VoiceChat';
import { speakText } from './TextToSpeech';
import { Navigate, useNavigate } from 'react-router-dom';

const Chat = () => {
  const { logout, user } = useAuth(); 
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [history, setHistory] = useState([]); // State for chat history
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000' || "chatbot-server-wheat-eight.vercel.app";

  // Function to submit question to the server
  const askQuestion = async () => {
    if (!question.trim() && !attachedFile) return;  // Prevent empty submissions
  
    setLoading(true);
  
    // Create user message with attached file
    const userMessage = { role: 'user', content: question, file: attachedFile };
  
    try {
      // Add user message to the conversation
      setConversation((prev) => [...prev, userMessage]);
  
      // Prepare the form data
      const formData = new FormData();
      formData.append('message', question);
      if (attachedFile) {
        formData.append('file', attachedFile);
      }
  
      // Make the request to the backend
      const response = await axios.post(`${backendUrl}/chat`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Extract AI response
      const aiMessage = { role: 'Gemini', content: response.data.reply };
  
      // Add the AI response to the conversation
      setConversation((prev) => [...prev, aiMessage]);
  
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage = { role: 'Gemini', content: 'Something went wrong. Please try again.' };
      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setQuestion('');
      setAttachedFile(null);  // Clear attached file after submitting
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    Prism.highlightAll(); 
  }, [conversation]);

  const renderMessageContent = (content) => {
    const isCodeBlock = content.startsWith('```') && content.endsWith('```');
    if (isCodeBlock) {
      const codeContent = content.slice(3, -3);
      return (
        <pre>
          <code className="language-js">{codeContent}</code> 
        </pre>
      );
    }
    return <span>{content}</span>;
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      })
      .catch((err) => console.error('Failed to copy text: ', err));
  };

  const handleFileSelect = (file) => {
    setAttachedFile(file);
  };

  // Fetch chat history when the component mounts
  useEffect(() => {
    const fetchHistory = async () => {
      if (user && user._id) {  // Ensure the user is logged in
        try {
          const response = await axios.get(`${backendUrl}/chat/history`, {
            params: { userId: user._id },  // Pass the logged-in user's ID
          });
          setHistory(response.data); // Set chat history based on user ID
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      }
    };

    fetchHistory();
  }, [user, backendUrl]);

  const toggleHistory = () => {
    setShowHistory(!showHistory); // Toggle history display
  };

  const handleLogout = () => {
    logout();  // Call the logout function from AuthContext
    navigate("/login");  // Redirect to login page after logout
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <div className='parent-container'>
        <h1>Chat with me</h1>
        {isCopied && (
          <div className="messageBoxStyle">
            Copied to clipboard!
          </div>
        )}

        {/* Render chat history conditionally */}
        {showHistory && history.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'Gemini'}:</strong>
            <span>{renderMessageContent(msg.content)}</span>
          </div>
        ))}
      </div>

      <div className="chat-container">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'Gemini'}:</strong>
            <span>{renderMessageContent(msg.content)}</span>

            {/* Show file preview if it's a user message */}
            {msg.role === 'user' && msg.file && (
              <div className="file-preview-chat" style={{ marginTop: '10px' }}>
                <span>{msg.file.name}</span>
                <a
                  href={URL.createObjectURL(msg.file)}
                  download={msg.file.name}
                  className="file-download-link-chat"
                >
                  Download
                </a>
              </div>
            )}

            {msg.role === 'Gemini' && (
              <div className='buttons'>
                <div className="copy-button"
                  onClick={() => copyToClipboard(msg.content)}
                > 
                  <MdContentCopy /> 
                </div>
                <div className="text-to-speech" style={{ marginLeft: '10px' }} onClick={() => speakText(msg.content)}>
                  <HiMiniSpeakerWave />
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {attachedFile && (
        <div className="file-preview" style={{ transition: 'opacity 0.5s ease', marginTop: '10px' }}>
          <span>{attachedFile.name}</span>
          <a
            href={URL.createObjectURL(attachedFile)}
            download={attachedFile.name}
            className="file-download-link"
          >
            Download
          </a>
        </div>
      )}

      <div className="input-container">
        <textarea
          className="textarea"
          rows="4"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <FileUpload onFileSelect={handleFileSelect} />
        <VoiceChat
          isListening={isListening}
          setIsListening={setIsListening}
          setQuestion={setQuestion}
        />
      </div>

      <br />
      <button className="button" onClick={askQuestion} disabled={loading}>
        {loading ? 'Loading...' : 'Ask'}
      </button>
      <div>
        <p />
        <div className='logout' onClick={handleLogout}>
          Logout
        </div>
        <div className='logout' onClick={toggleHistory}>
          History
        </div>
      </div>
    </div>
  );
};

export default Chat;
