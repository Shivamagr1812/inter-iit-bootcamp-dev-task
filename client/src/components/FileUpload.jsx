import React, { useState } from 'react';
import '../App.css';

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');  // State for the upload status message
  const maxSizeInMB = 5;  // Set the maximum file size limit (in MB)
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;  // Convert to bytes

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > maxSizeInBytes) {
        setUploadStatus(`File size exceeds the ${maxSizeInMB}MB limit. Please choose a smaller file.`);
        setFile(null);  // Reset the file if it's too large
      } else {
        setFile(selectedFile);
        console.log('File selected:', selectedFile.name);
        setUploadStatus('');  // Clear any previous upload status
      }
    } else {
      console.log('No file selected');
    }
  };

  const handleUpload = () => {
    if (file) {
      console.log('Uploading file:', file.name);
      onFileUpload(file);  // Call parent function with the selected file
      setUploadStatus('File uploaded successfully!');  // Show the success message

      // Hide the message after 2 seconds
      setTimeout(() => {
        setUploadStatus('');
      }, 2000);  // 2000 milliseconds = 2 seconds

      setFile(null); // Reset the file after upload
    } else {
      console.log('No file is selected.');
      setUploadStatus('Please select a file to upload.');
    }
  };

  return (
    <div className="file-upload">
      <label className="custom-file-input">
        <input type="file" onChange={handleFileChange} accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
        Choose File{("<5MB")}
      </label>
      <button className='button' onClick={handleUpload}>Upload File</button>
      {file && <p>Selected file: {file.name}</p>}  {/* Display the selected file name */}
      
      {uploadStatus && <p className="upload-status">{uploadStatus}</p>} {/* Display the upload status message */}
    </div>
  );
};

export default FileUpload;
