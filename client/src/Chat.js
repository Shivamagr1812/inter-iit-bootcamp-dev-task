// Chat.js
import React, { useEffect } from 'react';
import CodeBlock from './CodeBlock';

const Chat = ({ conversation, chatEndRef }) => {
  // Effect to scroll to the bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); // Scroll to bottom on new messages
  }, [conversation]);

  // Format message content to include syntax highlighting
  const formatMessageContent = (content) => {
    // Split the content into parts while preserving code blocks
    const parts = content.split(/(```[\s\S]*?```)/g); // Split on code block syntax

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // This is a code block; extract language and code
        const lang = part.match(/```([a-z]*)/);
        const language = lang ? lang[1] : 'javascript'; // Default to JavaScript
        const code = part.replace(/```([a-z]*)\n?/, '').replace(/```$/, '').trim(); // Remove the ``` markers
        
        // Return CodeBlock component
        return <CodeBlock key={index} code={code} language={language} />;
      } else {
        // Process regular text
        const formattedText = part
          .replace(/`([^`]+)`/g, (match, code) => `<strong>${code}</strong>`) // Bold inline code snippets
          .replace(/\n/g, '<br />'); // Replace line breaks with <br> tags
        return <p key={index} dangerouslySetInnerHTML={{ __html: formattedText }} />; // Wrap text in <p> tags
      }
    });
  };

  return (
    <div className="chat-container">
      {conversation.map((msg, index) => (
        <div key={index} className={`message ${msg.role}`}>
          <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>
          <span>{formatMessageContent(msg.content)}</span>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default Chat;
