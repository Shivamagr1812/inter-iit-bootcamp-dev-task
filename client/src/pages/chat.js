import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import MsgBox from '../components/MsgBox';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function Chat() {
    const [question, setQuestion] = useState('');
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFileSet, setIsFileSet] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const recorder = useRef(null);
    const fileInputRef = useRef(null);
    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'localhost:5000';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
            return;
        }
        console.log(backendUrl);
        fetch(`${backendUrl}/history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((response) => response.json()).then((data) => {
            setConversation(data);
            setTimeout(scrollToBottom, 100);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }, []);



    const scrollToBottom = () => {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    // Function to submit question to the server
    // Function to submit question to the server and handle streamed response
    const askQuestion = async () => {
        if (!question) return;

        const fileName = isFileSet ? fileInputRef.current.files[0].name : null;

        setLoading(true);
        setConversation((prevConversation) => [...prevConversation, { role: 'user', content: question, fileName: fileName }]);
        setConversation((prevConversation) => [...prevConversation, { role: 'model', content: '' }]);

        try {
            const formData = new FormData();
            formData.append('prompt', question);
            if (isFileSet) {
                formData.append('file', fileInputRef.current.files[0]);
            } else {
                formData.append('file', null);
            }

            const response = await fetch(`${backendUrl}/stream`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                let error = await response.text();
                error = JSON.parse(error);
                throw new Error(error.response);
            }

            const reader = response.body.getReader();
            let receivedLength = 0; // length of the received response
            let chunks = []; // array to collect chunks

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    setLoading(false);
                    break;
                }

                chunks.push(value);
                receivedLength += value.length;

                const chunkValue = new TextDecoder('utf-8').decode(value);
                let chunkData = JSON.parse(chunkValue);

                setConversation((prevConversation) => [
                    ...prevConversation.slice(0, -1),
                    { role: 'bot', content: prevConversation[prevConversation.length - 1].content + chunkData.chunk }
                ]);
                setTimeout(scrollToBottom, 100);
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
            setConversation((prevConversation) => [
                ...prevConversation.slice(0, -1),
                { role: 'bot', content: error.message }
            ]);
        }

        setQuestion('');
        setIsFileSet(false);
        fileInputRef.current.value = null;
    };

    // Adjust the handleUpload function to simply trigger the file input
    const triggerFileInput = () => {
        fileInputRef.current.click(); // Trigger the file input click
    };

    const handleFileChange = (event) => {
        setIsFileSet(true);
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
            recognition.start();
            recognition.onresult = (e) => {
                const transcript = Array.from(e.results)
                    .map((result) => result[0])
                    .map((result) => result.transcript)
                    .join('');
                setQuestion(transcript);
            }
            recognition.onend = () => {
                recognition.stop();
            }
            recorder.current = recognition;
        } else {
            recorder.current.stop();
        }
    }


    return (
        <div className='chatBody'>
            <div className='header'>
                <div className='dummy'>
                </div>
                <div className='logout'>
                    <Button onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/signin');
                    }}>Logout</Button>
                </div>
            </div>
            <div className="container">
                <h1>Chat with Gemini</h1>

                {/* Chat container */}
                <div className="chat-container">
                    {conversation && conversation.map((msg, index) => (
                        <div key={index}>
                            <MsgBox key={index} role={msg.role} content={msg.content} fileName={msg.fileName} />
                        </div>
                    ))}
                    <div ref={chatEndRef}></div>
                </div>

                {/* Input section */}
                <div className="input-container">
                    <textarea
                        className="textarea"
                        rows="3"
                        placeholder="Ask a question..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <div className={isRecording ? 'recording' : 'record'}>
                        <img
                            src="microphone.svg"
                            width={27}
                            height={27}
                            alt="record"
                            style={{ cursor: 'pointer' }}
                            onClick={toggleRecording}
                        />
                    </div>
                    <div className={isFileSet ? 'attached' : 'attach'}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <img
                            src="attachment.svg"
                            width={20}
                            height={20}
                            alt="attachment"
                            style={{ cursor: 'pointer' }}
                            onClick={triggerFileInput} // Adjusted to trigger file input
                        />
                    </div>
                </div>
                <br />
                <button className="button" onClick={askQuestion} disabled={loading}>
                    {loading ? 'Loading...' : 'Ask'}
                </button>
            </div>
        </div>
    );
}

export default Chat;
