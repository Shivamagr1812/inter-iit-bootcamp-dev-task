import { useState } from 'react';
import styles from './newQueryBox.module.css'
import axios from 'axios';
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded';
import CircularProgress from '@mui/material/CircularProgress';
import FileUpload from './uploadFile';

const NewQueryBox = ({ conversation, setConversation, setInfoText, chatEndRef }) => {
    const [question, setQuestion] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

    function formDataToObject(formData) {
        const obj = {};
        formData.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }

    const scrollDown = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    const askQuestion = async () => {
        if(question === '') return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('history', JSON.stringify(conversation));
            formData.append('query', question);

            const LLMResponse = await axios.post(backendUrl + '/chat', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

            formData.append('role', 'user');
            formData.delete('history');
            formData.delete('file');

            const currentQuery = formDataToObject(formData);

            setConversation((prevConversation) => [...prevConversation, currentQuery])
            setConversation((prevConversation) => [...prevConversation, LLMResponse.data]);
        }
        catch (error) {
            setInfoText('Some error occured, try again')
            setTimeout(() => setInfoText(''), 3000);
            console.log(error);
        }

        setQuestion('');
        setSelectedFile(null);
        setLoading(false);
        scrollDown();
    };

    return (
        <>
            <div className={styles.inputArea}>
                <FileUpload selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                <textarea
                    className={styles.textArea}
                    placeholder="Ask a question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <br />
                <button className={styles.button} onClick={askQuestion} disabled={loading}>
                    {loading ? <CircularProgress /> : <ArrowCircleUpRoundedIcon sx={{ fontSize: 30 }} />}
                </button>
            </div>
        </>
    );
}

export default NewQueryBox;