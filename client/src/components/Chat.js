import React, { useEffect } from 'react';
import CodeBlock from './CodeBlock';
import '../styles/chat.css';

const Message = ({ msg }) => {
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
          // Convert bold text
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
          .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italic*
          // Convert inline code
          .replace(/`([^`]+)`/g, '<code>$1</code>') // `code`
          // Convert new lines
          .replace(/\n/g, '<br />')
          // Convert list items to <li> tags
          .replace(/^\*\s+/gm, '<li>').replace(/<\/li>(?=\s*$)/g, '</li><li>') // Allow multiple <li> without <ul>
          .replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>'); // Wrap <li> in <ul>
        
        // This div is used to set inner HTML for formatted message
        return (
          <div key={index} dangerouslySetInnerHTML={{ __html: formattedText }} />
        );
      }
    });
  };
  
  return (
    <div className={`message ${msg.role}`}>
      <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>
      <span>{formatMessageContent(msg.content)}</span>
    </div>
  );
};

const Chat = ({ conversation, chatEndRef }) => {
  useEffect(() => {
    if (chatEndRef && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, chatEndRef]);

  return (
    <div className="chat-container">
      {conversation.map((msg, index) => (
        <Message key={index} msg={msg} />
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default Chat;
