
import React,{useState} from 'react';
import Login from './components/login';
import Mainchat from './components/Mainchat';
import Signup from './components/signup';
import { BrowserRouter, Route, Routes} from 'react-router-dom'

function App (){

return(<>
<BrowserRouter>
<Routes>
  <Route path='/login' element={<Login/>}></Route>
  <Route path='/' element={<Signup />}></Route>
  <Route path='/main' element={<Mainchat/>}></Route>
</Routes>
</BrowserRouter>



</>);






}
export default App;
















// import React, { useState, useEffect, useRef } from 'react';
// import './App.css';

// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const recognition = SpeechRecognition ? new SpeechRecognition() : null;

// function App() {
//     const [question, setQuestion] = useState('');
//     const [conversation, setConversation] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [isListening, setIsListening] = useState(false);
//     const [file, setFile] = useState(null);
//     const chatEndRef = useRef(null);
    
//     const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

//     // Function to handle streaming the response
//     const askStreamQuestion = (e) => {
//         e.preventDefault();
//         if (!question.trim()) return;

//         setConversation((prev) => [...prev, { role: 'user', content: question }]);
//         setLoading(true);

//         let responseContent = '';

//         const eventSource = new EventSource(`${backendUrl}/stream?question=${encodeURIComponent(question)}`);

//         eventSource.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             if (data.content) {
//                 responseContent += data.content;
//                 setConversation((prev) => {
//                     const updatedConversation = [...prev];
//                     updatedConversation[updatedConversation.length - 1] = {
//                         role: 'bot',
//                         content: responseContent,
//                     };
//                     return updatedConversation;
//                 });

//                 const utterance = new SpeechSynthesisUtterance(data.content);
//                 window.speechSynthesis.speak(utterance);
//             }
//         };

//         eventSource.onerror = (err) => {
//             console.error("Error during streaming:", err);
//             setLoading(false);
//             eventSource.close();
//         };

//         eventSource.addEventListener('end', () => {
//             setLoading(false);
//             eventSource.close();
//         });

//         setConversation((prev) => [...prev, { role: 'bot', content: '' }]); // Temporary bot message
//         setQuestion('');
//     };

//     // Function to handle file uploads
//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };

//     const uploadFile = async (e) => {
//       e.preventDefault();
//       if (!file) return;
  
//       const formData = new FormData();
//       formData.append('file', file);
  
//       try {
//           const response = await fetch(`${backendUrl}/upload`, {
//               method: 'POST',
//               body: formData,
//           });
  
//           const data = await response.json();
//           alert(data.message || "File uploaded successfully!");
  
//           // Add the uploaded file to the conversation
//           setConversation((prev) => [
//               ...prev,
//               { role: 'user', content: `Uploaded file: ${data.fileName}`, fileUrl: data.fileUrl, fileType: file.type }
//           ]);
  
//           setFile(null); // Clear the file input
//       } catch (error) {
//           console.error("Error uploading file:", error);
//           alert("Error uploading file.");
//       }
//   };
  
  
    
  

//     // Voice-to-text (Speech Recognition)
//     const startListening = () => {
//         if (!recognition) {
//             alert('Speech recognition is not supported in this browser.');
//             return;
//         }

//         setIsListening(true);
//         recognition.start();

//         recognition.onresult = (event) => {
//             const transcript = event.results[0][0].transcript;
//             setQuestion(transcript);
//             setIsListening(false);
//         };

//         recognition.onerror = (event) => {
//             console.error("Speech recognition error:", event.error);
//             setIsListening(false);
//         };

//         recognition.onend = () => {
//             setIsListening(false);
//         };
//     };

//     // Auto-scroll to the latest message
//     useEffect(() => {
//         chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [conversation]);

//     return (
//         <div className="app-container">
//             <div className="history-sidebar">
//                 <h2>Chat History</h2>
//                 <ul>
//                     {conversation.map((msg, index) => (
//                         <li key={index} className={`history-item ${msg.role}`}>
//                             <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content.slice(0, 20)}...
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             <div className="chat-section">
//                 <h1>Chat with me (Stream)</h1>
//                 <div className="chat-container">
//                     {conversation.map((msg, index) => (
//                         <div key={index} className={`message ${msg.role}`}>
//                             <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong>
//                             <span>{msg.content}</span>
//                         </div>
//                     ))}
//                     <div ref={chatEndRef} />
//                 </div>

//                 <textarea
//                     className="textarea"
//                     rows="4"
//                     placeholder="Ask a question..."
//                     value={question}
//                     onChange={(e) => setQuestion(e.target.value)}
//                 />
//                 <br />
//                 <button className="button" onClick={askStreamQuestion} disabled={loading}>
//                     {loading ? 'Loading...' : 'Ask (Stream)'}
//                 </button>

//                 <button className="voice-button" onClick={startListening} disabled={isListening}>
//                     {isListening ? 'Listening...' : 'Ask with Voice'}
//                 </button>

//                 <input type="file" onChange={handleFileChange} />
//                 <button className="button" onClick={uploadFile} disabled={!file}>
//                     Upload File
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default App;
