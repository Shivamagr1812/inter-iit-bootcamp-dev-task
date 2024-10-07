import React, { useRef} from 'react';
import { FaPaperclip } from "react-icons/fa";
import '../css/FileUpload.css';

const FileUpload = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && onFileSelect) {
      onFileSelect(file); // Pass the file to parent component to display
    }
  };

  return (
    <div className="file-upload-container">
      <FaPaperclip className="attach-file-icon" onClick={handleFileUploadClick} />
      <input
        type="file"
        ref={fileInputRef}
        className="file-input"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default FileUpload;
