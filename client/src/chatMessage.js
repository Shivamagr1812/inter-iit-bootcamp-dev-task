import React from 'react';
import './chatMessage.css';
// import './components/copy.css'
// import CopyButton from './components/copy'

const formatResponse = response => {
    // Replace *xyz* with <b>xyz</b> for bolding
    let formattedResponse = response.replace(/\*(.*?)\*/g, '<b>$1</b>');
    
    // Replace newlines with <br/> for line breaks (optional)
    formattedResponse = formattedResponse.replace(/\*/g, '<br/>');
    
    return formattedResponse;
  };
  

const chatMessage = ({ msg }) => {
    return (
      <div className="chat-message">
        <pre className="response-content">
          <code
            className="language-cpp"
            dangerouslySetInnerHTML={{ __html: formatResponse(msg.content) }}
          />
        </pre>
        {/* <CopyButton textToCopy = {msg.content} /> */}
      </div>
    );
  };
export default chatMessage;