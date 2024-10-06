import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Chat from './pages/chat';
import Signin from './pages/signin';
import Signup from './pages/signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Chat />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;