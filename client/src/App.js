import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import Chat from './Chat';
import InputSection from './InputSection';

function App() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question }),
      });

      const data = await response.json();

      // Add the user's question and the server's response to the conversation
      setConversation((prev) => [
        ...prev,
        { role: 'user', content: question },
        { role: 'assistant', content: data.response },
      ]);

      setQuestion('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Apply syntax highlighting using Prism when conversation updates
  useEffect(() => {
    Prism.highlightAll();
    scrollToBottom();
  }, [conversation]);

  return (
    <div className="container">
      <h1>Chat with me</h1>
      <Chat conversation={conversation} chatEndRef={chatEndRef} />
      <InputSection question={question} setQuestion={setQuestion} askQuestion={askQuestion} loading={loading} />
    </div>
  );
}

export default App;
