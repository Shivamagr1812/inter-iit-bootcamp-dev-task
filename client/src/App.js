import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './login/login.jsx'; // Adjust the import based on your file structure
import Chat from './chat/chat.jsx'; // Your chat component or page
import Speech from './speech/speech.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Speech" element={<Speech />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
};

export default App;
