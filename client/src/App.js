import React, { useState, useRef } from 'react';
import './App.css';
import ChatMessage from './chatMessage';

function App() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Added error state
  const chatEndRef = useRef(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

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
    setError(''); // Reset error state

    try {
      const res = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      console.log('Server response:', data.reply);

      setConversation((prev) => [
        ...prev,
        { role: 'user', content: question },
        { role: 'gpt', content: data.reply },
      ]);

      setQuestion('');
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while fetching the response.'); // Set error message
    } finally {
      setLoading(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container">
      <h1>Chat with me</h1>

      {/* Error message display */}
      {error && <div className="error-message">{error}</div>}

      {/* Chat container */}
      <div className="chat-container">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'GPT-4'}:</strong>
            {/* <span>{msg.content}</span> */}
            <ChatMessage msg = {msg}/>
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
    </div>
  );
}

export default App;
