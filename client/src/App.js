import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  // Function to submit the question to the server
  const askQuestion = async () => {
    if (!question.trim()) return; // Prevent empty questions
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: question }), // Send the question as prompt
      });

      const data = await response.json();

      // Add the user's question and the server's response to the conversation
      setConversation((prevConversation) => [
        ...prevConversation,
        { role: 'user', content: question },
        { role: 'assistant', content: data.response }, // Response from backend
      ]);
      
      setQuestion(''); // Clear the input field
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately (you could add an error message to the conversation if needed)
    } finally {
      setLoading(false);
      scrollToBottom(); // Scroll to the bottom of the chat
    }
  };

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  return (
    <div className="container">
      <h1>Chat with me</h1>

      {/* Chat container */}
      <div className="chat-container">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>
            <span>{msg.content}</span>
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
