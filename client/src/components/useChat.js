import { useState, useEffect, useRef } from 'react';
import Prism from 'prismjs';

const useChat = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  // const backendUrl = 'https://inter-iit-bootcamp-dev-task.onrender.com'; // uncomment before hosting 
  const backendUrl = 'http://localhost:5000';  // development 

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get the error response
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const data = await response.json();
      setConversation((prev) => [
        ...prev,
        { role: 'user', content: question },
        { role: 'assistant', content: data.response },
      ]);
      setQuestion('');
    } catch (error) {
      console.error('Error:', error);
      setError('There was an error processing your request. Please try again.');
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Highlight syntax when conversation updates
  useEffect(() => {
    Prism.highlightAll();
    scrollToBottom();
  }, [conversation]);

  return {
    question,
    setQuestion,
    conversation,
    loading,
    error,
    askQuestion,
    chatEndRef,
  };
};

export default useChat;
