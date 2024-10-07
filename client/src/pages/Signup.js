// Signup.js
import React, { useState } from 'react';
import '../css/Signup.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';
import logo from '../css/VeggieLogo.png';

function Signup() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [dob, setDob] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await fetch('http://localhost:3000/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, email, password, dob }),
			credentials: 'include',
		});
		if (response.ok) {
			alert('User registered successfully!');
			navigate('/');
		} else {
			alert('Registration failed!');
		}
	};

	return (
		<div className='app-container'>
			<aside className='sidebar'>
				<div className='sidebar-logo'>
					<img src={logo} alt='Veggie Logo' />
				</div>
				<h1>VEGA AI</h1>
				<nav className='sidebar-nav'>
					<ul>
						<li>
							<a href='/'>Chat</a>
						</li>
						<li>History</li>
						<li>Settings</li>
						<li>Help</li>
					</ul>
				</nav>

				<div className='auth'>
					<ul>
						<li>
							{' '}
							<a href='/login'>Login</a>
						</li>
						<li>
							<a href='/signup'>Signup</a>
						</li>
					</ul>
				</div>
			</aside>

			<form className='signup-form' onSubmit={handleSubmit}>
				<h2>Sign Up</h2>
				<input
					type='text'
					placeholder='Username'
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				<input
					type='email'
					placeholder='Email'
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type='password'
					placeholder='Password'
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<input type='date' onChange={(e) => setDob(e.target.value)} required />
				<button type='submit'>Sign Up</button>
			</form>
		</div>
	);
}

export default Signup;
