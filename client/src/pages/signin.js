import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const serverUrl = process.env.REACT_APP_BACKEND_URL || 'localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${serverUrl}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Signin error:', error);
    }
  };

  return (
    <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '300px', gap: '10px' }}>
        <TextField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          required
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
        />
        <TextField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          required
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ color: 'white', '&:hover': { backgroundColor: 'primary.main', opacity: 0.9 } }}
        >
          Sign In
        </Button>
      </Box>
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
};

export default Signin;