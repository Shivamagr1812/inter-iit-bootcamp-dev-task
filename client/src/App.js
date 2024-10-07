import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import ChatMessage from './chatMessage';
import Login from './Components/Login';  
import Register from './Components/Register'; 
// import FileUpload from './Components/fileUpload';

function App() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const chatEndRef = useRef(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${backendUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      setConversation((prev) => [
        ...prev,
        { role: 'user', content: `File uploaded: ${file.name}` },
        { role: 'gpt', content: data.reply },
      ]);

      setFile(null); // Clear file input after uploading
    } catch (error) {
      console.error('Error:', error);
      setError('File upload failed.');
    } finally {
      setLoading(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const CopyButton = ({ textToCopy }) => {
    const handleCopy = () => {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          alert("Text copied to clipboard!");
        })
        .catch(err => {
          console.error("Failed to copy: ", err);
        });
    };

    return (
      <button onClick={handleCopy}>Copy</button>
    );
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError('');
    let fullResponse = '';

    try {
      // First, send the question via POST request
      const postRes = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token to headers
        },
        body: JSON.stringify({ question: question }),
      });

      if (!postRes.ok) {
        throw new Error('Failed to send question: Network response was not ok');
      }

      setConversation((prev) => [
        ...prev,
        { role: 'user', content: question },
        { role: 'gpt', content: '' }
      ]);

      // Then, stream the response using a GET request
      const streamRes = await fetch(`${backendUrl}/stream-chat?question=${encodeURIComponent(question)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token to headers
        },
      });

      if (!streamRes.ok) {
        throw new Error('Failed to stream response: Network response was not ok');
      }

      const reader = streamRes.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        setConversation((prev) => [
          ...prev.slice(0, -1),
          { role: 'gpt', content: fullResponse },
        ]);
      }

      setQuestion('');
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while fetching the response.');
    } finally {
      setLoading(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    // <Router>
        <div className="container">
          <h1>Chat with me</h1>

       {error && <div className="error-message">{error}</div>}

    {/* //       <Routes>
    //         <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
    //         <Route path="/register" element={<Register />} />
    //         <Route path="/" element={<Navigate to="/chat" />} /> {/* Default route */}
           {/* </Routes>   */}

          {/* {isAuthenticated && (
            <button onClick={handleLogout} className="button">
              Logout
            </button>
          // )} */} 

          {/* Chat container */}
          <div className="chat-container">
            {conversation.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <strong>{msg.role === 'user' ? 'You' : 'GPT-4'}:</strong>
                <ChatMessage msg={msg} />
                <CopyButton textToCopy={msg.content} />
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input section */}
          <textarea
            className="textarea"
            rows="4"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <br />
          <button className="button" onClick={askQuestion} disabled={loading}>
            {loading ? 'Loading...' : 'Ask'}
          </button>

          {/* File upload section */}
          <div className="file-upload">
            <input type="file" onChange={handleFileChange} />
            <button className="button" onClick={uploadFile} disabled={!file || loading}>
              {loading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </div>
      
);
}

export default App;
