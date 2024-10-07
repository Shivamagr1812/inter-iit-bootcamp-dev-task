import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import useLogout from '../../hooks/useLogout';

function Home() {
  const token = JSON.parse(localStorage.getItem("chat-user"));
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const {logout} = useLogout();

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

  // Fetch all chats when the component mounts
  useEffect(() => {
    const getAllChats = async () => {
      try {
        const response = await fetch(`${backendUrl}/stream?userId=${token._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const chatsObj = await response.json();
        // console.log(chatsObj.chats);
        setConversation([...chatsObj.chats]); // Store the chat history
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    getAllChats();
  }, [backendUrl, token._id]); // Run once when the component mounts

  // Function to submit a question to the server
  const askQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: question,
          userId: token._id,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await res.json();
      setConversation((prev) => [
        ...prev,
        { sender: "user", message: question },
        { sender: "GPT", message: data.text },
      ]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to the bottom of the chat when a new message is added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  return (
    <div className="container">
      <h1>Chat with me</h1>

      {/* Chat container */}
      <div className="chat-container">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <strong>{msg.sender === 'user' ? 'You' : 'GPT'}:</strong>
            <span>{msg.message}</span>
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
      <button onClick={logout}>LOGOUT</button>
    </div>
  );
}

export default Home;
