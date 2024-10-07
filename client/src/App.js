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
  
  // const handleFileResponse = (fileName, response) => {
  //   setConversation((prev) => [
  //     ...prev,
  //     { role: 'user', content: `Uploaded file: ${fileName}` },  // Show the file name as the user input
  //     { role: 'gpt', content: response },  // Show the AI response after processing the file
  //   ]);
  //   chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

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
          ...prev.slice(0,-1),
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
  
  
  return (
    <div className="container">
      <h1>Chat with me</h1>

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
      {/* File upload section */}
      {/* <h2>Upload a file</h2>
      <FileUpload handleFileResponse={handleFileResponse} /> Include FileUpload here */}
    </div>
  );
}

export default App;
