import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaRegCopy } from "react-icons/fa";


const Text = ({ msg }) => {
  const [isCopied, setIsCopied] = useState(false);

  // Handle copy function
  const handleCopy = (content) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      })
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  // Function to detect the code block and its language
  const parseMessage = (message) => {
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;  // Regex to detect language and code block
    let match;
    const parts = [];
    
    // Loop through the message to find all code blocks
    let lastIndex = 0;
    while ((match = codeRegex.exec(message)) != null) {
      const language = match[1] || "plaintext"; // Use specified language or default to plaintext
      const codeContent = match[2];
      
      // Add text before the code block
      if (lastIndex < match.index) {
        parts.push({
          type: "text",
          content: message.slice(lastIndex, match.index),
        });
      }

      // Add the code block with detected language
      parts.push({
        type: "code",
        language,
        content: codeContent,
      });
      
      lastIndex = codeRegex.lastIndex;
    }
    
    // Add any remaining text after the last code block
    if (lastIndex < message.length) {
      parts.push({
        type: "text",
        content: message.slice(lastIndex),
      });
    }

    return parts;
  };

  const parsedContent = parseMessage(msg.content);

  return (
    <div className={`message ${msg.role}`}>
      <strong>{msg.role === 'user' ? 'You' : 'Gorq'}:</strong>
      <span className='content'>
        {parsedContent.map((part, index) => (
          <div key={index}>
            {part.type === "text" && (
              <div>
                <span>{part.content}</span>
                {/* Only show SpeechButton if msg.role is 'Gorq' */}
                {/* {msg.role === 'groq' && <SpeechButton text={part.content} />} */}
              </div>

            )}
            {part.type === "code" && (
              <div className='code-content'>
                <div className='code-head'>
                  <small>Language: {part.language}</small> {/* Show detected language */}
                  <button className='copy-button' onClick={() => handleCopy(part.content)}>
                    {isCopied ? 'Copied!' : <FaRegCopy />}
                  </button>
                </div>
                
                 {/* Show code block */}
                <SyntaxHighlighter className='code-block' language={part.language} style={okaidia}>
                  {part.content}
                </SyntaxHighlighter>
                
              </div>
            )}
          </div>
        ))}
      </span>
    </div>
  );
};

export default Text;

// import React, { useState } from 'react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { FaRegCopy } from "react-icons/fa";
// import SpeechButton from './SpeechButton'; // Import the SpeechButton component

// const Text = ({ msg }) => {
//   const [isCopied, setIsCopied] = useState(false);

//   // Handle copy function
//   const handleCopy = (content) => {
//     navigator.clipboard.writeText(content)
//       .then(() => {
//         setIsCopied(true);
//         setTimeout(() => setIsCopied(false), 3000);
//       })
//       .catch((err) => console.error("Failed to copy text: ", err));
//   };

//   // Function to detect the code block and its language
//   const parseMessage = (message) => {
//     const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;  // Regex to detect language and code block
//     let match;
//     const parts = [];
    
//     // Loop through the message to find all code blocks
//     let lastIndex = 0;
//     while ((match = codeRegex.exec(message)) != null) {
//       const language = match[1] || "plaintext"; // Use specified language or default to plaintext
//       const codeContent = match[2];
      
//       // Add text before the code block
//       if (lastIndex < match.index) {
//         parts.push({
//           type: "text",
//           content: message.slice(lastIndex, match.index),
//         });
//       }

//       // Add the code block with detected language
//       parts.push({
//         type: "code",
//         language,
//         content: codeContent,
//       });
      
//       lastIndex = codeRegex.lastIndex;
//     }
    
//     // Add any remaining text after the last code block
//     if (lastIndex < message.length) {
//       parts.push({
//         type: "text",
//         content: message.slice(lastIndex),
//       });
//     }

//     return parts;
//   };

//   const parsedContent = parseMessage(msg.content);

//   return (
//     <div className={`message ${msg.role}`}>
//       <strong>{msg.role === 'user' ? 'You' : 'Gorq'}:</strong>
//       <span className='content'>
//         {parsedContent.map((part, index) => (
//           <div key={index}>
//             {part.type === "text" && (
//               <span>{part.content}</span>
//             )}
//             {part.type === "code" && (
//               <div className='code-content'>
//                 <div className='code-head'>
//                   <small>Language: {part.language}</small> {/* Show detected language */}
//                   <button className='copy-button' onClick={() => handleCopy(part.content)}>
//                     {isCopied ? 'Copied!' : <FaRegCopy />}
//                   </button>
//                   {/* Speech button to read aloud the code */}
//                   <SpeechButton text={part.content} />
//                 </div>
                
//                  {/* Show code block */}
//                 <SyntaxHighlighter className='code-block' language={part.language} style={okaidia}>
//                   {part.content}
//                 </SyntaxHighlighter>
                
//               </div>
//             )}
//           </div>
//         ))}
//       </span>
//     </div>
//   );
// };

// export default Text;

