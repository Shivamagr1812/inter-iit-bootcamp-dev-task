// Sidebar.js
import React from 'react';

const SideBar = ({ previousChats, onSelectChat }) => {
  return (
    <div className="sidebar">
      <h3>Previous Questions</h3>
      <ul>
        {previousChats.map((chat, index) => (
          <li key={index} onClick={() => onSelectChat(chat)}>
            {chat.question}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
