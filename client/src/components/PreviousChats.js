// src/components/PreviousChats.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const PreviousChats = ({ chats }) => {
  const navigate = useNavigate();

  const handleViewChat = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="previous-chat-list">
      <h2>Previous Chat List</h2>
      <div className="chat-items">
        {chats.map((chat, index) => (
          <div key={index} className="chat-card">
            <h3 className="chat-title">{format(new Date(chat.createdAt), 'PPP')}</h3> {/* Only show the date */}
            <p>question: {chat.messages[0]?.question}</p>
            <button className="view-button" onClick={() => handleViewChat(chat._id)}>
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviousChats;
