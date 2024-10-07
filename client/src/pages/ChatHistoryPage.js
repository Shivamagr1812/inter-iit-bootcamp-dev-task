// src/pages/ChatHistoryPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../components/SideBar';
import axios from 'axios';

const ChatHistoryPage = () => {
  const { chatId } = useParams();  // Get the chat_id from the route
  const [selectedChat, setSelectedChat] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You must be logged in to view chats.');
          return;
        }
  
        const res = await axios.get(`http://localhost:5000/api/chats/${chatId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(res.data.messages);

        // Set the selected chat and also the previous chats
        setSelectedChat(res.data.messages);
        // Assuming res.data contains a list of chats or just the selected chat details
        setPreviousChats(res.data.messages);  // If the fetched data is a single chat, wrap it in an array
      } catch (error) {
        console.error('Error fetching chat history:', error);
        alert('Failed to load chat history.');
      }
    };
  
    fetchChatHistory();
  }, [chatId]);
  

  return (
    <div className="chat-page">
      <SideBar previousChats={previousChats} onSelectChat={setSelectedChat} />
      <div className="chat-area">
        {selectedChat ? (
          <div className="selected-chat">
            <h3>Question: {selectedChat.question}</h3>
            <p>Response: {selectedChat.response}</p>
          </div>
        ) : (
          <p>No chat selected or found.</p>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryPage;
