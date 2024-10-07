// Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Logout.css';
function Logout() {
	const navigate = useNavigate();

	const handleLogout = async () => {
		const response = await fetch('http://localhost:3000/api/auth/logout', {
			method: 'POST',
			credentials: 'include',
		});

		if (response.ok) {
			alert('Logout successful!');
			navigate('/login');
		} else {
			alert('Logout failed!');
		}
	};

	return (
		<div className='logout-container'>
			<h2>Are you sure you want to log out?</h2>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
}

export default Logout;
