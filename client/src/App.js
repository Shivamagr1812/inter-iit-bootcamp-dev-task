import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPane from './pages/loginPane';
import ChatPane from './pages/chatPane'; // Example of a protected component
import ProtectedRoute from './components/protectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<LoginPane/>} />
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatPane/>
          </ProtectedRoute>}>
        </Route>
        <Route path='*' element={<LoginPane/>} />
      </Routes>
    </Router>
  );
}

export default App;
