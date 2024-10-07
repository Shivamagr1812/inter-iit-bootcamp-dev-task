import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FileUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);  // File selected by the user
  const [question, setQuestion] = useState('');  // Question regarding the uploaded file
  const [response, setResponse] = useState('Please upload a PDF file and ask your question.');  // Initial response
  const [loading, setLoading] = useState(false);  // Loading state

  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);  // Set the selected file if it is a PDF
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  // Function to format response, breaking lines based on asterisks
  const formatResponse = (text) => {
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold for double asterisks
      .replace(/\*(.*?)\*/g, '<li>$1</li>')  // List item for single asterisk
      .replace(/\n/g, '<br/>');  // Line break

    return { __html: formattedText };  // Use dangerouslySetInnerHTML for HTML rendering
  };

  // Handle sending the file and question to the backend
  const handleSend = async () => {
    if (!selectedFile || question.trim() === '') {
      alert('Please upload a PDF file and ask a question.');
      return;
    }

    setLoading(true);  // Set loading state

    const token = localStorage.getItem('token');  // Retrieve JWT from localStorage
    const formData = new FormData();
    formData.append('pdfFile', selectedFile);  // Add the selected file to form data
    formData.append('question', question);  // Add the question

    try {
      const res = await axios.post('http://localhost:5000/api/questions/file', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Include JWT token in request headers
          'Content-Type': 'multipart/form-data',  // Specify form data as content type
        },
      });

      if (res.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const responseFromAI = res.data.response || 'No response from AI.';
      setResponse(responseFromAI);  // Set the response from the backend
      setSelectedFile(null);  // Clear the file input
      setQuestion('');  // Clear the question input
    } catch (error) {
      console.error('Error uploading file or fetching response:', error);
      setResponse('Sorry, something went wrong while processing the file.');
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

  return (
    <div className="file-upload-page">
      {/* <SideBar />  Optional: Include the sidebar for navigation */}
      
      <div className="upload-area">
        <h2>Upload PDF and Ask a Question</h2>
        
        {/* File Upload Section */}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={loading}  // Disable input while loading
        />
        
        {/* Text Area to ask a question about the uploaded PDF */}
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the uploaded PDF..."
          rows={3}
          disabled={loading || !selectedFile}  // Disable if no file selected or loading
        />
        
        {/* Buttons to send file and question */}
        <div className="upload-buttons">
          <button onClick={handleSend} disabled={loading || !selectedFile || question.trim() === ''}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </div>

        {/* Display formatted response from backend */}
        <div className="response-area">
          <h3>Response from AI:</h3>
          <div dangerouslySetInnerHTML={formatResponse(response)} /> {/* Render formatted response */}
        </div>
      </div>
    </div>
  );
};

export default FileUploadPage;
