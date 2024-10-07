// ChatInput.js
import React from 'react';

const ChatInput = ({ input, setInput, onSend }) => {

  const handleSubmit = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');  // Clear the text area after sending
    }
  };

  return (
    <div className="chat-input">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}  // Allow user to modify transcribed text
        placeholder="Type your question or use the mic..."
      ></textarea>
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default ChatInput;
