

import React, { useState, useEffect, useRef } from 'react';
import './Mainchat.css';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

function Mainchat() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]); // Current conversation
  const [chatHistory, setChatHistory] = useState([]); // Chat history from previous sessions
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const chatEndRef = useRef(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  
  const navigate = useNavigate();
  const emailId = localStorage.getItem('userEmail');

  // Fetch chat history when component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`${backendUrl}/chat-history/${emailId}`);
        const data = await response.json();
        if (data.conversation) {
          setChatHistory(data.conversation); // Only set the history, not the ongoing conversation
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, [backendUrl, emailId]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2 MB limit
      if (file.size > maxSize) {
        alert('File size exceeds 2MB limit.');
        return;
      }
      setUploadedFile(file);
      setConversation((prev) => [...prev, { role: 'user', content: 'Uploaded file', file }]);
    }
  };

  const askStreamQuestion = (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setConversation((prev) => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    let responseContent = '';
    const eventSource = new EventSource(`${backendUrl}/stream?question=${encodeURIComponent(question)}&emailId=${emailId}`);

 

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.content) {
        responseContent += data.content;
        setConversation((prev) => {
          const updatedConversation = [...prev];
          updatedConversation[updatedConversation.length - 1] = {
            role: 'Gpt-4',
            content: responseContent,
          };
          return updatedConversation;
        });
    
        // Split the text into words and limit to 30 words for speech
        let speechContent = responseContent.split(' ').slice(0, 40).join(' ');
        
        // Stop any ongoing speech before speaking the new content
        window.speechSynthesis.cancel();
        
        // Create a new utterance for the limited speech
        const utterance = new SpeechSynthesisUtterance(speechContent);
        window.speechSynthesis.speak(utterance);
    
        
      }
    };
    




    eventSource.onerror = (err) => {
      console.error("Error during streaming:", err);
      setLoading(false);
      eventSource.close();
    };

    eventSource.addEventListener('end', () => {
      setLoading(false);
      eventSource.close();
    });

    setConversation((prev) => [...prev, { role: 'Gpt-4', content: '' }]);
    setQuestion('');
  };

  const startListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      setIsListening(false);
    };


    
    

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        alert('Code copied to clipboard!');
      })
      .catch((err) => {
        console.error('Error copying text: ', err);
      });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  return (
    <div className="app-container">
      <div className="history-sidebar">
        <h2>Chat History</h2>
        <ul>
          {chatHistory.map((msg, index) => (
            <li key={index} className={`history-item ${msg.role}`}>
              <strong>{msg.role === 'user' ? 'You' : 'Gpt-4'}:</strong>
              {msg.content.slice(0, 20)}...
              {msg.file && msg.file.type.startsWith('image/') ? (
                <img src={URL.createObjectURL(msg.file)} alt="Uploaded" className="uploaded-image" />
              ) : (
                msg.file && msg.file.name && (
                  <span className="file-name">{msg.file.name}</span>
                )
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-section">
        <div className='top'>
          <h1>Chat with me (Stream)</h1>
          <button onClick={handleLogout} id='btn'>Logout</button>
        </div>

        <div className="chat-container">
          {conversation.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <strong>{msg.role === 'user' ? 'You' : 'Gpt-4'}:</strong>
              {msg.content.startsWith('```') ? ( // Check if the message is a code block
                <div>
                  <SyntaxHighlighter language="javascript" style={dracula}>
                    {msg.content.replace(/```/g, '')} {/* Remove the code block markers */}
                  </SyntaxHighlighter>
                  <button onClick={() => copyToClipboard(msg.content.replace(/```/g, ''))}>Copy Code</button>
                </div>
              ) : (
                <span>{msg.content}</span>
              )}
              {msg.file && msg.file.type.startsWith('image/') ? (
                <img src={URL.createObjectURL(msg.file)} alt="Uploaded" className="uploaded-image" />
              ) : (
                msg.file && msg.file.name && (
                  <span className="file-name">{msg.file.name}</span>
                )
              )}
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
        
        <button className="button" onClick={askStreamQuestion} disabled={loading}>
          {loading ? 'Loading...' : 'Ask (Stream)'}
        </button>
        
        <div className='lowBtn'>
          <button className="voice-button" id='btn' onClick={startListening} disabled={isListening}>
            {isListening ? 'Listening...' : 'Ask with Voice'}
          </button>
        </div>
        
        {/* File upload input */}
        <input className='file' type="file" onChange={handleFileUpload} />
      </div>
    </div>
  );
}

export default Mainchat;
