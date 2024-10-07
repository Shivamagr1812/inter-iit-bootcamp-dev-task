import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddNewChat = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    console.log(process.env.GEMINI_API_KEY);
    navigate('/chat');
  };

  return (
    <div className="add-new-chat">
      <button className="add-new-button" onClick={handleButtonClick}>+Add New</button>
    </div>
  );
};

export default AddNewChat;