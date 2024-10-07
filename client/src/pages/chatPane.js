import { useState, useRef } from 'react';
import styles from './chatPane.module.css'
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; 
import NewQueryBox from '../components/QueryBox.js/newQueryBox';
import CopyToClipboard from '../components/addOnFunctions/copyToClipBoard';
import ListenResponse from '../components/addOnFunctions/listenResponse';

const ChatPane = () => {
    const [infoText, setInfoText] = useState('');
    const [conversation, setConversation] = useState([]);
    const chatEndRef = useRef(null);

    return (
        <div className={styles.container}>
            <p className={styles.introText}>How can I help you today?</p>

            <div className={styles.chatContainer}>
                {conversation.map((msg, index) => (
                    <div key={index} className={styles[msg.role === 'user' ? 'user' : 'gemini']}>
                        <Markdown rehypePlugins={[rehypeHighlight]}>{msg.query || msg.content}</Markdown>
                        {msg.role !== 'user' && 
                        (<div className={styles.addOns}>
                            <CopyToClipboard content={msg.content} setInfoText={setInfoText}/>
                            <ListenResponse content={msg.content}/>    
                        </div>
                        )}
                    </div>
                ))}
                <div ref={chatEndRef}/>
            </div>

            <NewQueryBox conversation={conversation} setConversation={setConversation} setInfoText={setInfoText} chatEndRef={chatEndRef}/>

            <span className={styles.error_description}>{infoText}</span>

        </div>

    );

}

export default ChatPane;