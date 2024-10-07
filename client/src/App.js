// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChatPage from './pages/ChatPage';
import Dashboard from './pages/Dashboard';
import ChatHistoryPage from './pages/ChatHistoryPage';
import FileUploadPage from './pages/FileUploadPage';
import './styles.css';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/fileUpload" element={<FileUploadPage />} />  {/* Add the new route */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat/:chatId" element={<ChatHistoryPage />} />
      </Routes>
    </Router>
  );
};

export default App;









// // App.js
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import ChatPage from './pages/ChatPage';
// import Dashboard from './pages/Dashboard';
// import './styles.css';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="chat" element={<ChatPage/>}/>
//       </Routes>
//     </Router>
//   );
// };

// export default App;








































// import React, { useState, useEffect, useRef } from 'react';
// import './App.css';

// function App() {
//   const [question, setQuestion] = useState('');
//   const [conversation, setConversation] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const chatEndRef = useRef(null);

//   const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

//   // Function to submit question to the server
//   const askQuestion = async () => {
//     // TODO: Implement the function to send the question to the server
//   };

//   return (
//     <div className="container">
//       <h1>Chat with me</h1>

//       {/* Chat container */}
//       <div className="chat-container">
//         {conversation.map((msg, index) => (
//           <div key={index} className={`message ${msg.role}`}>
//             <strong>{msg.role === 'user' ? 'You' : 'GPT-4'}:</strong>
//             <span>{msg.content}</span>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input section */}
//       <textarea
//         className="textarea"
//         rows="4"
//         placeholder="Ask a question..."
//         value={question}
//         onChange={(e) => setQuestion(e.target.value)}
//       />
//       <br />
//       <button className="button" onClick={askQuestion} disabled={loading}>
//         {loading ? 'Loading...' : 'Ask'}
//       </button>
//     </div>
//   );
// }

// export default App;
