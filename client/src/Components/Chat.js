import React, { useState, useEffect, useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Chat.css';

const Chat = ({ username }) => {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const backendUrl = 'http://localhost:5000';

  
  useEffect(() => {
    const getChatHistory = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/chat/history/${encodeURIComponent(username)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          
        });
        const data = await response.json();
        console.log(data.history);
        setHistory(data.history || []);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    getChatHistory();
  }, [username , backendUrl]);

  const extractCodeBlock = (response) => {
    const code = response.match(/```(.*?)```/s); 
    return code ? code[1].trim() : '';
  };

  const handleQuestionSubmit = async () => {
    if (!prompt.trim() && !file && !audioBlob) {
      console.error('No input provided: prompt, file, or audio is required.');
      return;
    }

    if (!username) {
      console.error('Username is missing.');
      return;
    }

    setLoading(true);

    try {
      let aiResponse;
      const formData = new FormData();
      formData.append('user', username);

      
      if (file) {

        if (!prompt) {
          formData.append('prompt', 'Explain');
      }
      else{
        formData.append('prompt', prompt);
      }
      

        formData.append('files', file);

        

        const response = await fetch(`${backendUrl}/api/file`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'File upload failed.');
        }

        // aiResponse = await response.text();
        const jsonResponse = await response.json();
        aiResponse = jsonResponse.message;
      }
     
      else if (audioBlob) {
        const audioFile = new File([audioBlob], 'audio.mp3', { type: 'audio/mp3' });
        formData.append('files', audioFile);
        formData.append('prompt', prompt.trim() || 'Respond to this audio');

        const response = await fetch(`${backendUrl}/api/audio`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Audio upload failed.');
        }

        // aiResponse = await response.text();
        const jsonResponse = await response.json();
        aiResponse = jsonResponse.message;

      }
      
      else {
        const response = await fetch(`${backendUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: username, prompt: prompt.trim() }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Prompt submission failed.');
        }

        aiResponse = await response.text();
      }

     
      setHistory((prev) => [
        ...prev,
        { role: 'user', content: prompt.trim() || 'Respond to this audio' },
        { role: 'ai', content: aiResponse || 'No response from AI' },
      ]);
    } catch (error) {
      console.error('Error processing request:', error);
    } finally {
      setLoading(false);
      setPrompt('');
      setFile(null);
      setAudioBlob(null);
    }
  };
  

  
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleFileSelection = (e) => setFile(e.target.files[0]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const audio = new Blob(chunks, { type: 'audio/mp3' });
        setAudioBlob(audio);
        setIsRecording(false);
        streamRef.current.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start audio recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const ChatMessages = ({ history }) => {
    const parseCode = (content) => {
      const codeBlock = content.match(/```([\s\S]*?)```/);
      return codeBlock ? codeBlock[1] : '';
    };

    const formatExplanation = (content) => {
      let explanation = content.split('```').pop();
      explanation = explanation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      explanation = explanation.replace(/`(.*?)`/g, '<code>$1</code>');
      return explanation.trim();
    };

    

    return (
      <div className="chat-container">
        {history.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div style={{ fontWeight: 'bold' }}>{msg.userMessage}</div>
            <br/>
            <div>{msg.aiResponse}</div>
            {msg.role === 'ai' && msg.content.startsWith('```') ? (
              <div>
                <SyntaxHighlighter language="python" style={coy}>
                  {parseCode(msg.content)}
                </SyntaxHighlighter>
                <CopyToClipboard text={parseCode(msg.content)}>
                  <button>Copy to Clipboard</button>
                </CopyToClipboard>
                <p dangerouslySetInnerHTML={{ __html: formatExplanation(msg.content) }} />
              </div>
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
    );
  };
  
  
  const removeSelectedFile = () => setFile(null);

  return (
    <div>
      <ChatMessages history={history} />

      {file && (
        <div className="file-info">
          <span>{file.name}</span>
          <button className="remove-file-button" onClick={removeSelectedFile}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      <div className="input-container">
        <span className="file-upload-icon" onClick={() => fileInputRef.current.click()}>
          <i className="fa-solid fa-paperclip"></i>
          <input
            type="file"
            onChange={handleFileSelection}
            className="file-input"
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </span>
        <textarea
          className="textarea"
          rows="4"
          placeholder="Ask a question..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <span className="audio-upload-icon" onClick={isRecording ? stopRecording : startRecording}>
          <i className={`fa-solid fa-${isRecording ? 'stop' : 'microphone'}`}></i>
        </span>
      </div>

      {audioBlob && (
        <div className="file-info">
          <span>Audio ready for upload</span>
          <button className="remove-file-button" onClick={() => setAudioBlob(null)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      <button className="button" onClick={handleQuestionSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>
    </div>
  );
};

export default Chat;
