import React, { useState, useRef } from 'react';
import Text from '../components/Text';
import '../App.css';

const Chat = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const backendUrl = 'http://localhost:5000'; // Ensure the backend server is running

  // Function to submit question to the server
  const askQuestion = async () => {
    if (!question.trim()) return; // Don't send empty questions
    setLoading(true);
    try {

      setConversation((prev) => [
        ...prev,
        { role: 'user', content: question },
      ]);


      // Post question to backend
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userInput: question }) // Send as `userInput` to match backend
      });

      console.log(response);

      const data = await response.json();

      console.log(data);
      const answer = data.message; // Adjust to match the backend response key
      console.log(answer);

      // Update the conversation
      setConversation((prev) => [
        ...prev,
        { role: 'groq', content: answer }
      ]);

      // Clear the input
      setQuestion('');
    } catch (error) {
      console.error("Error fetching response from server:", error);
    } finally {
      setLoading(false);
      // Scroll to bottom of chat
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container">
      <h1>Chat with me</h1>

      {/* Chat container */}
      <div className="chat-container">
        {conversation.map((msg, index) => (
          <Text key={index} msg={msg} />

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

export default Chat;
