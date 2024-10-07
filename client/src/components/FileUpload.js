// src/components/FileUpload.js
import React, { useState } from 'react';
import '../styles/FileUpload.css'; // Import the CSS file

const FileUpload = ({ file, setFile }) => { // Receive file and setFile as props
  const [isUploaded, setIsUploaded] = useState(false); // New state for upload status

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsUploaded(false); // Reset upload status when a new file is selected
    console.log('Selected file:', selectedFile);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('File upload response:', data);
      setIsUploaded(true); // Set upload status to true after successful upload
      // Optionally reset the file selection after upload
      // setFile(null); // Uncomment this line if you want to reset the file after upload
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleResetFile = () => {
    setFile(null); // Reset the file selection
    setIsUploaded(false); // Reset upload status
  };

  return (
    <div className="upload-container">
      <label htmlFor="file-upload" className="upload-label ">
        {'Choose File'}
      </label>
      <input
        id="file-upload"
        className="file-input"
        type="file"
        accept=".txt,.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
        onChange={handleFileChange}
      />
      <div className="file-management">
        {/* Display the selected file name */}
        {file && (
          <div className="file-info">
            <span>{file.name}</span>
            <button className="reset-button" onClick={handleResetFile}>Remove</button> {/* Option to remove file */}
            {!isUploaded && (
              <button className="upload-button" onClick={handleFileUpload}>
                Upload
              </button>
            )}
            {isUploaded && (
              <span className="upload-status">File Uploaded Successfully</span> // Success message
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
