import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the modern createRoot
import './css/index.css';
import MainApp from './App'; // Ensure you're importing MainApp

const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot to create the root
root.render(
	<React.StrictMode>
		<MainApp />
	</React.StrictMode>
);
