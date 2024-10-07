import { BrowserRouter,Routes,Route } from 'react-router-dom'
import React from 'react';
import './App.css';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import Login from './pages/Login';



function App() {
  

  return (
    <BrowserRouter>
 
      <Routes>
        {/* <Route path='/' element={<Home/>}/> */}
        <Route path='/' element={<Login/>}/> 
        <Route path='/signup' element={<Signup />}/>
        <Route path='/chat' element={<Chat/>}/>
      </Routes>
    
    </BrowserRouter>
  );
}

export default App;
