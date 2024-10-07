import React, { useState, useRef, useEffect } from 'react';
import CodeBlock from '../Components/Codeblock'; // Ensure this component handles language highlighting
import { marked } from 'marked';
import 'prismjs/components/prism-javascript'; // JavaScript
import 'prismjs/components/prism-python'; // Python
import 'prismjs/components/prism-java'; // Java
import 'prismjs/components/prism-c'; // C
import 'prismjs/components/prism-cpp'; // C++
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition';
import '../css/Home.css';
import logo from '../css/VeggieLogo.png';

function Home() {
	const [question, setQuestion] = useState('');
	const [conversation, setConversation] = useState([]);
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState(null);
	const [isTTSActive, setIsTTSActive] = useState(false);
	const [error, setError] = useState('');
	const fileInputRef = useRef(null);
	const chatEndRef = useRef(null);

	useEffect(() => {
		const fetchChatHistory = async () => {
			setLoading(true);

			try {
				const response = await fetch(`${backendUrl}/history`, {
					method: 'GET',
					credentials: 'include', 
				});
				if (response.ok) {
					const data = await response.json();
					setConversation(data); 
				} else {
					console.error('Failed to fetch chat history');
				}
			} catch (error) {
				console.error('Error fetching chat history:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchChatHistory();
	}, []);

	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition();
	const backendUrl =
		process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000/api/chat';

    //Speech-to-text
	const startListening = () => {
		SpeechRecognition.startListening({ continuous: true });
	};

	const stopListening = () => {
		SpeechRecognition.stopListening();
		setQuestion(transcript);
		resetTranscript();
	};

    // function to ask question
	const askQuestion = async (trimmedQuestion) => {
		setLoading(true);
		setConversation((prev) => [
			...prev,
			{ role: 'user', content: trimmedQuestion },
		]);

		const formData = new FormData();
		formData.append('question', trimmedQuestion);
		if (file) {
			formData.append('file', file);
		}

		try {
			const response = await fetch(backendUrl, {
				method: 'POST',
				body: formData,
			});
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			setConversation((prev) => [
				...prev,
				{ role: 'gemini', content: data.answer },
			]);

			if (isTTSActive) {
				speakOutLoud(data.answer);
			}
		} catch (error) {
			console.error('Error:', error);
			setConversation((prev) => [
				...prev,
				{ role: 'gemini', content: "Sorry, I couldn't process your request." },
			]);
		} finally {
			setLoading(false);
			setQuestion('');
			setFile(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
			chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const handleAskButtonClick = () => {
		const trimmedQuestion = question.trim();
		if (trimmedQuestion) {
			askQuestion(trimmedQuestion);
		} else {
			alert('Please enter a question.');
		}
	};

    //file upload
	const handleFileChange = (e) => {
		const uploadedFile = e.target.files[0];
		const validTypes = [
			'text/plain',
			'text/csv',
			'application/json',
			'application/pdf',
		];
		const maxSizeInMB = 20;

		if (uploadedFile) {
			if (!validTypes.includes(uploadedFile.type)) {
				setFile(null);
				setError('File type not supported. Please upload a valid file.');
				if (fileInputRef.current) {
					fileInputRef.current.value = '';
				}
				return;
			}

			if (uploadedFile.size > maxSizeInMB * 1024 * 1024) {
				setFile(null);
				setError(`File size should not exceed ${maxSizeInMB} MB.`);
				if (fileInputRef.current) {
					fileInputRef.current.value = '';
				}
				return;
			}

			setFile(uploadedFile);
			setError('');
		}
	};

    // Separating code Blocks from normal responses
	const extractCodeBlocks = (text) => {
		const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
		const parts = [];
		let lastIndex = 0;

		let match;
		while ((match = codeBlockRegex.exec(text)) !== null) {
			if (match.index > lastIndex) {
				parts.push({
					type: 'text',
					content: text.slice(lastIndex, match.index),
				});
			}
			parts.push({ type: 'code', content: match[2], language: match[1] || '' });
			lastIndex = codeBlockRegex.lastIndex;
		}

		if (lastIndex < text.length) {
			parts.push({ type: 'text', content: text.slice(lastIndex) });
		}

		return parts;
	};

    // Text- to -speech
	const speakOutLoud = (text) => {
		const synth = window.speechSynthesis;
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.voice = synth.getVoices().find((voice) => voice.lang === 'en-US');
		synth.speak(utterance);
	};

	const toggleTTS = () => {
		setIsTTSActive((prev) => !prev);
	};

	if (!browserSupportsSpeechRecognition) {
		return <div>Your browser does not support speech recognition.</div>;
	}

	return (
		<div className='app-container'>
			<aside className='sidebar'>
				<div className='sidebar-logo'>
					<img src={logo} alt='Veggie Logo' />
				</div>
				<h1>VEGA AI</h1>
				<nav className='sidebar-nav'>
					<ul>
						<li>
							<a href='/'>Chat</a>
						</li>
						<li>History</li>
						<li>Settings</li>
						<li>Help</li>
					</ul>
				</nav>

				<div className='auth'>
					<ul>
						<li>
							{' '}
							<a href='/login'>Login</a>
						</li>
						<li>
							<a href='/signup'>Signup</a>
						</li>
					</ul>
				</div>
			</aside>

			<main className='main-content'>
				<header className='header'>
					<h1>How may I help you?</h1>
				</header>

				<div className='chat-container'>
					{conversation.map((msg, index) => {
						const parts = extractCodeBlocks(msg.content);
						return (
							<div key={index} className={`message ${msg.role}`}>
								<strong>{msg.role === 'user' ? 'You' : 'Gemini'}:</strong>
								{parts.map((part, i) => {
									if (part.type === 'code') {
										return (
											<CodeBlock
												key={i}
												code={part.content}
												language={part.language}
											/>
										);
									} else {
										return (
											<div
												key={i}
												className='explanation'
												dangerouslySetInnerHTML={{
													__html: marked(part.content),
												}}
											/>
										);
									}
								})}
							</div>
						);
					})}
					<div ref={chatEndRef} />
				</div>

				<textarea
					className='textarea'
					rows='4'
					placeholder='Ask a question...'
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
				/>
				<br />

				<input type='file' onChange={handleFileChange} ref={fileInputRef} />

				{error && <div className='error'>{error}</div>}

				<div className='voice-controls'>
					<button onClick={startListening} disabled={loading || listening}>
						{listening ? 'Listening...' : 'Start Voice Chat'}
					</button>
					<button onClick={stopListening} disabled={!listening}>
						Stop Voice Chat
					</button>
				</div>

				<button
					className='button'
					onClick={handleAskButtonClick}
					disabled={loading}
				>
					{loading ? 'Loading...' : 'Ask'}
				</button>

				{/* Text-to-Speech Toggle Button */}
				<button className='button tts-toggle' onClick={toggleTTS}>
					{isTTSActive ? 'Disable Voice Response' : 'Enable Voice Response'}
				</button>
			</main>
		</div>
	);
}

export default Home;
