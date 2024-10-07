import React from 'react';

const ChatResponse = ({ question, response }) => {

  // Function to format response, breaking lines based on asterisks
  const formatResponse = (text) => {
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold for double asterisks
      .replace(/\*(.*?)\*/g, '<li>$1</li>')  // List item for single asterisk
      .replace(/\n/g, '<br/>');  // Line break

    return { __html: formattedText };  // Use dangerouslySetInnerHTML for HTML rendering
  };

  return (
    <div className="chat-response">
      <h4>Question:</h4>
      <p>{question || 'No question provided.'}</p>
      
      <h4>Response:</h4>
      <div dangerouslySetInnerHTML={formatResponse(response)} /> {/* Render formatted response */}
    </div>
  );
};

export default ChatResponse;
