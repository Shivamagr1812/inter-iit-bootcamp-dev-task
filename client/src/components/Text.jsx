// Text.jsx
import React from 'react';

function Text({ msg }) {
  return (
    <div className={`message ${msg.role}`}>
      <strong>{msg.role === 'user' ? 'You' : 'Groq'}:</strong>
      <span className="content">{msg.content}</span>
    </div>
  );
}

export default Text;
