import React, { useRef } from 'react';
import styles from './uploadFile.module.css'
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';

function FileUpload({selectedFile, setSelectedFile}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleClick = () => {
    fileInputRef.current.click(); 
  };

  return (
    <div>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange}
      />
      
      <button className={styles.button} onClick={handleClick}>
        <AttachFileRoundedIcon/>
      </button>

      {selectedFile && <p>{selectedFile.name}</p>}
    </div>
  );
}

export default FileUpload;
