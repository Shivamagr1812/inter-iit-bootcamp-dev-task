import React, { useEffect } from 'react';
import CodeBlock from './CodeBlock';
import '../styles/chat.css';

const Chat = ({ conversation, chatEndRef }) => {
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]); // Keep only conversation in dependency array

  const formatMessageContent = (content) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lang = part.match(/```([a-z]*)/);
        const language = lang ? lang[1] : 'javascript';
        const code = part.replace(/```([a-z]*)\n?/, '').replace(/```$/, '').trim();
        return <CodeBlock key={index} code={code} language={language} />;
      } else {
        const formattedText = part
          .replace(/`([^`]+)`/g, (match, code) => `<strong>${code}</strong>`)
          .replace(/\n/g, '<br />');
        return <p key={index} dangerouslySetInnerHTML={{ __html: formattedText }} />;
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
