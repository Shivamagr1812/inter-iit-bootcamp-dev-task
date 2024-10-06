import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Chat from './components/Chat';
import InputSection from './components/InputSection';
import useChat from './components/useChat';

function App() {
  const { question, setQuestion, conversation, loading, error, askQuestion, chatEndRef } = useChat();

  return (
    <div className="container">
      <h1>Chat with me</h1>
      {error && <p className="error">{error}</p>}
      <Chat conversation={conversation} chatEndRef={chatEndRef} />
      <InputSection
        question={question}
        setQuestion={setQuestion}
        askQuestion={askQuestion}
        loading={loading}
      />
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default App;
