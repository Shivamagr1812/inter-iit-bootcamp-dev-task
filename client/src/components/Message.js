// src/components/Message.js
import React from 'react';
import CodeBlock from './CodeBlock';
import parse from 'html-react-parser';

const Message = ({ msg }) => {
  const formatMessageContent = (content) => {
    // Split the content into parts while preserving code blocks
    const parts = content.split(/(```[\s\S]*?```)/g); // Split on code block syntax

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        return <CodeBlock key={index} code={part} />;
      } else {
        const formattedText = part
          .replace(/`([^`]+)`/g, (match, code) => `<strong>${code}</strong>`) // Bold inline code snippets
          .replace(/\n/g, '<br />'); // Replace line breaks with <br> tags
        return <p key={index}>{formattedText}</p>; // Wrap text in <p> tags
      }
    });
  };

  return (
    <div className={`message ${msg.role}`}>
      <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>
      <span>{parse(formatMessageContent(msg.content))}</span>
    </div>
  );
};

export default Message;
