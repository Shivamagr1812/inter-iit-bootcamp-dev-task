// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' exact element={<Home />} />
				<Route path='/signup' element={<Signup />} />
				<Route path='/login' element={<Login />} />
				<Route path='/logout' element={<Logout />} />
			</Routes>
		</Router>
	);
}

export default App;
