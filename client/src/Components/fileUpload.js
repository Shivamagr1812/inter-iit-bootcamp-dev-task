import React, { useState } from 'react';

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  // Allowed file types and size limit (e.g., 5MB)
  const allowedFileTypes = ['text/plain', 'application/pdf']; // Modify as needed
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    
    // File validation
    if (uploadedFile) {
      if (!allowedFileTypes.includes(uploadedFile.type)) {
        setError('Invalid file type. Only plain text and PDF files are allowed.');
        setFile(null);
      } else if (uploadedFile.size > maxFileSize) {
        setError('File size exceeds the 5MB limit.');
        setFile(null);
      } else {
        setFile(uploadedFile);
        setError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={!file}>Upload File</button>
    </form>
  );
};

export default FileUpload;