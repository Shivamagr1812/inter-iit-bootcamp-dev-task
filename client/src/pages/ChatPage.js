import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import ChatResponse from '../components/ChatResponse'; // Import the ChatResponse component
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const ChatPage = () => {
  const [previousChats, setPreviousChats] = useState([]);  // History of the current session's chats
  const [selectedChat, setSelectedChat] = useState(null);  // Currently selected chat
  const [question, setQuestion] = useState('');  // User's question
  const [response, setResponse] = useState('Welcome! I am GenAI. Ask me anything.');  // Initial response from AI
  const [loading, setLoading] = useState(false);  // Loading state to indicate waiting for response

  const navigate = useNavigate();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    console.warn('Browser does not support Speech Recognition.');
  }

  // Start listening for speech input
  const startListening = () => {
    if (!browserSupportsSpeechRecognition) {
      console.error('Browser does not support Speech Recognition.');
      return;
    }
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  };

  // Stop listening and set the transcript as the question
  const stopListening = () => {
    SpeechRecognition.stopListening();
    setQuestion(transcript);
    resetTranscript();  // Optional: Clear the transcript after setting it as question
  };

  // Handle sending the question to the backend and getting the response
  const handleSend = async () => {
    if (question.trim() === '') return;  // Prevent sending an empty question

    setLoading(true);  // Set loading state to true while waiting for the response

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/questions', { // Updated endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include JWT token
        },
        body: JSON.stringify({ question })
      });

      if (res.status === 401) {
        // Unauthorized, possibly token expired
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const responseFromAI = data.response || 'No response from AI.';

      // Store the new chat with the question and response
      const newChat = { question, response: responseFromAI };
      setPreviousChats(prev => [...prev, newChat]);  // Update chat history for the current session
      setSelectedChat(newChat);  // Show the new question and response
      setResponse(newChat.response);  // Update response in UI
      setQuestion('');  // Clear the input field

      console.log(previousChats);

    } catch (error) {
      console.error('Error fetching response from backend:', error);
      setResponse('Sorry, something went wrong while fetching the response.');
    } finally {
      setLoading(false);  // Reset the loading state once the response is received or on error
    }
  };

  // Handle saving the current session's chats
  const handleSaveChat = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to save chats.');
      navigate('/login');
      return;
    }

    if (previousChats.length === 0) {
      alert('There are no chats to save.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include JWT token
        },
        body: JSON.stringify({ chats: previousChats })  // Send entire session chats
      });

      if (res.status === 401) {
        // Unauthorized, possibly token expired
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      alert('Chat session saved successfully!');
    } catch (error) {
      console.error('Error saving chat session:', error);
      alert('Sorry, something went wrong while saving the chat session.');
    }
  };

  // Handle chat selection from the current session history
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setQuestion(chat.question);  // Set the question to the selected chat
    setResponse(chat.response);  // Set the response for the selected chat
  };

  return (
    <div className="chat-page">
      <SideBar previousChats={previousChats} onSelectChat={handleSelectChat} />
      <div className="chat-area">
        {/* {selectedChat && (
          <div className="selected-chat">
            <h3>Question: {selectedChat.question}</h3>
            <p>Response: {selectedChat.response}</p>
          </div>
        )} */}
        {/* Pass both the question and the response to ChatResponse */}
        <ChatResponse question={question} response={response} />

        {/* Input Area for typing or using voice input */}
        <div className="input-area">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question or use the mic to ask..."
            className="input-box"
            disabled={loading}  // Disable input while loading
          />
          <div className="input-buttons">
            <button onClick={handleSend} disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
            <button onClick={startListening} disabled={listening || loading}>
              {listening ? 'Listening...' : 'Start Listening'}
            </button>
            <button onClick={stopListening} disabled={!listening}>
              Stop Listening
            </button>
            <button 
              className="save-chat-button" 
              onClick={handleSaveChat} 
              disabled={loading || previousChats.length === 0}
            >
              Save Chat
            </button>
          </div>
        </div>

        {/* Optional: Display the live transcript */}
        {listening && (
          <div className="transcript">
            <p>Listening... Speak into your microphone.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
